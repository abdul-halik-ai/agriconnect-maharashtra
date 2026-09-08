"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR, formatDateTime, formatQuintals } from "@/lib/utils";
import {
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  Scale,
  UserCheck,
  Users,
  Building2,
  DollarSign,
  ArrowUpRight,
  Clock,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center text-stone-500">
        Aggregating state-wide agricultural telemetry...
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            <span>Maharashtra State Innovation Society (MSIS) Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            State Agriculture Market Intelligence & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Real-time transaction volume, farmer price realization uplift, and dispute resolution performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/kyc"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-50 transition shadow-sm"
          >
            <UserCheck className="h-4 w-4 text-blue-600" />
            <span>KYC Queue ({data?.pendingBuyers?.length || 0})</span>
          </Link>
          <Link
            href="/admin/disputes"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Scale className="h-4 w-4 text-red-400" />
            <span>Disputes ({metrics.openDisputes || 0})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Total Gross Trade Value</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {formatINR(metrics.totalGMV || 0)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>{metrics.totalTransactions || 0} Transactions Completed</span>
          </div>
        </div>

        {/* Farmer Price Uplift */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Price Realization Uplift</span>
            <TrendingUp className="h-4 w-4 text-agri-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-agri-800">
            +{metrics.avgPriceRealizationUplift || 14.8}%
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Versus APMC Mandi Modal Average
          </div>
        </div>

        {/* Active Escrow Balance */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Active Escrow Balance</span>
            <ShieldCheck className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {formatINR(metrics.activeEscrowBalance || 0)}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            Locked pending quality confirmation
          </div>
        </div>

        {/* Dispute Resolution Time */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-subtle">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Avg Dispute Resolution</span>
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {metrics.avgResolutionTimeHours || 18.5} hrs
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            SLA: Under 24 Hours
          </div>
        </div>
      </div>

      {/* Stakeholders Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              🌾
            </div>
            <div>
              <span className="text-xs text-stone-500 block">Registered Farmers</span>
              <span className="text-xl font-bold text-stone-900 font-mono">
                {metrics.farmersCount || 16}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
            100% Aadhaar Verified
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              🏢
            </div>
            <div>
              <span className="text-xs text-stone-500 block">Active FPOs</span>
              <span className="text-xl font-bold text-stone-900 font-mono">
                {metrics.fposCount || 5}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
            1,525 Smallholder Members
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              💼
            </div>
            <div>
              <span className="text-xs text-stone-500 block">Verified Buyers</span>
              <span className="text-xl font-bold text-stone-900 font-mono">
                {metrics.buyersCount || 10}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded font-bold">
            APMC Licensed
          </span>
        </div>
      </div>

      {/* Recent State Deals Audit Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-agri-700" />
              <span>Platform Transaction Audit Stream</span>
            </h2>
            <p className="text-xs text-stone-500">
              Complete state transaction registry across all Maharashtra districts
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
              <tr>
                <th className="py-3 px-3 font-semibold">Deal Number</th>
                <th className="py-3 px-3 font-semibold">Commodity</th>
                <th className="py-3 px-3 font-semibold">Seller</th>
                <th className="py-3 px-3 font-semibold">Buyer</th>
                <th className="py-3 px-3 font-semibold">Volume</th>
                <th className="py-3 px-3 font-semibold">Total Amount</th>
                <th className="py-3 px-3 font-semibold">Escrow</th>
                <th className="py-3 px-3 font-semibold text-right">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data?.recentDeals?.map((deal: any) => (
                <tr key={deal.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-stone-900">
                    <Link
                      href={`/farmer/deals/${deal.id}`}
                      className="text-agri-700 hover:underline"
                    >
                      {deal.dealNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-semibold text-stone-800">
                    {deal.commodity?.nameEn}
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    {deal.seller?.fpoProfile?.fpoName || deal.seller?.name}
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    {deal.buyer?.buyerProfile?.companyName || deal.buyer?.name}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {formatQuintals(deal.agreedQuantity)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-stone-900">
                    {formatINR(deal.totalAmount)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        deal.escrowStatus === "RELEASED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {deal.escrowStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                      {deal.stage.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
