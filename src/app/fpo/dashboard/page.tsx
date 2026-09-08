"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatINR, formatQuintals } from "@/lib/utils";
import {
  Building2,
  Users,
  Layers,
  Handshake,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  TrendingUp,
  PlusCircle,
  Clock,
} from "lucide-react";

export default function FpoDashboardPage() {
  const { user, language } = useApp();
  const isMr = language === "mr";

  const [lots, setLots] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFpoData() {
      try {
        const [lotsRes, dealsRes] = await Promise.all([
          fetch(`/api/lots?creatorId=${user.id}`),
          fetch(`/api/deals?userId=${user.id}&role=FPO`),
        ]);

        if (lotsRes.ok) setLots(await lotsRes.json());
        if (dealsRes.ok) setDeals(await dealsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFpoData();
  }, [user.id]);

  const totalPooledQuintals = lots
    .filter((l) => l.isAggregated)
    .reduce((sum, l) => sum + l.quantityQuintals, 0);

  const activeEscrowAmount = deals
    .filter((d) => d.escrowStatus === "HELD")
    .reduce((sum, d) => sum + d.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
            <Building2 className="h-4 w-4" />
            <span>Farmer Producer Company Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            Sahyadri Farmers Producer Co. Ltd.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Registered FPO: U01403MH2011PTC212345 • 480 Active Member Farmers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/fpo/lots/aggregate"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs sm:text-sm font-bold transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Pool Farmers Produce (संकलन)</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Active Smallholders</span>
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">480</div>
          <span className="text-[11px] text-emerald-700 font-medium">
            16 Talukas across Nashik & Pune
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Pooled Produce Volume</span>
            <Layers className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {totalPooledQuintals.toLocaleString()} Qtl
          </div>
          <span className="text-[11px] text-stone-500">
            {(totalPooledQuintals / 10).toFixed(0)} MT Institutional Grade
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Escrow Funds in Custody</span>
            <ShieldCheck className="h-4 w-4 text-agri-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {formatINR(activeEscrowAmount)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            100% Protected by Apex Pool
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Warehouse Utilization</span>
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">72%</div>
          <span className="text-[11px] text-stone-500">1,080 / 1,500 MT Utilized</span>
        </div>
      </div>

      {/* Aggregated Lots Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-agri-700" />
              <span>Current FPO Aggregated Produce Pools</span>
            </h2>
            <p className="text-xs text-stone-500">
              Bulk lots available for institutional procurement with verified farmer contribution shares
            </p>
          </div>

          <Link
            href="/fpo/payouts"
            className="text-xs font-bold text-agri-700 hover:text-agri-800 flex items-center gap-1"
          >
            <span>View Member Payout Ledger</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots
            .filter((l) => l.isAggregated)
            .map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {lot.lotNumber}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">
                      {lot.commodity?.nameEn}
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Grade {lot.visualGrade}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total Pool Weight</span>
                    <span className="font-bold text-stone-900 font-mono">
                      {formatQuintals(lot.quantityQuintals)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Weighted Moisture</span>
                    <span className="font-bold text-stone-900 font-mono">
                      {lot.moisturePercent}%
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600">
                  <div className="font-semibold mb-1">
                    Smallholders Pooled: {lot.contributions?.length || 4} Farmers
                  </div>
                  <div className="space-y-1">
                    {lot.contributions?.slice(0, 3).map((c: any) => (
                      <div key={c.id} className="flex justify-between text-[11px] text-stone-500">
                        <span>{c.farmer.name}</span>
                        <span className="font-mono font-medium">
                          {c.contributedWeight} Qtl ({c.sharePercentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono font-bold text-agri-700 text-sm">
                    {formatINR(lot.basePriceExpected)}/qtl
                  </span>
                  <Link
                    href={`/farmer/lots/${lot.id}/passport`}
                    className="px-3 py-1.5 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 font-bold text-xs transition"
                  >
                    View Passport & QR
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
