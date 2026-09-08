"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { TransportBookingCard } from "@/components/logistics/TransportBookingCard";
import { StorageBookingCard } from "@/components/logistics/StorageBookingCard";
import { Truck, Building, RefreshCw, MapPin } from "lucide-react";

export default function LogisticsPage() {
  const { language } = useApp();
  const isMr = language === "mr";

  const [logistics, setLogistics] = useState<any>({ transporters: [], storages: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "TRANSPORT" | "STORAGE">("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logistics");
      if (res.ok) {
        const data = await res.json();
        setLogistics(data);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri-700">
            <Truck className="h-4 w-4" />
            <span>{isMr ? "वाहतूकदार व शीतगृह जोडणी" : "Freight Transport & Storage Matching"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            {isMr ? "वाहतूक व शासकीय वखार सेवा" : "Logistics & Storage Directory"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {isMr
              ? "नोंदणीकृत कृषी मालवाहू वाहने आणि महाराष्ट्र राज्य वखार महामंडळ (MSWC) शीतगृहे"
              : "Pre-verified agri-freight carriers and MSWC warehousing complexes with transparent tariffs"}
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "ALL" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setActiveTab("TRANSPORT")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "TRANSPORT" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
            }`}
          >
            Transport ({logistics.transporters?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("STORAGE")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "STORAGE" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
            }`}
          >
            Storage ({logistics.storages?.length || 0})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200 text-stone-500">
          <RefreshCw className="h-8 w-8 text-agri-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-700">Loading logistics providers...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(activeTab === "ALL" || activeTab === "TRANSPORT") && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Truck className="h-5 w-5 text-agri-700" />
                <span>Verified Agricultural Transport Carriers ({logistics.transporters?.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {logistics.transporters?.map((tp: any) => (
                  <TransportBookingCard key={tp.id} transporter={tp} onBookSuccess={loadData} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === "ALL" || activeTab === "STORAGE") && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-emerald-700" />
                <span>Warehouses & Cold Storages ({logistics.storages?.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {logistics.storages?.map((sf: any) => (
                  <StorageBookingCard key={sf.id} storage={sf} onBookSuccess={loadData} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
