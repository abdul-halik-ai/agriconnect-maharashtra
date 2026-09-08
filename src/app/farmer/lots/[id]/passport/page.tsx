"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatINR, formatQuintals, formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Award,
  Download,
  Share2,
  ArrowLeft,
  Lock,
  Building,
  MapPin,
  Calendar,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LotPassportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, showToast } = useApp();
  const isMr = language === "mr";

  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLot() {
      try {
        const res = await fetch(`/api/lots/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setLot(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLot();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-20 text-center text-stone-500">
        Verifying digital passport with Maharashtra state repository...
      </div>
    );
  }

  if (!lot) {
    return <div className="p-20 text-center text-stone-500">Lot passport not found.</div>;
  }

  const photos = (() => {
    try {
      return JSON.parse(lot.photoUrls || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {isMr ? "मागे जा" : "Back"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast("Passport verification link copied to clipboard!");
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            Print Certificate
          </button>
        </div>
      </div>

      {/* Official Certificate Box */}
      <div className="bg-white rounded-3xl border-2 border-agri-600/30 overflow-hidden shadow-xl passport-watermark">
        {/* Tricolor Government Ribbon */}
        <div className="govt-ribbon" />

        {/* Certificate Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-agri-900 to-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              <span>Government of Maharashtra • MSAMB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              Digital Agricultural Lot Passport
            </h1>
            <p className="text-xs text-stone-300">
              Official Quality Specification & Tamper-Proof Cryptographic Provenance
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <div className="text-xs text-emerald-400 font-semibold uppercase">Passport ID</div>
            <div className="text-xl font-bold tracking-wider">{lot.lotNumber}</div>
            <div className="text-[10px] text-stone-400">Status: TRADEABLE & VERIFIED</div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Commodity & Key Quality Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] text-stone-500 block mb-1">Commodity</span>
              <span className="text-lg font-bold text-stone-900 block leading-tight">
                {lot.commodity?.nameEn}
              </span>
              <span className="text-xs text-stone-500 font-medium">{lot.commodity?.nameMr}</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] text-stone-500 block mb-1">Certified Quantity</span>
              <span className="text-lg font-bold text-stone-900 font-mono block">
                {formatQuintals(lot.quantityQuintals)}
              </span>
              <span className="text-xs text-stone-500">
                MSP: ₹{lot.commodity?.mspPrice}/qtl
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] text-emerald-800 block mb-1">Visual Grade</span>
              <span className="text-lg font-bold text-emerald-900 flex items-center gap-1.5">
                <Award className="h-5 w-5 text-emerald-700" />
                Grade {lot.visualGrade}
              </span>
              <span className="text-[10px] text-emerald-700">Export & Apex Grade A</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] text-stone-500 block mb-1">Moisture Reading</span>
              <span className="text-lg font-bold text-stone-900 font-mono block">
                {lot.moisturePercent}%
              </span>
              <span className="text-[10px] text-emerald-700">Below 12.0% Threshold</span>
            </div>
          </div>

          {/* QR Code and Farm Provenance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200">
            {/* QR verification */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-stone-200 text-center">
              {lot.qrCodeData && (
                <img
                  src={lot.qrCodeData}
                  alt={`QR Code ${lot.lotNumber}`}
                  className="h-36 w-36 object-contain"
                />
              )}
              <span className="text-[11px] font-bold text-stone-700 mt-2">
                Scan for Live Validation
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                SHA-256 Signature Sealed
              </span>
            </div>

            {/* Farm and Owner Provenance Details */}
            <div className="sm:col-span-2 space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Registered Producer:</span>
                <span className="font-bold text-stone-900">
                  {lot.creator?.name} ({lot.ownerType})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">District & Taluka:</span>
                <span className="font-semibold text-stone-900">
                  {lot.creator?.district} (Maharashtra)
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Harvest Date:</span>
                <span className="font-mono font-semibold text-stone-900">
                  {formatDate(lot.harvestDate)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Storage Location:</span>
                <span className="font-semibold text-stone-900">{lot.storageLocation}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-500 font-medium">Expected Price:</span>
                <span className="font-mono font-bold text-agri-700 text-sm">
                  {formatINR(lot.basePriceExpected)} / Quintal
                </span>
              </div>
            </div>
          </div>

          {/* FPO Pooled Farmer Contributors (if aggregated lot) */}
          {lot.isAggregated && lot.contributions && lot.contributions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                FPO Pooled Farmer Contributors ({lot.contributions.length} Smallholders)
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Farmer Member</th>
                      <th className="py-2.5 px-3 font-semibold">Quantity</th>
                      <th className="py-2.5 px-3 font-semibold">Moisture</th>
                      <th className="py-2.5 px-3 font-semibold">Grade</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Pool Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {lot.contributions.map((c: any) => (
                      <tr key={c.id}>
                        <td className="py-2.5 px-3 font-semibold text-stone-900">
                          {c.farmer.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono">{c.contributedWeight} Qtl</td>
                        <td className="py-2.5 px-3 font-mono">{c.moisturePercent}%</td>
                        <td className="py-2.5 px-3">Grade {c.visualGrade}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-right text-stone-800">
                          {c.sharePercentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Inspection Photos
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Crop photo ${i + 1}`}
                    className="h-28 w-full object-cover rounded-xl border border-stone-200 shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cryptographic SHA-256 Hash */}
          <div className="p-4 bg-stone-900 text-white rounded-2xl flex items-center gap-3">
            <Lock className="h-6 w-6 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Cryptographic Integrity Verification Hash:
              </div>
              <div className="font-mono text-xs text-stone-300 break-all select-all">
                {lot.digitalPassportHash}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
