"use client";

import React from "react";
import { formatINR, formatDateTime } from "@/lib/utils";
import { ShieldCheck, Lock, CheckCircle2, ArrowDownRight, Building2, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface EscrowPaymentTrackerProps {
  deal: {
    id: string;
    dealNumber: string;
    totalAmount: number;
    escrowStatus: string;
    stage: string;
    agreedPrice: number;
    agreedQuantity: number;
    buyer: { name: string; buyerProfile?: { companyName: string } };
    seller: { name: string; role: string; fpoProfile?: { fpoName: string } };
    lot?: {
      isAggregated: boolean;
      contributions?: Array<{
        id: string;
        farmer: { name: string; phone: string };
        contributedWeight: number;
        sharePercentage: number;
        payoutAmount?: number | null;
        payoutStatus: string;
      }>;
    };
    updatedAt: string | Date;
  };
}

export function EscrowPaymentTracker({ deal }: EscrowPaymentTrackerProps) {
  const { language } = useApp();
  const isMr = language === "mr";

  const isHeld = deal.escrowStatus === "HELD";
  const isReleased = deal.escrowStatus === "RELEASED";

  // For FPO lots, compute commission & payout pool
  const fpoCommission = deal.lot?.isAggregated ? deal.totalAmount * 0.015 : 0;
  const netFarmerPool = deal.totalAmount - fpoCommission;

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
      {/* Top Escrow Security Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-stone-50 border border-emerald-200/80">
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
              isReleased
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-amber-600 text-white shadow-md shadow-amber-600/20"
            }`}
          >
            {isReleased ? <CheckCircle2 className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
              State Escrow Vault Status
            </div>
            <div className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>{isReleased ? "Escrow Payout Disbursed" : "Funds Held Secure in Escrow"}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                  isReleased
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {deal.escrowStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-stone-500 block">Total Deal Escrow Amount</span>
          <span className="text-2xl font-bold font-mono text-stone-900">
            {formatINR(deal.totalAmount)}
          </span>
        </div>
      </div>

      {/* Escrow Terms & Transaction Audit Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
          <span className="text-stone-500 block mb-1">Fund Depositor (Buyer)</span>
          <span className="font-bold text-stone-900 text-sm">
            {deal.buyer.buyerProfile?.companyName || deal.buyer.name}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-0.5">
            ✓ 100% Escrow Collateral Verified
          </span>
        </div>

        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
          <span className="text-stone-500 block mb-1">Beneficiary (Seller)</span>
          <span className="font-bold text-stone-900 text-sm">
            {deal.seller.fpoProfile?.fpoName || deal.seller.name}
          </span>
          <span className="text-[11px] text-stone-500 block mt-0.5">
            Direct RTGS / Aadhaar-linked Bank A/C
          </span>
        </div>

        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
          <span className="text-stone-500 block mb-1">Release Condition</span>
          <span className="font-bold text-stone-900 text-sm">
            Digital Quality Sign-Off
          </span>
          <span className="text-[11px] text-stone-500 block mt-0.5">
            Stage 05 Quality Match Mandatory
          </span>
        </div>
      </div>

      {/* FPO Payout Split Table (if aggregated lot) */}
      {deal.lot?.isAggregated && deal.lot.contributions && deal.lot.contributions.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-agri-700" />
                <span>
                  {isMr
                    ? "एफपीओ शेतकरी हिस्सा वाटप तपशील (पारदर्शक हिशोब)"
                    : "FPO Member Transparent Payout Split Ledger"}
                </span>
              </h4>
              <p className="text-xs text-stone-500">
                Automatic proportional disbursement based on weighed harvest contributions
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-stone-500">FPO Ops Fee (1.5%): </span>
              <span className="font-bold font-mono text-stone-700">
                {formatINR(fpoCommission)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Farmer Member</th>
                  <th className="py-2.5 px-3 font-semibold">Contributed Weight</th>
                  <th className="py-2.5 px-3 font-semibold">Pool Share</th>
                  <th className="py-2.5 px-3 font-semibold">Net Payout (₹)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {deal.lot.contributions.map((c) => {
                  const calculatedShare =
                    c.payoutAmount || Math.round((c.sharePercentage / 100) * netFarmerPool);

                  return (
                    <tr key={c.id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-stone-900">{c.farmer.name}</div>
                        <div className="text-[10px] text-stone-500">{c.farmer.phone}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-stone-800">
                        {c.contributedWeight} Qtl
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-stone-800">
                        {c.sharePercentage}%
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800 text-sm">
                        {formatINR(calculatedShare)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.payoutStatus === "RELEASED" || isReleased
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {c.payoutStatus === "RELEASED" || isReleased ? "Disbursed" : "In Escrow"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Escrow Guarantee Footer */}
      <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between text-[11px] text-stone-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Regulated under Maharashtra State Agriculture Marketing Board (MSAMB) Escrow Rules
        </span>
        <span className="font-mono">Audit ID: ESC-{deal.id.slice(-8).toUpperCase()}</span>
      </div>
    </div>
  );
}
