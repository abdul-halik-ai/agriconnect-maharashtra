"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { LotCard } from "@/components/lots/LotCard";
import {
  PackageCheck,
  PlusCircle,
  QrCode,
  ShieldCheck,
  Filter,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

export default function FarmerLotsPage() {
  const { user, language } = useApp();
  const isMr = language === "mr";

  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchLots = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lots?creatorId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setLots(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, [user.id]);

  const filteredLots =
    filterStatus === "ALL"
      ? lots
      : lots.filter((l) => l.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri-700">
            <PackageCheck className="h-4 w-4" />
            <span>{isMr ? "माझा शेतीमाल व डिजिटल पासपोर्ट" : "Registered Produce & Lot Passports"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            {isMr ? "माझा शेतीमाल (लॉट व्यवस्थापन)" : "My Harvest Lots & Passports"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {isMr
              ? "क्यूआर कोड प्रमाणित शेतमाल लॉट्स, गुणवत्ता तपशील आणि थेट खरेदीदार जोडणी"
              : "State-verified tradeable lots with SHA-256 cryptographic passports and QR verification"}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/farmer/lots/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs sm:text-sm font-bold shadow-sm transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{isMr ? "नवीन लॉट नोंदणी करा" : "Create New Lot Passport"}</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-1">
          {["ALL", "AVAILABLE", "UNDER_OFFER", "SOLD"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === st
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              {st === "ALL"
                ? isMr
                  ? "सर्व लॉट्स"
                  : "All Lots"
                : st === "AVAILABLE"
                ? isMr
                  ? "विक्रीस उपलब्ध"
                  : "Available"
                : st === "UNDER_OFFER"
                ? isMr
                  ? "ऑफर सुरू"
                  : "Under Offer"
                : isMr
                ? "विक्री पूर्ण"
                : "Sold"}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-medium">
          {filteredLots.length} {isMr ? "लॉट्स सापडले" : "Lots Registered"}
        </span>
      </div>

      {/* Lots Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200 text-stone-500">
          <RefreshCw className="h-8 w-8 text-agri-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-700">Loading your lots...</p>
        </div>
      ) : filteredLots.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-stone-300 text-center space-y-4">
          <div className="h-16 w-16 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {isMr ? "कोणताही लॉट नोंदवलेला नाही" : "No Lots in this category"}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              {isMr
                ? "तुमच्या शेतीमालाचा फोटो व ओलावा टक्केवारी भरून अधिकृत डिजिटल पासपोर्ट तयार करा."
                : "Register your harvest lot, upload photos, and generate an official QR passport to receive buyer offers."}
            </p>
          </div>
          <Link
            href="/farmer/lots/new"
            className="px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold transition shadow-sm"
          >
            {isMr ? "+ नवीन लॉट तयार करा" : "+ Generate Lot Passport"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      )}
    </div>
  );
}
