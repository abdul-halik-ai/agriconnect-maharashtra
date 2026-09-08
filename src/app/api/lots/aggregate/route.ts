import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateLotPassportHash, generateLotQRCodeDataUrl } from "@/lib/passport";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fpoUserId,
      commodityId,
      marketId,
      basePriceExpected,
      storageLocation,
      contributions, // Array of { farmerId, contributedWeight, moisturePercent, visualGrade }
    } = body;

    if (!fpoUserId || !commodityId || !contributions || contributions.length === 0) {
      return NextResponse.json({ error: "Missing aggregation data or contributions" }, { status: 400 });
    }

    const [fpoUser, commodity] = await Promise.all([
      db.user.findUnique({
        where: { id: fpoUserId },
        include: { fpoProfile: true },
      }),
      db.commodity.findUnique({ where: { id: commodityId } }),
    ]);

    if (!fpoUser || !commodity) {
      return NextResponse.json({ error: "FPO or Commodity not found" }, { status: 404 });
    }

    // Calculate total pooled weight and weighted average moisture
    const totalWeight = contributions.reduce((sum: number, c: any) => sum + Number(c.contributedWeight), 0);
    const weightedMoisture =
      contributions.reduce((sum: number, c: any) => sum + Number(c.contributedWeight) * Number(c.moisturePercent || 11.5), 0) /
      totalWeight;

    // Lot number
    const distCode = (fpoUser.district || "MAHA").slice(0, 3).toUpperCase();
    const randomSuffix = Math.floor(2000 + Math.random() * 7000);
    const lotNumber = `FPO-${distCode}-2026-${randomSuffix}`;

    // Cryptographic hash for aggregated lot
    const passportHash = generateLotPassportHash({
      lotNumber,
      creatorName: fpoUser.fpoProfile?.fpoName || fpoUser.name,
      creatorRole: "FPO Collective Pool",
      commodityNameEn: commodity.nameEn,
      commodityNameMr: commodity.nameMr,
      quantityQuintals: totalWeight,
      moisturePercent: Number(weightedMoisture.toFixed(1)),
      visualGrade: "A",
      harvestDate: new Date().toISOString(),
      storageLocation: storageLocation || "FPO Central Aggregation Depot",
      district: fpoUser.district || "Maharashtra",
      issuedAt: new Date().toISOString(),
    });

    const lotId = `lot_fpo_${Date.now()}`;
    const qrCodeData = await generateLotQRCodeDataUrl(lotId, lotNumber, passportHash);

    // Create the aggregated Lot
    const aggregatedLot = await db.lot.create({
      data: {
        id: lotId,
        lotNumber,
        ownerType: "FPO",
        creatorId: fpoUser.id,
        commodityId: commodity.id,
        marketId: marketId || null,
        quantityQuintals: totalWeight,
        basePriceExpected: Number(basePriceExpected),
        moisturePercent: Number(weightedMoisture.toFixed(1)),
        visualGrade: "A",
        status: "AVAILABLE",
        digitalPassportHash: passportHash,
        qrCodeData,
        photoUrls: JSON.stringify([commodity.imageUrl || ""]),
        storageLocation: storageLocation || `${fpoUser.fpoProfile?.fpoName || fpoUser.name} Central Depot`,
        isAggregated: true,
      },
    });

    // Create individual farmer contribution entries with their exact share %
    for (const c of contributions) {
      const share = (Number(c.contributedWeight) / totalWeight) * 100;
      await db.lotContribution.create({
        data: {
          aggregatedLotId: aggregatedLot.id,
          farmerId: c.farmerId,
          contributedWeight: Number(c.contributedWeight),
          moisturePercent: Number(c.moisturePercent || 11.5),
          visualGrade: c.visualGrade || "A",
          sharePercentage: Number(share.toFixed(2)),
          payoutStatus: "PENDING",
        },
      });

      // Notify the contributing farmer
      await db.notification.create({
        data: {
          userId: c.farmerId,
          title: `Produce Added to FPO Pool: ${aggregatedLot.lotNumber}`,
          message: `${c.contributedWeight} Qtl of your ${commodity.nameEn} was pooled into ${fpoUser.fpoProfile?.fpoName || 'FPO'} lot. Your share: ${share.toFixed(1)}%.`,
          link: `/farmer/lots/${aggregatedLot.id}/passport`,
          type: "DEAL_STAGE",
        },
      });
    }

    return NextResponse.json({ success: true, lot: aggregatedLot }, { status: 201 });
  } catch (error) {
    console.error("Aggregation error:", error);
    return NextResponse.json({ error: "Failed to create aggregated lot" }, { status: 500 });
  }
}
