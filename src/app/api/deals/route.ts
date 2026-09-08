import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");
    const stage = searchParams.get("stage");

    const where: any = {};
    if (userId) {
      if (role === "BUYER") {
        where.buyerId = userId;
      } else if (role === "FARMER" || role === "FPO") {
        where.sellerId = userId;
      }
    }
    if (stage && stage !== "ALL") {
      where.stage = stage;
    }

    const deals = await db.transaction.findMany({
      where,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            district: true,
            buyerProfile: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            phone: true,
            district: true,
            role: true,
            fpoProfile: true,
          },
        },
        lot: {
          include: {
            contributions: {
              include: {
                farmer: {
                  select: { id: true, name: true, phone: true, district: true },
                },
              },
            },
          },
        },
        commodity: true,
        disputes: true,
        bookings: {
          include: {
            transportProvider: true,
            storageFacility: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.warn("Deals DB query failed, serving deterministic demo deals:", error);
    const { MOCK_DEALS } = await import("@/lib/mockData");
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");

    let filtered = [...MOCK_DEALS];
    if (stage && stage !== "ALL") {
      filtered = filtered.filter((d) => d.stage === stage);
    }
    return NextResponse.json(filtered);
  }
}

// Stage transition pipeline handler
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      dealId,
      targetStage,
      note,
      confirmedMoisture,
      confirmedGrade,
      weighmentSlipUrl,
    } = body;

    const deal = await db.transaction.findUnique({
      where: { id: dealId },
      include: {
        buyer: true,
        seller: true,
        lot: {
          include: { contributions: true },
        },
        commodity: true,
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const updateData: any = {
      stage: targetStage,
    };

    if (note) updateData.qualityInspectorNote = note;
    if (confirmedMoisture !== undefined) updateData.confirmedMoisture = Number(confirmedMoisture);
    if (confirmedGrade) updateData.confirmedGrade = confirmedGrade;
    if (weighmentSlipUrl) updateData.weighmentSlipUrl = weighmentSlipUrl;

    // Escrow logic on specific stages
    if (targetStage === "PAYMENT_RELEASED" || targetStage === "COMPLETED") {
      updateData.escrowStatus = "RELEASED";

      // If FPO lot, disburse proportional payouts to each contributing farmer!
      if (deal.lot && deal.lot.isAggregated && deal.lot.contributions.length > 0) {
        // Total deal amount minus 1.5% FPO commission
        const fpoCommission = deal.totalAmount * 0.015;
        const distributablePool = deal.totalAmount - fpoCommission;

        for (const contribution of deal.lot.contributions) {
          const farmerShare = (contribution.sharePercentage / 100) * distributablePool;
          await db.lotContribution.update({
            where: { id: contribution.id },
            data: {
              payoutAmount: Number(farmerShare.toFixed(0)),
              payoutStatus: "RELEASED",
            },
          });

          // Send notification to farmer
          await db.notification.create({
            data: {
              userId: contribution.farmerId,
              title: `Payout Released: ₹${Number(farmerShare.toFixed(0)).toLocaleString("en-IN")}`,
              message: `Your share (${contribution.sharePercentage}%) for pooled lot deal ${deal.dealNumber} has been released to your registered bank account.`,
              link: `/farmer/deals/${deal.id}`,
              type: "PAYMENT",
            },
          });
        }
      }
    }

    const updated = await db.transaction.update({
      where: { id: dealId },
      data: updateData,
    });

    // Notify both parties of stage update
    const stageTitles: Record<string, string> = {
      LOGISTICS_SCHEDULED: "Logistics Scheduled",
      IN_TRANSIT: "Produce In Transit",
      DELIVERED: "Produce Delivered at Depot",
      QUALITY_CONFIRMED: "Quality Confirmed & Approved",
      PAYMENT_RELEASED: "Escrow Payment Released",
      COMPLETED: "Deal Completed Successfully",
    };

    const stageTitle = stageTitles[targetStage] || targetStage;

    await Promise.all([
      db.notification.create({
        data: {
          userId: deal.buyerId,
          title: `Deal ${deal.dealNumber}: ${stageTitle}`,
          message: note || `Deal status advanced to ${stageTitle}.`,
          link: `/buyer/deals/${deal.id}`,
          type: "DEAL_STAGE",
        },
      }),
      db.notification.create({
        data: {
          userId: deal.sellerId,
          title: `Deal ${deal.dealNumber}: ${stageTitle}`,
          message: note || `Deal status advanced to ${stageTitle}.`,
          link: `/farmer/deals/${deal.id}`,
          type: "DEAL_STAGE",
        },
      }),
    ]);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Deal PATCH error:", error);
    return NextResponse.json({ error: "Failed to update deal stage" }, { status: 500 });
  }
}
