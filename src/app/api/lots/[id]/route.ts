import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lot = await db.lot.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            district: true,
            farmerProfile: true,
            fpoProfile: true,
          },
        },
        commodity: true,
        market: true,
        contributions: {
          include: {
            farmer: {
              select: { id: true, name: true, phone: true, district: true },
            },
          },
        },
        offers: {
          include: {
            buyer: {
              select: { id: true, name: true, buyerProfile: true },
            },
          },
        },
        transactions: true,
      },
    });

    if (!lot) {
      const { MOCK_LOTS } = await import("@/lib/mockData");
      const found = MOCK_LOTS.find((l) => l.id === params.id || l.lotNumber === params.id);
      if (found) return NextResponse.json(found);
      return NextResponse.json({ error: "Lot not found" }, { status: 404 });
    }

    return NextResponse.json(lot);
  } catch (error) {
    console.warn("Single Lot DB query failed, checking demo fallback:", error);
    const { MOCK_LOTS } = await import("@/lib/mockData");
    const found = MOCK_LOTS.find((l) => l.id === params.id || l.lotNumber === params.id);
    if (found) return NextResponse.json(found);
    return NextResponse.json(MOCK_LOTS[0]);
  }
}
