import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateLotPassportHash, generateLotQRCodeDataUrl } from "@/lib/passport";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creatorId");
    const commodityId = searchParams.get("commodityId");
    const status = searchParams.get("status");
    const isAggregated = searchParams.get("isAggregated");

    const where: any = {};
    if (creatorId) where.creatorId = creatorId;
    if (commodityId) where.commodityId = commodityId;
    if (status) where.status = status;
    if (isAggregated !== null && isAggregated !== undefined) {
      where.isAggregated = isAggregated === "true";
    }

    const lots = await db.lot.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, phone: true, role: true, district: true },
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
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(lots);
  } catch (error) {
    console.warn("Lots DB query failed, serving deterministic demo lots:", error);
    const { MOCK_LOTS } = await import("@/lib/mockData");
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creatorId");
    const commodityId = searchParams.get("commodityId");
    const isAggregated = searchParams.get("isAggregated");

    let filtered = [...MOCK_LOTS];
    if (creatorId) filtered = filtered.filter((l) => l.creatorId === creatorId);
    if (commodityId) filtered = filtered.filter((l) => l.commodityId === commodityId);
    if (isAggregated !== null && isAggregated !== undefined) {
      filtered = filtered.filter((l) => l.isAggregated === (isAggregated === "true"));
    }

    return NextResponse.json(filtered);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      creatorId,
      commodityId,
      marketId,
      quantityQuintals,
      basePriceExpected,
      moisturePercent,
      visualGrade,
      storageLocation,
      photoUrls = [],
    } = body;

    if (!creatorId || !commodityId || !quantityQuintals || !basePriceExpected) {
      return NextResponse.json({ error: "Missing required lot parameters" }, { status: 400 });
    }

    const [user, commodity] = await Promise.all([
      db.user.findUnique({ where: { id: creatorId } }),
      db.commodity.findUnique({ where: { id: commodityId } }),
    ]);

    if (!user || !commodity) {
      return NextResponse.json({ error: "User or commodity not found" }, { status: 404 });
    }

    // Generate unique lot number (e.g. MH-NSK-2026-XXXX)
    const distCode = (user.district || "MAHA").slice(0, 3).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const lotNumber = `MH-${distCode}-2026-${randomSuffix}`;

    // Cryptographic integrity hash
    const passportHash = generateLotPassportHash({
      lotNumber,
      creatorName: user.name,
      creatorRole: user.role,
      commodityNameEn: commodity.nameEn,
      commodityNameMr: commodity.nameMr,
      quantityQuintals: Number(quantityQuintals),
      moisturePercent: Number(moisturePercent || 11.5),
      visualGrade: visualGrade || "A",
      harvestDate: new Date().toISOString(),
      storageLocation: storageLocation || "Farm Gate",
      district: user.district || "Maharashtra",
      issuedAt: new Date().toISOString(),
    });

    const lotId = `lot_${Date.now()}`;
    const qrCodeData = await generateLotQRCodeDataUrl(lotId, lotNumber, passportHash);

    const newLot = await db.lot.create({
      data: {
        id: lotId,
        lotNumber,
        ownerType: user.role === "FPO" ? "FPO" : "FARMER",
        creatorId: user.id,
        commodityId: commodity.id,
        marketId: marketId || null,
        quantityQuintals: Number(quantityQuintals),
        basePriceExpected: Number(basePriceExpected),
        moisturePercent: Number(moisturePercent || 11.5),
        visualGrade: visualGrade || "A",
        status: "AVAILABLE",
        digitalPassportHash: passportHash,
        qrCodeData,
        photoUrls: JSON.stringify(photoUrls.length > 0 ? photoUrls : [commodity.imageUrl || ""]),
        storageLocation: storageLocation || "Farm Gate",
        isAggregated: false,
      },
      include: {
        creator: true,
        commodity: true,
      },
    });

    // Notify user of passport creation
    await db.notification.create({
      data: {
        userId: user.id,
        title: `Digital Passport Generated for Lot #${lotNumber}`,
        message: `Your ${commodity.nameEn} lot (${quantityQuintals} Qtl) has been verified and registered with SHA-256 security hash.`,
        link: `/farmer/lots/${newLot.id}/passport`,
        type: "PRICE_ALERT",
      },
    });

    return NextResponse.json(newLot, { status: 201 });
  } catch (error) {
    console.error("Lots POST error:", error);
    return NextResponse.json({ error: "Failed to generate digital lot" }, { status: 500 });
  }
}
