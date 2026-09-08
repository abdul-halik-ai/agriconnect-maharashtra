import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district");
    const minCapacity = searchParams.get("minCapacity");

    const [transporters, storages] = await Promise.all([
      db.transportProvider.findMany({
        where: { isAvailable: true },
        orderBy: { rating: "desc" },
      }),
      db.storageFacility.findMany({
        orderBy: { monthlyRatePerQuintal: "asc" },
      }),
    ]);

    return NextResponse.json({ transporters, storages });
  } catch (error) {
    console.warn("Logistics DB query failed, serving demo logistics:", error);
    const { MOCK_TRANSPORTERS, MOCK_STORAGES } = await import("@/lib/mockData");
    return NextResponse.json({ transporters: MOCK_TRANSPORTERS, storages: MOCK_STORAGES });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      transactionId,
      bookingType, // TRANSPORT or STORAGE
      transportProviderId,
      storageFacilityId,
      durationDays = 1,
      estimatedCost,
    } = body;

    if (!userId || !bookingType) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    const booking = await db.booking.create({
      data: {
        userId,
        transactionId: transactionId || null,
        bookingType,
        transportProviderId: transportProviderId || null,
        storageFacilityId: storageFacilityId || null,
        durationDays: Number(durationDays),
        estimatedCost: Number(estimatedCost || 0),
        status: "CONFIRMED",
      },
      include: {
        transportProvider: true,
        storageFacility: true,
      },
    });

    // If booking is for a deal, advance deal to LOGISTICS_SCHEDULED if at step 1
    if (transactionId && bookingType === "TRANSPORT") {
      const deal = await db.transaction.findUnique({ where: { id: transactionId } });
      if (deal && deal.stage === "OFFER_ACCEPTED") {
        await db.transaction.update({
          where: { id: transactionId },
          data: {
            stage: "LOGISTICS_SCHEDULED",
            qualityInspectorNote: `Transport booked: ${booking.transportProvider?.companyName} (${booking.transportProvider?.vehicleType}). Scheduled for dispatch.`,
          },
        });
      }
    }

    await db.notification.create({
      data: {
        userId,
        title: `${bookingType === "TRANSPORT" ? "Logistics" : "Warehouse Storage"} Booked Successfully`,
        message: `Booking #${booking.id.slice(-6).toUpperCase()} confirmed. Rate estimate: ₹${estimatedCost}.`,
        link: transactionId ? `/farmer/deals/${transactionId}` : `/farmer/logistics`,
        type: "DEAL_STAGE",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Logistics POST error:", error);
    return NextResponse.json({ error: "Failed to book logistics" }, { status: 500 });
  }
}
