"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatINR, formatQuintals, formatDate } from "@/lib/utils";
import {
  ClipboardList,
  PlusCircle,
  Building2,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
} from "lucide-react";

export default function BuyerDemandPage() {
  const { user, language, showToast } = useApp();
  const isMr = language === "mr";

  const [demandData, setDemandData] = useState<{ listings: any[]; buyers: any[] }>({
    listings: [],
    buyers: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"DEMANDS" | "BUYERS">("DEMANDS");

  const loadDemand = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/demand");
      if (res.ok) {
        const data = await res.json();
        setDemandData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemand();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <ClipboardList className="h-4 w-4" />
            <span>APMC Sourcing Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            Buyer Demand Board & Directory
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Verified institutional buyers, open procurement tenders, and direct farm gate quotes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/buyer/demand/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold shadow-sm transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post Open Demand</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("DEMANDS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "DEMANDS"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            Open Demands ({demandData.listings.length})
          </button>
          <button
            onClick={() => setActiveTab("BUYERS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "BUYERS"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            Verified Buyer Directory ({demandData.buyers.length})
          </button>
        </div>

        <span className="text-xs text-stone-500">
          Showing verified APMC licensed traders
        </span>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 text-center text-stone-500">
          Loading procurement demand board...
        </div>
      ) : activeTab === "DEMANDS" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demandData.listings.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-subtle hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                      {d.commodity?.category}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">
                      {d.commodity?.nameEn}
                    </h3>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[11px] text-stone-400 block">Target Budget</span>
                    <span className="font-bold text-stone-900 text-sm">
                      {formatINR(d.minPrice)} - {formatINR(d.maxPrice)}/qtl
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-2xl bg-stone-50 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Required Volume</span>
                    <span className="font-bold text-stone-800 font-mono">
                      {formatQuintals(d.requiredQuantity)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Quality Spec</span>
                    <span className="font-semibold text-stone-800">
                      Grade {d.targetGrade} • Moisture {d.minMoisture}-{d.maxMoisture}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-stone-400" />
                    <span>
                      Buyer:{" "}
                      <strong className="text-stone-900">
                        {d.buyer?.buyerProfile?.companyName || d.buyer?.name}
                      </strong>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold ml-1">
                      ✓ APMC Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-stone-400" />
                    <span>Delivery Depot: {d.deliveryLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-stone-400" />
                    <span>Valid until: {formatDate(d.expiryDate)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  {d.deliveryTerms}
                </span>

                <button
                  onClick={() => {
                    showToast(`Offer quote draft created for ${d.buyer?.buyerProfile?.companyName}!`);
                  }}
                  className="px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs transition shadow-sm"
                >
                  Quote / Respond
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Buyer Directory */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demandData.buyers.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-subtle hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      {b.buyerProfile?.companyName || b.name}
                    </h3>
                    <p className="text-xs text-stone-500">{b.buyerProfile?.businessType}</p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-200">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{b.buyerProfile?.reliabilityScore || 4.8}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100 mb-3">
                  <div className="flex justify-between">
                    <span className="text-stone-500">APMC License:</span>
                    <span className="font-mono font-semibold text-stone-800">
                      {b.buyerProfile?.apmcLicenseNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">GSTIN:</span>
                    <span className="font-mono text-stone-800">{b.buyerProfile?.gstin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Typical Annual Volume:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {b.buyerProfile?.tradeVolumeMT} MT
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 mb-2">
                  <span className="font-semibold block mb-0.5">Payment Terms:</span>
                  <span className="text-[11px] text-stone-500">
                    {b.buyerProfile?.paymentTerms}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  KYC Verified
                </span>
                <span className="text-stone-500">Phone: {b.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
