"use client";

import React from "react";
import Image from "next/image";
import { formatINR, formatQuintals, formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  X,
  Download,
  Share2,
  Lock,
  Building,
  Award,
  Hash,
} from "lucide-react";

interface LotPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: {
    id: string;
    lotNumber: string;
    ownerType: string;
    creator?: { name: string; phone: string; district: string };
    commodity: { nameEn: string; nameMr: string; mspPrice: number; category: string };
    market?: { nameEn: string; nameMr: string };
    quantityQuintals: number;
    basePriceExpected: number;
    moisturePercent: number;
    visualGrade: string;
    harvestDate: string | Date;
    digitalPassportHash: string;
    qrCodeData?: string | null;
    photoUrls: string;
    storageLocation: string;
    isAggregated: boolean;
    contributions?: Array<{
      farmer: { name: string };
      contributedWeight: number;
      sharePercentage: number;
    }>;
  };
}

export function LotPassportModal({ isOpen, onClose, lot }: LotPassportModalProps) {
  if (!isOpen) return null;

  const photos = (() => {
    try {
      return JSON.parse(lot.photoUrls || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Tricolor Ribbon Top */}
        <div className="govt-ribbon" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-agri-700 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-agri-800 flex items-center gap-1.5">
                <span>Government of Maharashtra</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Verified Agri Passport</span>
              </div>
              <h2 className="text-sm font-semibold text-stone-900 font-mono">
                {lot.lotNumber}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Certificate Container with official watermarked border */}
          <div className="p-6 rounded-2xl border-2 border-agri-600/30 bg-gradient-to-b from-stone-50/80 to-white relative passport-watermark shadow-sm">
            {/* Stamp Treatment */}
            <div className="absolute top-4 right-4 rotate-[-8deg] pointer-events-none">
              <div className="border-2 border-dashed border-emerald-600 text-emerald-800 text-[11px] font-extrabold uppercase px-3 py-1 rounded-lg bg-emerald-50/90 shadow-sm flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                VERIFIED LOT PASSPORT
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                  Crop & Commodity
                </div>
                <h3 className="text-2xl font-display font-bold text-stone-900">
                  {lot.commodity.nameEn}
                </h3>
                <p className="text-sm text-stone-600 font-medium">{lot.commodity.nameMr}</p>
              </div>
            </div>

            {/* Main Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-subtle">
                <span className="text-[11px] text-stone-500 block">Total Quantity</span>
                <span className="text-base font-bold text-stone-900 font-mono">
                  {formatQuintals(lot.quantityQuintals)}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-subtle">
                <span className="text-[11px] text-stone-500 block">Visual Grade</span>
                <span className="text-base font-bold text-emerald-700 flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Grade {lot.visualGrade}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-subtle">
                <span className="text-[11px] text-stone-500 block">Moisture Content</span>
                <span className="text-base font-bold text-stone-900 font-mono">
                  {lot.moisturePercent}%
                </span>
                <span className="text-[10px] text-emerald-600">Standard Spec Met</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-subtle">
                <span className="text-[11px] text-stone-500 block">Expected Base Rate</span>
                <span className="text-base font-bold text-stone-900 font-mono">
                  {formatINR(lot.basePriceExpected)}/qtl
                </span>
              </div>
            </div>

            {/* QR Code & Provenance Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-stone-200 text-center">
                {lot.qrCodeData ? (
                  <img
                    src={lot.qrCodeData}
                    alt={`QR Code for ${lot.lotNumber}`}
                    className="h-32 w-32 object-contain"
                  />
                ) : (
                  <div className="h-32 w-32 bg-stone-100 flex items-center justify-center rounded-lg text-stone-400">
                    <QrCode className="h-10 w-10" />
                  </div>
                )}
                <span className="text-[10px] text-stone-500 mt-1 font-mono">
                  Scan for Real-Time Validation
                </span>
              </div>

              {/* Provenance Details */}
              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Registered Owner:</span>
                  <span className="font-semibold text-stone-900">
                    {lot.creator?.name || "Verified Member"} ({lot.ownerType})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">District & Hub:</span>
                  <span className="font-semibold text-stone-900">
                    {lot.creator?.district || "Nashik"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Storage Location:</span>
                  <span className="font-semibold text-stone-900">{lot.storageLocation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Harvest Date:</span>
                  <span className="font-semibold text-stone-900 font-mono">
                    {formatDate(lot.harvestDate)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Status:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    TRADEABLE • PASSPORT ISSUED
                  </span>
                </div>
              </div>
            </div>

            {/* FPO Pooled Breakdown if aggregated */}
            {lot.isAggregated && lot.contributions && lot.contributions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-200">
                <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  FPO Pooled Farmer Contributors ({lot.contributions.length} Smallholders)
                </div>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {lot.contributions.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-lg border border-stone-100"
                    >
                      <span className="font-medium text-stone-800">{c.farmer.name}</span>
                      <span className="font-mono text-stone-600">
                        {c.contributedWeight} Qtl ({c.sharePercentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Preview */}
            {photos.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-200">
                <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Verified Inspection Photos
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {photos.map((url: string, idx: number) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Lot photo ${idx + 1}`}
                      className="h-16 w-20 object-cover rounded-lg border border-stone-200 shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cryptographic SHA-256 Hash Seal */}
            <div className="mt-4 pt-3 border-t border-stone-200 bg-stone-100/70 p-2.5 rounded-xl flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-700 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-stone-600 uppercase">
                  SHA-256 Digital Tamper-Proof Hash:
                </div>
                <div className="font-mono text-[10px] text-stone-500 truncate">
                  {lot.digitalPassportHash}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            Print / Save Certificate
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-agri-700 hover:bg-agri-800 text-white transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
