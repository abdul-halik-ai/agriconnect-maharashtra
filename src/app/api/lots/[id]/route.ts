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
      return NextResponse.json({ error: "Lot not found" }, { status: 404 });
    }

    return NextResponse.json(lot);
  } catch (error) {
    console.error("Single Lot GET error:", error);
    return NextResponse.json({ error: "Failed to fetch lot" }, { status: 500 });
  }
}
