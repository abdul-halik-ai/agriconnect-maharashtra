"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  Handshake,
  Truck,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  Check,
  Scale,
} from "lucide-react";

export default function HomePage() {
  const { language, switchDemoRole } = useApp();
  const isMr = language === "mr";

  const liveTickers = [
    { crop: "Onion (Lasalgaon)", rate: "₹2,620/qtl", change: "+11.8%", up: true },
    { crop: "Soybean (Pune)", rate: "₹5,080/qtl", change: "+2.4%", up: true },
    { crop: "Tomato (Nashik)", rate: "₹1,850/qtl", change: "-4.1%", up: false },
    { crop: "Cotton (Nagpur)", rate: "₹7,450/qtl", change: "+1.9%", up: true },
    { crop: "Tur Dal (Kolhapur)", rate: "₹9,350/qtl", change: "+0.8%", up: true },
    { crop: "Grapes (Nashik)", rate: "₹7,100/qtl", change: "+5.2%", up: true },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Ticker Bar */}
      <div className="bg-stone-900 text-stone-200 py-2.5 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-xs whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Live Mandi Telemetry:
          </div>
          <div className="flex items-center gap-8">
            {liveTickers.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-stone-300 font-medium">{item.crop}:</span>
                <span className="font-bold text-white font-mono">{item.rate}</span>
                <span
                  className={`text-[11px] font-bold ${
                    item.up ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-agri-100 text-agri-900 border border-agri-200 text-xs font-bold">
              <ShieldCheck className="h-4 w-4 text-agri-700" />
              <span>Government of Maharashtra • MSIS Price Discovery Initiative</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-stone-900 tracking-tight leading-[1.1]">
              Fairer crop prices.
              <br />
              <span className="text-agri-700">Verified buyers.</span>
              <br />
              Zero guesswork.
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl font-normal">
              {isMr
                ? "महाराष्ट्र शासनाचा एकात्मिक शेतमाल बाजार जोडणी मंच. थेट एपीएमसी बाजार भाव, थांबून विक्री करण्याचा सल्ला, डिजिटल लॉट पासपोर्ट आणि हमी रक्कम एस्क्रो व्यवहार."
                : "AgriConnect Maharashtra bridges smallholders, FPOs, and institutional buyers with real-time APMC price intelligence, plain-language sell/hold advisory, digital lot passports with QR verification, and end-to-end escrow deal tracking."}
            </p>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200 text-stone-800">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-agri-800">
                  +14.8%
                </div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">
                  Farmer Realization Uplift
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
                  ₹2.4 Cr+
                </div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">
                  Escrow Protected Deals
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
                  6 APMCs
                </div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">
                  Major Maharashtra Hubs
                </div>
              </div>
            </div>
          </div>

          {/* Persona Portal Cards */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Select Your Role to Enter
            </div>

            {/* Farmer Card */}
            <Link
              href="/farmer/prices"
              onClick={() => switchDemoRole("FARMER")}
              className="block p-4 bg-white rounded-2xl border-2 border-agri-200 hover:border-agri-600 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    🌾
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-agri-700 transition">
                      Farmer Experience (शेतकरी)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Prices, Sell/Hold guidance & Lot passports
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400 group-hover:text-agri-700 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* FPO Card */}
            <Link
              href="/fpo/dashboard"
              onClick={() => switchDemoRole("FPO")}
              className="block p-4 bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-600 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-700 transition">
                      FPO Admin (शेतकरी उत्पादक कंपनी)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Pool lots, fair farmer splits & bulk contracts
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Buyer Card */}
            <Link
              href="/buyer/demand"
              onClick={() => switchDemoRole("BUYER")}
              className="block p-4 bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-600 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    💼
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-blue-700 transition">
                      Institutional Buyer (खरेदीदार)
                    </h3>
                    <p className="text-xs text-stone-500">
                      ITC, Reliance, DeHaat — Post demands & source
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Admin Card */}
            <Link
              href="/admin/dashboard"
              onClick={() => switchDemoRole("ADMIN")}
              className="block p-4 bg-stone-900 rounded-2xl border-2 border-stone-800 hover:border-stone-600 text-white shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center font-bold">
                    🏛️
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                      Platform State Admin (MSIS / MSAMB)
                    </h3>
                    <p className="text-xs text-stone-400">
                      Dispute arbitration, buyer KYC & live telemetry
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Pillars of AgriConnect Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-agri-700 mb-2">
            Engineered For Maharashtra&apos;s Agri Context
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
            Solving price discovery and market linkages end-to-end
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Sell / Hold Advisory
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Plain-language recommendations powered by 35-day moving average and arrival trends. Never forces a farmer to decode complex charts alone.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs font-semibold text-agri-700">
              Lasalgaon, Pune, Nashik Mandis →
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                FPO Aggregation & Splits
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Empowers FPO admins to combine 10-50 smallholder lots into institutional-grade bulk lots, tracking each farmer&apos;s exact weight and fair payout.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs font-semibold text-amber-700">
              Transparent Member Ledger →
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Digital Lot Passport
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tamper-proof SHA-256 integrity hash and verifiable QR code certificate with moisture %, visual grade, and photo provenance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs font-semibold text-blue-700">
              Instant QR Verification →
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <Handshake className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                7-Step Escrow Pipeline
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Complete order tracking from offer accepted, transit, delivery, and quality check to escrow payment release. Plus state dispute arbitration.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs font-semibold text-purple-700">
              100% Guaranteed Escrow →
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
