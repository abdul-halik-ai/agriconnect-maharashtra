import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = await db.transaction.findUnique({
      where: { id: params.id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            district: true,
            buyerProfile: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            district: true,
            role: true,
            farmerProfile: true,
            fpoProfile: true,
          },
        },
        commodity: true,
        lot: {
          include: {
            contributions: {
              include: {
                farmer: {
                  select: { id: true, name: true, phone: true, district: true, farmerProfile: true },
                },
              },
            },
          },
        },
        disputes: {
          include: {
            raisedBy: { select: { id: true, name: true, role: true } },
            resolvedBy: { select: { id: true, name: true } },
          },
        },
        bookings: {
          include: {
            transportProvider: true,
            storageFacility: true,
          },
        },
        offer: true,
      },
    });

    if (!deal) {
      const { MOCK_DEALS } = await import("@/lib/mockData");
      const found = MOCK_DEALS.find((d) => d.id === params.id || d.dealNumber === params.id);
      if (found) return NextResponse.json(found);
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json(deal);
  } catch (error) {
    console.warn("Deal GET single DB error, serving demo deal fallback:", error);
    const { MOCK_DEALS } = await import("@/lib/mockData");
    const found = MOCK_DEALS.find((d) => d.id === params.id || d.dealNumber === params.id);
    if (found) return NextResponse.json(found);
    return NextResponse.json(MOCK_DEALS[0]);
  }
}
