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
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Package,
} from "lucide-react";

export default function FarmerDealsPage() {
  const { user, language } = useApp();
  const isMr = language === "mr";

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState("ALL");

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals?userId=${user.id}&role=${user.role}`);
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
    fetchDeals();
  }, [user.id, user.role]);

  const filteredDeals =
    filterStage === "ALL"
      ? deals
      : deals.filter((d) => d.stage === filterStage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri-700">
            <Handshake className="h-4 w-4" />
            <span>{isMr ? "थेट व्यवहार व हमी रक्कम ट्रॅकिंग" : "Guaranteed Transactions & Escrow Pipeline"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            {isMr ? "माझे सौदे व व्यवहार ट्रॅकर" : "Deals & Transaction Pipeline"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {isMr
              ? "सौदा निश्चित झाल्यापासून ते बँक खात्यात पैसे जमा होईपर्यंत प्रत्येक टप्प्याची थेट माहिती"
              : "End-to-end visibility from offer acceptance to bank payout. Zero uncertainty."}
          </p>
        </div>

        <button
          onClick={fetchDeals}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200">
        {["ALL", "OFFER_ACCEPTED", "IN_TRANSIT", "DELIVERED", "QUALITY_CONFIRMED", "PAYMENT_RELEASED", "COMPLETED"].map(
          (st) => {
            const isSelected = filterStage === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStage(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? "bg-agri-700 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            );
          }
        )}
      </div>

      {/* Deals List */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200 text-stone-500">
          <RefreshCw className="h-8 w-8 text-agri-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-700">Loading your transactions...</p>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-stone-300 text-center space-y-3">
          <Handshake className="h-12 w-12 text-stone-300" />
          <h3 className="text-base font-bold text-stone-800">
            {isMr ? "या वर्गात कोणतेही सौदे नाहीत" : "No deals found in this stage"}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm">
            {isMr
              ? "खरेदीदारांची मागणी तपासा किंवा तुमच्या लॉटवर आलेल्या ऑफर्स स्वीकारा."
              : "Browse buyer demands or check your incoming offers to initiate guaranteed escrow deals."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeals.map((deal) => {
            const stageMeta =
              PIPELINE_STAGES.find((s) => s.key === deal.stage) || PIPELINE_STAGES[0];

            return (
              <div
                key={deal.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-subtle hover:shadow-card transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                      {deal.dealNumber}
                    </span>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      Step {stageMeta.step}/7: {isMr ? stageMeta.titleMr : stageMeta.titleEn}
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

                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-stone-900">
                      {deal.commodity?.nameEn}
                    </h3>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono font-bold text-stone-800 text-sm">
                      {formatQuintals(deal.agreedQuantity)}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono font-bold text-agri-700 text-sm">
                      {formatINR(deal.agreedPrice)}/qtl
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-stone-400" />
                      Buyer: <strong className="text-stone-700">{deal.buyer?.name}</strong>
                    </span>
                    <span>Dest: {deal.deliveryLocation}</span>
                  </div>
                </div>

                {/* Right Value & CTA */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                  <div>
                    <span className="text-[11px] text-stone-400 block md:text-right">
                      Total Guaranteed Amount
                    </span>
                    <span className="text-xl font-bold font-mono text-stone-900">
                      {formatINR(deal.totalAmount)}
                    </span>
                  </div>

                  <Link
                    href={`/farmer/deals/${deal.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>{isMr ? "थेट ट्रॅक करा" : "Track Deal Room"}</span>
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
