"use client";

import React, { useState } from "react";
import { formatINR, formatQuintals, formatDate } from "@/lib/utils";
import { LotPassportModal } from "./LotPassportModal";
import {
  ShieldCheck,
  QrCode,
  Award,
  Layers,
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface LotCardProps {
  lot: any;
  onSelect?: (lot: any) => void;
  showMakeOffer?: boolean;
  onMakeOffer?: (lot: any) => void;
}

export function LotCard({ lot, onSelect, showMakeOffer, onMakeOffer }: LotCardProps) {
  const [passportOpen, setPassportOpen] = useState(false);
  const { language } = useApp();
  const isMr = language === "mr";

  const photos = (() => {
    try {
      return JSON.parse(lot.photoUrls || "[]");
    } catch {
      return [];
    }
  })();

  const thumbUrl =
    photos[0] ||
    lot.commodity?.imageUrl ||
    "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80";

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-subtle hover:shadow-card transition flex flex-col overflow-hidden group">
        {/* Card Image Header */}
        <div className="relative h-40 w-full overflow-hidden bg-stone-100">
          <img
            src={thumbUrl}
            alt={lot.commodity?.nameEn}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />

          {/* Status & Grade Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
              <Award className="h-3 w-3" />
              Grade {lot.visualGrade}
            </span>

            {lot.isAggregated && (
              <span className="bg-amber-600/95 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                <Layers className="h-3 w-3" />
                FPO Pooled
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5">
            <button
              onClick={() => setPassportOpen(true)}
              className="bg-white/95 backdrop-blur-sm hover:bg-white text-agri-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-agri-200 flex items-center gap-1 shadow-sm transition"
              title="View Digital Passport"
            >
              <QrCode className="h-3.5 w-3.5" />
              Passport
            </button>
          </div>

          {/* Lot ID banner */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white bg-stone-900/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <span className="font-mono font-semibold">{lot.lotNumber}</span>
            <span className="text-stone-300">
              Moisture: {lot.moisturePercent}%
            </span>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <h4 className="text-base font-bold text-stone-900">
                  {lot.commodity?.nameEn}
                </h4>
                <p className="text-xs text-stone-500 font-medium">
                  {lot.commodity?.nameMr}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-stone-500 font-medium">Base Price</div>
                <div className="text-base font-bold text-agri-700 font-mono">
                  {formatINR(lot.basePriceExpected)}/qtl
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <div>
                <span className="text-[11px] text-stone-500 block">Available Quantity</span>
                <span className="font-bold text-stone-900 font-mono">
                  {formatQuintals(lot.quantityQuintals)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Location</span>
                <span className="font-medium text-stone-800 truncate block">
                  {lot.creator?.district || "Nashik"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-stone-400" />
                Harvest: {formatDate(lot.harvestDate)}
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="h-3 w-3" />
                {lot.ownerType} Verified
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-stone-100 mt-2">
            <button
              onClick={() => setPassportOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition"
            >
              <Eye className="h-3.5 w-3.5" />
              {isMr ? "पासपोर्ट पहा" : "View Passport"}
            </button>

            {showMakeOffer && (
              <button
                onClick={() => onMakeOffer && onMakeOffer(lot)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold transition shadow-sm"
              >
                {isMr ? "ऑफर पाठवा" : "Send Offer"}
              </button>
            )}
          </div>
        </div>
      </div>

      <LotPassportModal
        isOpen={passportOpen}
        onClose={() => setPassportOpen(false)}
        lot={lot}
      />
    </>
  );
}
