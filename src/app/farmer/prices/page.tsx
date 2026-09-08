"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { PriceTrendChart } from "@/components/prices/PriceTrendChart";
import { SellHoldRecommendationCard } from "@/components/prices/SellHoldRecommendationCard";
import { MarketArbitrageCard } from "@/components/prices/MarketArbitrageCard";
import {
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Layers,
} from "lucide-react";

export default function FarmerPricesPage() {
  const { language } = useApp();
  const isMr = language === "mr";

  const [commodityId, setCommodityId] = useState("c_onion");
  const [marketId, setMarketId] = useState("m_lasalgaon");
  const [days, setDays] = useState(30);

  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState<any>(null);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/prices?commodityId=${commodityId}&marketId=${marketId}&days=${days}`
      );
      if (res.ok) {
        const data = await res.json();
        setPriceData(data);
      }
    } catch (err) {
      console.error("Failed to load prices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [commodityId, marketId, days]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & APMC Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri-700">
            <TrendingUp className="h-4 w-4" />
            <span>{isMr ? "थेट बाजार भाव व तज्ज्ञ सल्ला" : "Real-Time Mandi Intelligence & Advisory"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            {isMr ? "बाजार भाव व विक्रीचा योग्य सल्ला" : "Mandi Prices & Sell/Hold Advisory"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {isMr
              ? "महाराष्ट्र शासनाच्या अधिकृत बाजार समित्यांचे थेट दर, आवक आणि नफ्याची संधी"
              : "Direct daily rates, arrival volumes, and plain-language selling guidance across Maharashtra APMCs"}
          </p>
        </div>

        {/* Market Selector Pill */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-stone-400 flex-shrink-0" />
          <select
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800 text-xs sm:text-sm shadow-subtle focus:ring-2 focus:ring-agri-500 outline-none"
          >
            {priceData?.markets?.map((m: any) => (
              <option key={m.id} value={m.id}>
                {isMr ? m.nameMr : m.nameEn} ({m.district})
              </option>
            ))}
          </select>

          <button
            onClick={fetchPrices}
            disabled={loading}
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition"
            title="Refresh prices"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Commodity Chips Horizontal Scroll */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-max">
          {priceData?.commodities?.map((c: any) => {
            const isSelected = c.id === commodityId;
            return (
              <button
                key={c.id}
                onClick={() => setCommodityId(c.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 border ${
                  isSelected
                    ? "bg-agri-700 text-white border-agri-800 shadow-sm"
                    : "bg-white text-stone-700 hover:bg-stone-50 border-stone-200"
                }`}
              >
                <span>{isMr ? c.nameMr : c.nameEn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? "bg-agri-800 text-emerald-200" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  MSP ₹{c.mspPrice}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      {loading && !priceData ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200 text-stone-500">
          <RefreshCw className="h-8 w-8 text-agri-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-700">
            Analyzing 35-day APMC arrival & price trends...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Centerpiece: Plain Language Sell/Hold Recommendation */}
          {priceData?.recommendation && (
            <SellHoldRecommendationCard
              recommendation={priceData.recommendation}
              commodityNameEn={priceData.selectedCommodity.nameEn}
              commodityNameMr={priceData.selectedCommodity.nameMr}
              marketNameEn={priceData.selectedMarket.nameEn}
              marketNameMr={priceData.selectedMarket.nameMr}
            />
          )}

          {/* Interactive Recharts Chart */}
          <PriceTrendChart
            data={priceData?.history || []}
            commodityName={isMr ? priceData?.selectedCommodity.nameMr : priceData?.selectedCommodity.nameEn}
            marketName={isMr ? priceData?.selectedMarket.nameMr : priceData?.selectedMarket.nameEn}
            selectedDays={days}
            onDaysChange={(d) => setDays(d)}
          />

          {/* Nearby Market Arbitrage Card */}
          {priceData?.arbitrage && (
            <MarketArbitrageCard
              arbitrage={priceData.arbitrage}
              currentMarketName={
                isMr ? priceData?.selectedMarket.nameMr : priceData?.selectedMarket.nameEn
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
