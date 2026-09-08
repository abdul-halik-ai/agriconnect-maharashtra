import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    const where: any = {};
    if (userId) {
      if (role === "BUYER") {
        where.buyerId = userId;
      } else {
        where.sellerId = userId;
      }
    }

    const offers = await db.offer.findMany({
      where,
      include: {
        buyer: {
          select: { id: true, name: true, phone: true, buyerProfile: true },
        },
        seller: {
          select: { id: true, name: true, phone: true, role: true, fpoProfile: true },
        },
        lot: {
          include: { commodity: true },
        },
        demandListing: {
          include: { commodity: true },
        },
        transaction: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Offers GET error:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      buyerId,
      sellerId,
      lotId,
      demandListingId,
      offeredPrice,
      offeredQuantity,
      deliveryLocation,
      paymentTerms = "100% Escrow on Quality Acceptance",
      notes,
    } = body;

    if (!buyerId || !sellerId || !offeredPrice || !offeredQuantity || !deliveryLocation) {
      return NextResponse.json({ error: "Missing required offer fields" }, { status: 400 });
    }

    const newOffer = await db.offer.create({
      data: {
        buyerId,
        sellerId,
        lotId: lotId || null,
        demandListingId: demandListingId || null,
        offeredPrice: Number(offeredPrice),
        offeredQuantity: Number(offeredQuantity),
        deliveryLocation,
        paymentTerms,
        notes: notes || "Digital offer submitted via AgriConnect platform.",
        status: "PENDING",
      },
      include: {
        buyer: true,
        seller: true,
        lot: { include: { commodity: true } },
      },
    });

    // Notify the seller
    await db.notification.create({
      data: {
        userId: sellerId,
        title: `New Offer Received: ₹${offeredPrice}/qtl`,
        message: `${newOffer.buyer.name} sent an offer for ${offeredQuantity} Qtl. Review and accept/counter in Deals tab.`,
        link: `/farmer/deals`,
        type: "OFFER",
      },
    });

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error("Offers POST error:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}

// Handler to accept, counter, or reject an offer
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, action, counterPrice, actorId } = body;

    const offer = await db.offer.findUnique({
      where: { id: offerId },
      include: {
        buyer: true,
        seller: true,
        lot: { include: { commodity: true } },
        demandListing: { include: { commodity: true } },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    if (action === "REJECT") {
      const updated = await db.offer.update({
        where: { id: offerId },
        data: { status: "REJECTED" },
      });

      await db.notification.create({
        data: {
          userId: offer.buyerId,
          title: `Offer Declined`,
          message: `${offer.seller.name} has declined your offer of ₹${offer.offeredPrice}/qtl.`,
          link: `/buyer/deals`,
          type: "OFFER",
        },
      });

      return NextResponse.json(updated);
    }

    if (action === "COUNTER") {
      const updated = await db.offer.update({
        where: { id: offerId },
        data: {
          status: "COUNTERED",
          counterPrice: Number(counterPrice),
        },
      });

      await db.notification.create({
        data: {
          userId: offer.buyerId,
          title: `Counter-Offer Received: ₹${counterPrice}/qtl`,
          message: `${offer.seller.name} countered your offer with ₹${counterPrice}/qtl.`,
          link: `/buyer/deals`,
          type: "OFFER",
        },
      });

      return NextResponse.json(updated);
    }

    if (action === "ACCEPT") {
      // 1. Mark offer as ACCEPTED
      const updatedOffer = await db.offer.update({
        where: { id: offerId },
        data: { status: "ACCEPTED" },
      });

      // 2. Identify commodity & lot
      const commodityId = offer.lot?.commodityId || offer.demandListing?.commodityId || "c_onion";
      const lotId = offer.lotId || "lot_ramesh_onion";
      const finalPrice = offer.counterPrice || offer.offeredPrice;
      const totalAmount = finalPrice * offer.offeredQuantity;

      const randomDealNum = Math.floor(4000 + Math.random() * 5000);
      const dealNumber = `DEAL-MH-2026-${randomDealNum}`;

      // 3. Create active Transaction in step 1: OFFER_ACCEPTED
      const transaction = await db.transaction.create({
        data: {
          dealNumber,
          offerId: offer.id,
          buyerId: offer.buyerId,
          sellerId: offer.sellerId,
          lotId,
          commodityId,
          agreedPrice: finalPrice,
          agreedQuantity: offer.offeredQuantity,
          totalAmount,
          escrowStatus: "HELD",
          stage: "OFFER_ACCEPTED",
          deliveryLocation: offer.deliveryLocation,
          qualityInspectorNote: "Offer accepted by both parties. Escrow balance funded. Awaiting logistics dispatch.",
        },
        include: {
          buyer: true,
          seller: true,
          commodity: true,
        },
      });

      // Update lot status if exists
      if (offer.lotId) {
        await db.lot.update({
          where: { id: offer.lotId },
          data: { status: "UNDER_OFFER" },
        });
      }

      // Notify both parties
      await Promise.all([
        db.notification.create({
          data: {
            userId: offer.buyerId,
            title: `Deal Confirmed: ${dealNumber}`,
            message: `Offer accepted! ₹${totalAmount.toLocaleString("en-IN")} held in secure Escrow. Proceed to schedule logistics.`,
            link: `/buyer/deals/${transaction.id}`,
            type: "DEAL_STAGE",
          },
        }),
        db.notification.create({
          data: {
            userId: offer.sellerId,
            title: `Deal Confirmed: ${dealNumber}`,
            message: `Deal locked at ₹${finalPrice}/qtl! Buyer escrow verified. Track progress in Deals.`,
            link: `/farmer/deals/${transaction.id}`,
            type: "DEAL_STAGE",
          },
        }),
      ]);

      return NextResponse.json({ success: true, transaction, offer: updatedOffer });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Offers PATCH error:", error);
    return NextResponse.json({ error: "Failed to process offer action" }, { status: 500 });
  }
}
