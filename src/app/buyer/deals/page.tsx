"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatINR, formatQuintals, formatDate } from "@/lib/utils";
import { PIPELINE_STAGES } from "@/components/deals/DealPipelineStepper";
import {
  Handshake,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Package,
} from "lucide-react";

export default function BuyerDealsPage() {
  const { user, showToast } = useApp();

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals?userId=${user.id}&role=BUYER`);
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
    loadDeals();
  }, [user.id]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Handshake className="h-4 w-4" />
            <span>Buyer Procurement Contracts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            Active Deals & Quality Inspection Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Monitor dispatches, sign-off on depot arrivals, inspect moisture parameters, and authorize escrow releases
          </p>
        </div>

        <button
          onClick={loadDeals}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-stone-500">Loading procurement deals...</div>
      ) : deals.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-stone-500">
          <Handshake className="h-10 w-10 text-stone-300 mx-auto mb-2" />
          <p className="font-semibold">No active deals found for your account.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => {
            const stageMeta =
              PIPELINE_STAGES.find((s) => s.key === deal.stage) || PIPELINE_STAGES[0];

            return (
              <div
                key={deal.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-subtle hover:shadow-card transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                      {deal.dealNumber}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">
                      Step {stageMeta.step}/7: {stageMeta.titleEn}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        deal.escrowStatus === "RELEASED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      Escrow: {deal.escrowStatus}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900">
                    {deal.commodity?.nameEn} — {formatQuintals(deal.agreedQuantity)} @ {formatINR(deal.agreedPrice)}/qtl
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                    <span>
                      Seller: <strong>{deal.seller?.fpoProfile?.fpoName || deal.seller?.name}</strong>
                    </span>
                    <span>Depot: {deal.deliveryLocation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">Total Deal Escrow</span>
                    <span className="text-xl font-bold font-mono text-stone-900">
                      {formatINR(deal.totalAmount)}
                    </span>
                  </div>

                  <Link
                    href={`/farmer/deals/${deal.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>Inspect & Settle Deal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
