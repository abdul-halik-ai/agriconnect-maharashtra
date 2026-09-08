"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { formatINR, formatQuintals, formatDate } from "@/lib/utils";
import {
  Wallet,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function FpoPayoutsPage() {
  const { user, language } = useApp();
  const isMr = language === "mr";

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals?userId=${user.id}&role=FPO`);
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const fpoDeals = deals.filter((d) => d.lot?.isAggregated);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
            <Wallet className="h-4 w-4" />
            <span>FPO Transparency & Settlement Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            {isMr ? "शेतकरी हिस्सा वाटप व बँक जमा हिशोब" : "Farmer Member Payout Split Ledger"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {isMr
              ? "प्रत्येक सौद्यानंतर शेतकऱ्यांच्या खात्यात जमा झालेली किंवा एस्क्रोमध्ये राखीव असलेली रक्कम"
              : "Transparent accounting of gross escrow amounts, 1.5% FPO fee deduction, and net disbursements to individual farmers"}
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200 text-stone-500">
          <RefreshCw className="h-8 w-8 text-agri-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-700">Loading payout splits...</p>
        </div>
      ) : fpoDeals.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-stone-500">
          <Wallet className="h-10 w-10 text-stone-300 mx-auto mb-2" />
          <h3 className="font-bold text-stone-800">No active aggregated lot deals</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Pool produce from smallholders and accept buyer offers to see automated payout splits.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {fpoDeals.map((deal) => {
            const fpoFee = deal.totalAmount * 0.015;
            const netDisbursable = deal.totalAmount - fpoFee;

            return (
              <div
                key={deal.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                        {deal.dealNumber}
                      </span>
                      <span className="text-xs font-semibold text-stone-600">
                        Lot: {deal.lot?.lotNumber}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          deal.escrowStatus === "RELEASED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Escrow: {deal.escrowStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 mt-1">
                      {deal.commodity?.nameEn} — {formatQuintals(deal.agreedQuantity)} @ {formatINR(deal.agreedPrice)}/qtl
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-stone-500 block">Total Deal Escrow</span>
                    <span className="text-xl font-bold font-mono text-stone-900">
                      {formatINR(deal.totalAmount)}
                    </span>
                    <span className="text-[11px] text-stone-400 block">
                      FPO Ops Fee (1.5%): {formatINR(fpoFee)}
                    </span>
                  </div>
                </div>

                {/* Member farmers breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-emerald-700" />
                    <span>Member Payout Split Distribution</span>
                  </h4>

                  <div className="overflow-x-auto rounded-2xl border border-stone-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Farmer Member</th>
                          <th className="py-2.5 px-3 font-semibold">Weight</th>
                          <th className="py-2.5 px-3 font-semibold">Pool Share</th>
                          <th className="py-2.5 px-3 font-semibold">Gross Share</th>
                          <th className="py-2.5 px-3 font-semibold">Net Payout (to A/C)</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Disbursement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {deal.lot?.contributions?.map((c: any) => {
                          const netPayout =
                            c.payoutAmount || Math.round((c.sharePercentage / 100) * netDisbursable);
                          const grossShare = (c.sharePercentage / 100) * deal.totalAmount;

                          return (
                            <tr key={c.id} className="hover:bg-stone-50/50">
                              <td className="py-2.5 px-3 font-semibold text-stone-900">
                                {c.farmer.name}
                              </td>
                              <td className="py-2.5 px-3 font-mono">{c.contributedWeight} Qtl</td>
                              <td className="py-2.5 px-3 font-mono">{c.sharePercentage}%</td>
                              <td className="py-2.5 px-3 font-mono text-stone-600">
                                {formatINR(grossShare)}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-800 text-sm">
                                {formatINR(netPayout)}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    c.payoutStatus === "RELEASED" || deal.escrowStatus === "RELEASED"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {c.payoutStatus === "RELEASED" || deal.escrowStatus === "RELEASED"
                                    ? "Disbursed"
                                    : "Held in Escrow"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
