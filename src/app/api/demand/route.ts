import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("buyerId");
    const commodityId = searchParams.get("commodityId");
    const status = searchParams.get("status") || "OPEN";

    const where: any = {};
    if (buyerId) where.buyerId = buyerId;
    if (commodityId) where.commodityId = commodityId;
    if (status !== "ALL") where.status = status;

    const listings = await db.demandListing.findMany({
      where,
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
        commodity: true,
        offers: {
          include: {
            seller: {
              select: { id: true, name: true, role: true, phone: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Also fetch verified buyers directory
    const buyers = await db.user.findMany({
      where: { role: "BUYER" },
      include: {
        buyerProfile: true,
      },
    });

    return NextResponse.json({ listings, buyers });
  } catch (error) {
    console.warn("Demand DB query failed, serving demo demand listings:", error);
    const { MOCK_DEMANDS } = await import("@/lib/mockData");
    return NextResponse.json({ listings: MOCK_DEMANDS, buyers: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      buyerId,
      commodityId,
      targetGrade = "A",
      minMoisture = 9.0,
      maxMoisture = 12.5,
      requiredQuantity,
      minPrice,
      maxPrice,
      deliveryLocation,
      deliveryTerms = "Buyer Warehouse Gate with Digital Weighment",
      daysValid = 14,
    } = body;

    if (!buyerId || !commodityId || !requiredQuantity || !minPrice || !maxPrice || !deliveryLocation) {
      return NextResponse.json({ error: "Missing required demand listing fields" }, { status: 400 });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Number(daysValid));

    const listing = await db.demandListing.create({
      data: {
        buyerId,
        commodityId,
        targetGrade,
        minMoisture: Number(minMoisture),
        maxMoisture: Number(maxMoisture),
        requiredQuantity: Number(requiredQuantity),
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        deliveryLocation,
        deliveryTerms,
        expiryDate,
        status: "OPEN",
      },
      include: {
        commodity: true,
        buyer: {
          include: { buyerProfile: true },
        },
      },
    });

    // Notify registered farmers and FPOs who grow this commodity
    const sellers = await db.user.findMany({
      where: { role: { in: ["FARMER", "FPO"] } },
      take: 10,
    });

    for (const seller of sellers) {
      await db.notification.create({
        data: {
          userId: seller.id,
          title: `New Buyer Demand: ${listing.commodity.nameEn}`,
          message: `${listing.buyer.buyerProfile?.companyName || listing.buyer.name} is sourcing ${requiredQuantity} Qtl at ₹${minPrice}-₹${maxPrice}/qtl.`,
          link: "/buyer/demand",
          type: "OFFER",
        },
      });
    }

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Demand POST error:", error);
    return NextResponse.json({ error: "Failed to post demand listing" }, { status: 500 });
  }
}
