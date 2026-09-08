import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateSellHoldRecommendation, calculateMarketArbitrage } from "@/lib/advisory";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const commodityId = searchParams.get("commodityId") || "c_onion";
    const marketId = searchParams.get("marketId") || "m_lasalgaon";
    const days = parseInt(searchParams.get("days") || "30", 10);

    // Fetch all commodities & markets for filters
    const [commodities, markets] = await Promise.all([
      db.commodity.findMany({ orderBy: { nameEn: "asc" } }),
      db.market.findMany({ orderBy: { nameEn: "asc" } }),
    ]);

    const targetCommodity = commodities.find((c: any) => c.id === commodityId) || commodities[0];
    const targetMarket = markets.find((m: any) => m.id === marketId) || markets[0];

    // Fetch historical price records for selected commodity & market
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const priceHistory = await db.priceRecord.findMany({
      where: {
        commodityId: targetCommodity.id,
        marketId: targetMarket.id,
        date: { gte: cutoffDate },
      },
      orderBy: { date: "asc" },
    });

    // Compute Sell/Hold heuristic recommendation
    const recommendation = calculateSellHoldRecommendation(
      targetCommodity.nameEn,
      targetCommodity.nameMr,
      targetMarket.nameEn,
      targetMarket.nameMr,
      priceHistory.map((p: any) => ({
        date: p.date,
        modalPrice: p.modalPrice,
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
        arrivalVolume: p.arrivalVolume,
      }))
    );

    // Fetch latest prices across ALL markets for this commodity to calculate arbitrage
    const latestDate = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].date : new Date();
    
    // Get latest record per market
    const allMarketLatestPrices = await Promise.all(
      markets.map(async (m: any) => {
        const latestRec = await db.priceRecord.findFirst({
          where: {
            commodityId: targetCommodity.id,
            marketId: m.id,
          },
          orderBy: { date: "desc" },
        });

        return {
          marketId: m.id,
          nameEn: m.nameEn,
          nameMr: m.nameMr,
          district: m.district,
          latitude: m.latitude,
          longitude: m.longitude,
          modalPrice: latestRec?.modalPrice || 2500,
        };
      })
    );

    const currentModal = recommendation.currentModal;
    const arbitrage = calculateMarketArbitrage(targetMarket.id, currentModal, allMarketLatestPrices);

    return NextResponse.json({
      commodities,
      markets,
      selectedCommodity: targetCommodity,
      selectedMarket: targetMarket,
      history: priceHistory.map((p: any) => ({
        id: p.id,
        date: p.date.toISOString().split("T")[0],
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
        modalPrice: p.modalPrice,
        arrivalVolume: p.arrivalVolume,
      })),
      recommendation,
      arbitrage,
      allMarketLatestPrices,
    });
  } catch (error) {
    console.error("Prices API error:", error);
    return NextResponse.json({ error: "Failed to load price intelligence" }, { status: 500 });
  }
}
