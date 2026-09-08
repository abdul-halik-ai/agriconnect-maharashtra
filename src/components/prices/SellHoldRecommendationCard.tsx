"use client";

import React from "react";
import { RecommendationResult } from "@/lib/advisory";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import {
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  Calendar,
  Zap,
} from "lucide-react";

interface SellHoldRecommendationCardProps {
  recommendation: RecommendationResult;
  commodityNameEn: string;
  commodityNameMr: string;
  marketNameEn: string;
  marketNameMr: string;
}

export function SellHoldRecommendationCard({
  recommendation,
  commodityNameEn,
  commodityNameMr,
  marketNameEn,
  marketNameMr,
}: SellHoldRecommendationCardProps) {
  const { language } = useApp();
  const isMr = language === "mr";

  const isHold = recommendation.action === "HOLD";
  const isSell = recommendation.action === "SELL";

  return (
    <div
      className={`rounded-2xl p-6 border transition shadow-sm ${
        isHold
          ? "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/30 border-amber-200"
          : isSell
          ? "bg-gradient-to-br from-emerald-50/90 via-emerald-50/30 to-green-100/30 border-emerald-200"
          : "bg-gradient-to-br from-blue-50/90 via-stone-50/30 to-blue-100/30 border-blue-200"
      }`}
    >
      {/* Top Badge & AI/Heuristic indicator */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
              isHold
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                : isSell
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "bg-blue-600 text-white"
            }`}
          >
            {isHold ? (
              <>
                <Clock className="h-3.5 w-3.5" />
                {isMr ? "थांबून विक्री करा (HOLD)" : "HOLD & WAIT"}
              </>
            ) : isSell ? (
              <>
                <Zap className="h-3.5 w-3.5" />
                {isMr ? "आता विक्री करा (SELL)" : "SELL NOW"}
              </>
            ) : (
              <>
                <Info className="h-3.5 w-3.5" />
                {isMr ? "निरीक्षण करा (WATCH)" : "MONITOR"}
              </>
            )}
          </span>

          <span className="text-[11px] font-semibold text-stone-500 bg-white/80 border border-stone-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-600" />
            {recommendation.confidenceScore}% {isMr ? "विश्वासार्हता" : "Confidence Score"}
          </span>
        </div>

        {recommendation.suggestedDaysWait && isHold && (
          <span className="text-xs font-bold text-amber-900 bg-amber-200/70 border border-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-amber-800" />
            {isMr
              ? `पुढील ${recommendation.suggestedDaysWait} दिवस थांबा`
              : `Wait ~${recommendation.suggestedDaysWait} Days`}
          </span>
        )}
      </div>

      {/* Main Plain-Language Recommendation Header */}
      <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 leading-snug mb-2">
        {isMr ? recommendation.titleMr : recommendation.titleEn}
      </h2>

      {/* Empathetic Plain-Language Explanation */}
      <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-5 font-normal">
        {isMr ? recommendation.explanationMr : recommendation.explanationEn}
      </p>

      {/* Market Momentum Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-stone-200/60 text-xs">
        <div className="bg-white/80 p-2.5 rounded-xl border border-stone-200/70">
          <span className="text-[11px] text-stone-500 block mb-0.5">
            {isMr ? "सध्याचा भाव" : "Current Rate"}
          </span>
          <span className="text-sm font-bold text-stone-900 font-mono">
            {formatINR(recommendation.currentModal)}/qtl
          </span>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-stone-200/70">
          <span className="text-[11px] text-stone-500 block mb-0.5">
            {isMr ? "७-दिवस सरासरी" : "7-Day Moving Avg"}
          </span>
          <span className="text-sm font-bold text-stone-900 font-mono">
            {formatINR(recommendation.sevenDayAvg)}/qtl
          </span>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-stone-200/70">
          <span className="text-[11px] text-stone-500 block mb-0.5">
            {isMr ? "आठवडा बदल" : "7-Day Momentum"}
          </span>
          <span
            className={`text-sm font-bold font-mono flex items-center gap-0.5 ${
              recommendation.trendPercentage >= 0 ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {recommendation.trendPercentage >= 0 ? "+" : ""}
            {recommendation.trendPercentage}%
          </span>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-stone-200/70">
          <span className="text-[11px] text-stone-500 block mb-0.5">
            {isMr ? "बाजार आवक कल" : "Arrivals Volume"}
          </span>
          <span
            className={`text-xs font-bold uppercase ${
              recommendation.volumeTrend === "FALLING"
                ? "text-amber-700"
                : recommendation.volumeTrend === "RISING"
                ? "text-blue-700"
                : "text-stone-700"
            }`}
          >
            {recommendation.volumeTrend === "FALLING"
              ? isMr
                ? "आवक घटतेय"
                : "Tightening"
              : recommendation.volumeTrend === "RISING"
              ? isMr
                ? "आवक वाढतेय"
                : "Surging"
              : isMr
              ? "स्थिर आवक"
              : "Steady"}
          </span>
        </div>
      </div>

      {/* Code Note: Technical Disclaimer on heuristic model */}
      <div className="mt-4 pt-3 border-t border-stone-200/50 flex items-start gap-1.5 text-[11px] text-stone-500">
        <HelpCircle className="h-3.5 w-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Technical Note:</strong> Advisory computed via moving average slope and supply arrival heuristic. Designed as a production stand-in for the upcoming Maharashtra Government ML price forecasting model.
        </span>
      </div>
    </div>
  );
}
