"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  User,
  ShieldCheck,
  CreditCard,
  Building,
  Phone,
  MapPin,
  CheckCircle2,
  Sprout,
  LandPlot,
} from "lucide-react";

export default function FarmerProfilePage() {
  const { user, language } = useApp();
  const isMr = language === "mr";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri-700">
          <User className="h-4 w-4" />
          <span>{isMr ? "शेतकरी अधिकृत नोंदणी" : "Official Farmer Credential Profile"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
          {isMr ? "माझे खाते व किसान ओळख" : "My Kisan Account & Credentials"}
        </h1>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold font-display">
              {user.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>{user.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Aadhaar Verified
                </span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {user.titleBadge} • District: {user.district}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-400 block font-medium">Kisan ID</span>
            <span className="font-mono font-bold text-stone-800 text-sm">
              MH-KISAN-982201
            </span>
          </div>
        </div>

        {/* Verification Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>7/12 Land Record Verified</span>
            </div>
            <p className="text-[11px] text-emerald-900/80">
              Land ownership verified with Mahabhulekh state land records.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Kisan Credit Card (KCC)</span>
            </div>
            <p className="text-[11px] text-emerald-900/80">
              Direct digital escrow linkage active with Bank of Maharashtra.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>FPO Member Certified</span>
            </div>
            <p className="text-[11px] text-emerald-900/80">
              Registered shareholder in Sahyadri Farmers Producer Co.
            </p>
          </div>
        </div>

        {/* Profile Details Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-200 text-xs">
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <LandPlot className="h-4 w-4 text-agri-700" />
              <span>Agricultural Holding</span>
            </h3>
            <div className="p-4 bg-stone-50 rounded-2xl space-y-2 text-stone-600">
              <div className="flex justify-between">
                <span>Total Operational Land:</span>
                <strong className="text-stone-900">4.5 Acres (Niphad, Nashik)</strong>
              </div>
              <div className="flex justify-between">
                <span>Soil & Irrigation:</span>
                <strong className="text-stone-900">Black Cotton Soil • Drip Irrigated</strong>
              </div>
              <div className="flex justify-between">
                <span>Primary Harvest Crops:</span>
                <strong className="text-stone-900">Onion (Garva), Grapes (Thompson)</strong>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-emerald-700" />
              <span>Direct Bank Escrow Payout Account</span>
            </h3>
            <div className="p-4 bg-stone-50 rounded-2xl space-y-2 text-stone-600">
              <div className="flex justify-between">
                <span>Bank Name:</span>
                <strong className="text-stone-900">Bank of Maharashtra</strong>
              </div>
              <div className="flex justify-between">
                <span>Account Number:</span>
                <strong className="text-stone-900 font-mono">XXXX-XXXX-41908</strong>
              </div>
              <div className="flex justify-between">
                <span>IFSC Code:</span>
                <strong className="text-stone-900 font-mono">MAHB0000312</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
