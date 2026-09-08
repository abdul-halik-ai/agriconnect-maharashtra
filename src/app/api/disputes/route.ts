import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;

    const disputes = await db.dispute.findMany({
      where,
      include: {
        transaction: {
          include: {
            buyer: { select: { id: true, name: true, phone: true, buyerProfile: true } },
            seller: { select: { id: true, name: true, phone: true, role: true, fpoProfile: true } },
            lot: true,
            commodity: true,
          },
        },
        raisedBy: {
          select: { id: true, name: true, phone: true, role: true },
        },
        resolvedBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(disputes);
  } catch (error) {
    console.warn("Disputes DB query failed, serving demo disputes:", error);
    const { MOCK_DISPUTES } = await import("@/lib/mockData");
    return NextResponse.json(MOCK_DISPUTES);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      transactionId,
      raisedById,
      reasonCategory,
      description,
      evidenceUrls = [],
    } = body;

    if (!transactionId || !raisedById || !reasonCategory || !description) {
      return NextResponse.json({ error: "Missing required dispute fields" }, { status: 400 });
    }

    const dispute = await db.dispute.create({
      data: {
        transactionId,
        raisedById,
        reasonCategory,
        description,
        evidenceUrls: JSON.stringify(evidenceUrls),
        status: "OPEN",
      },
      include: {
        transaction: true,
        raisedBy: true,
      },
    });

    // Notify state admin
    const admins = await db.user.findMany({ where: { role: "ADMIN" } });
    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: `New Dispute Raised: ${dispute.transaction.dealNumber}`,
          message: `${dispute.raisedBy.name} raised dispute for reason: ${reasonCategory}. Review required.`,
          link: `/admin/disputes`,
          type: "DISPUTE",
        },
      });
    }

    return NextResponse.json(dispute, { status: 201 });
  } catch (error) {
    console.error("Disputes POST error:", error);
    return NextResponse.json({ error: "Failed to raise dispute" }, { status: 500 });
  }
}

// Admin status resolution handler
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { disputeId, status, resolutionNotes, adminId } = body;

    if (!disputeId || !status) {
      return NextResponse.json({ error: "Missing disputeId or status" }, { status: 400 });
    }

    const dispute = await db.dispute.findUnique({
      where: { id: disputeId },
      include: {
        transaction: true,
        raisedBy: true,
      },
    });

    if (!dispute) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
    }

    const updated = await db.dispute.update({
      where: { id: disputeId },
      data: {
        status,
        resolutionNotes: resolutionNotes || null,
        resolvedById: adminId || null,
        resolvedAt: status === "RESOLVED" || status === "REJECTED" ? new Date() : null,
      },
    });

    // Notify the parties
    await Promise.all([
      db.notification.create({
        data: {
          userId: dispute.transaction.buyerId,
          title: `Dispute Update: ${dispute.transaction.dealNumber}`,
          message: `Dispute status updated to ${status}. ${resolutionNotes || ''}`,
          link: `/buyer/deals/${dispute.transactionId}`,
          type: "DISPUTE",
        },
      }),
      db.notification.create({
        data: {
          userId: dispute.transaction.sellerId,
          title: `Dispute Update: ${dispute.transaction.dealNumber}`,
          message: `Dispute status updated to ${status}. ${resolutionNotes || ''}`,
          link: `/farmer/deals/${dispute.transactionId}`,
          type: "DISPUTE",
        },
      }),
    ]);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Disputes PATCH error:", error);
    return NextResponse.json({ error: "Failed to resolve dispute" }, { status: 500 });
  }
}
