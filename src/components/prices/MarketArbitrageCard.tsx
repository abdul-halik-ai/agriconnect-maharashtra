"use client";

import React from "react";
import { NearbyMarketArbitrage } from "@/lib/advisory";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import { Navigation, MapPin, Truck, ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface MarketArbitrageCardProps {
  arbitrage: NearbyMarketArbitrage[];
  currentMarketName: string;
}

export function MarketArbitrageCard({
  arbitrage,
  currentMarketName,
}: MarketArbitrageCardProps) {
  const { language } = useApp();
  const isMr = language === "mr";

  if (!arbitrage || arbitrage.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-agri-600" />
            <span>{isMr ? "जवळचे बाजार व नफा तुलना" : "Nearby Market Comparison & Arbitrage"}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isMr
              ? `${currentMarketName} च्या तुलनेत इतर बाजार समित्यांमधील नफा (वाहतूक खर्च वजा जाता)`
              : `Net gain compared to ${currentMarketName} after deducting estimated transit costs`}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold">
              <th className="pb-2.5 font-bold">{isMr ? "बाजार समिती" : "APMC Market"}</th>
              <th className="pb-2.5 font-bold">{isMr ? "अंतर" : "Distance"}</th>
              <th className="pb-2.5 font-bold">{isMr ? "बाजार दर" : "Modal Rate"}</th>
              <th className="pb-2.5 font-bold">{isMr ? "अपेक्षित वाहतूक" : "Est. Transport"}</th>
              <th className="pb-2.5 font-bold">{isMr ? "निव्वळ फायदा" : "Net Realized Gain"}</th>
              <th className="pb-2.5 font-bold text-right">{isMr ? "शिफारस" : "Worth Trip?"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {arbitrage.map((m) => {
              const isPositive = m.netGainPerQtl > 0;
              return (
                <tr key={m.marketId} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 pr-2">
                    <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-stone-400" />
                      <span>{isMr ? m.marketNameMr : m.marketNameEn}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 pl-5">{m.district}</span>
                  </td>
                  <td className="py-3 text-stone-600 font-mono">{m.distanceKm} km</td>
                  <td className="py-3 font-semibold text-stone-900 font-mono">
                    {formatINR(m.modalPrice)}/qtl
                  </td>
                  <td className="py-3 text-stone-500 font-mono">
                    {formatINR(m.estTransportCostPerQtl)}/qtl
                  </td>
                  <td className="py-3">
                    <span
                      className={`font-bold font-mono text-sm inline-flex items-center gap-0.5 ${
                        m.isWorthTrip ? "text-emerald-700" : isPositive ? "text-stone-700" : "text-stone-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatINR(m.netGainPerQtl)}/qtl
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {m.isWorthTrip ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="h-3 w-3" />
                        {isMr ? "जाणे फायद्याचे" : "Worth Traveling"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-500">
                        {isMr ? "स्थानिक विका" : "Sell Locally"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
        <span className="flex items-center gap-1">
          <Truck className="h-3.5 w-3.5 text-stone-400" />
          Transport cost estimated at ~₹1.35 per quintal/km via local mini-truck carriers
        </span>
      </div>
    </div>
  );
}
