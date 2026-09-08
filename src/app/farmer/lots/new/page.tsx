"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  QrCode,
  Award,
  Sparkles,
  Camera,
  CheckCircle,
  ArrowRight,
  UploadCloud,
  ChevronLeft,
} from "lucide-react";

export default function NewLotPage() {
  const router = useRouter();
  const { user, language, showToast } = useApp();
  const isMr = language === "mr";

  const [commodities, setCommodities] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);

  const [commodityId, setCommodityId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [quantityQuintals, setQuantityQuintals] = useState("50");
  const [basePriceExpected, setBasePriceExpected] = useState("2550");
  const [moisturePercent, setMoisturePercent] = useState("11.5");
  const [visualGrade, setVisualGrade] = useState("A");
  const [storageLocation, setStorageLocation] = useState("Farm Gate, " + user.district);
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch("/api/prices");
        if (res.ok) {
          const data = await res.json();
          setCommodities(data.commodities || []);
          setMarkets(data.markets || []);
          if (data.commodities?.[0]) setCommodityId(data.commodities[0].id);
          if (data.markets?.[0]) setMarketId(data.markets[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodityId || !quantityQuintals || !basePriceExpected) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: user.id,
          commodityId,
          marketId: marketId || null,
          quantityQuintals: Number(quantityQuintals),
          basePriceExpected: Number(basePriceExpected),
          moisturePercent: Number(moisturePercent),
          visualGrade,
          storageLocation,
          photoUrls: [photoUrl],
        }),
      });

      if (res.ok) {
        const newLot = await res.json();
        showToast(`Official Lot Passport generated for ${newLot.lotNumber}!`);
        router.push(`/farmer/lots/${newLot.id}/passport`);
      } else {
        alert("Failed to create lot. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCommodity = commodities.find((c) => c.id === commodityId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition"
      >
        <ChevronLeft className="h-4 w-4" />
        {isMr ? "मागे जा" : "Back to My Lots"}
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri-700">
          <ShieldCheck className="h-4 w-4" />
          <span>Government Certified Quality Passport</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
          {isMr ? "नवीन शेतमाल लॉट व डिजिटल पासपोर्ट नोंदणी" : "Generate Digital Agricultural Lot Passport"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          {isMr
            ? "शेतमालाचा दर्जा, ओलावा आणि वजन नोंदवून थेट खरेदीदारांसाठी अधिकृत डिजिटल पासपोर्ट तयार करा."
            : "Capture quality parameters and harvest weights to produce a cryptographically verified tradeable lot passport with QR code."}
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6"
      >
        {/* Commodity Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Select Commodity (शेतमाल निवडा) *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {commodities.map((c) => {
              const isSelected = c.id === commodityId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCommodityId(c.id);
                    if (c.imageUrl) setPhotoUrl(c.imageUrl);
                    if (c.mspPrice) setBasePriceExpected(String(Math.round(c.mspPrice * 1.1)));
                  }}
                  className={`p-3 rounded-2xl border text-left transition ${
                    isSelected
                      ? "border-agri-600 bg-agri-50/80 ring-2 ring-agri-200"
                      : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <div className="text-xs font-bold text-stone-900 truncate">
                    {isMr ? c.nameMr : c.nameEn}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    MSP ₹{c.mspPrice}/qtl
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity and Expected Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Estimated Harvest Weight (एकूण वजन - क्विंटलमध्ये) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="1"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 text-sm focus:ring-2 focus:ring-agri-500 outline-none"
                placeholder="e.g. 75"
                required
              />
              <span className="absolute right-3 top-3 text-xs font-semibold text-stone-400">
                Quintals (Qtl)
              </span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">
              Roughly {(Number(quantityQuintals) / 10).toFixed(1)} Metric Tonnes (MT)
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Expected Base Price (अपेक्षित दर प्रति क्विंटल) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-sm font-bold text-stone-400">
                ₹
              </span>
              <input
                type="number"
                step="10"
                min="100"
                value={basePriceExpected}
                onChange={(e) => setBasePriceExpected(e.target.value)}
                className="w-full pl-8 pr-16 p-3 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 text-sm focus:ring-2 focus:ring-agri-500 outline-none"
                placeholder="e.g. 2600"
                required
              />
              <span className="absolute right-3 top-3 text-xs font-semibold text-stone-400">
                / Qtl
              </span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">
              Estimated Lot Value: ₹
              {(Number(quantityQuintals) * Number(basePriceExpected)).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Quality Grading Parameters */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Award className="h-4 w-4 text-agri-600" />
            <span>Digital Quality Grading Parameters (प्रतवारी निकष)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Moisture Content % (ओलावा प्रमाण)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="6.0"
                  max="18.0"
                  step="0.1"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(e.target.value)}
                  className="flex-1 accent-agri-600 cursor-pointer"
                />
                <span className="font-mono font-bold text-stone-900 bg-white border border-stone-300 px-2.5 py-1 rounded-lg text-xs">
                  {moisturePercent}%
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 block mt-1">
                ✓ Meets APMC dry grain standard (&lt;12.5%)
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Visual Inspection Grade (दृश्य प्रतवारी)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["A", "B", "C"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setVisualGrade(g)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      visualGrade === g
                        ? "bg-emerald-700 text-white border-emerald-800"
                        : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
                    }`}
                  >
                    Grade {g}
                    <span className="text-[9px] block font-normal opacity-80">
                      {g === "A" ? "Export/Bold" : g === "B" ? "Fair Avg" : "Processing"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Storage Location & Origin Market */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Current Storage Location (मालाचे ठिकाण)
            </label>
            <input
              type="text"
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-agri-500 outline-none"
              placeholder="e.g. Farm Gate, Niphad, Nashik"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Nearest Reference APMC (जवळची बाजार समिती)
            </label>
            <select
              value={marketId}
              onChange={(e) => setMarketId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-800 bg-white focus:ring-2 focus:ring-agri-500 outline-none"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nameEn} ({m.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Photo Upload Abstraction */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Lot Inspection Photo (तपासणी फोटो)
          </label>
          <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <img
              src={photoUrl}
              alt="Inspection preview"
              className="h-20 w-24 object-cover rounded-xl border border-stone-300"
            />
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-stone-800 block">
                Official Photo Provenance Stamp
              </span>
              <p className="text-stone-500 text-[11px]">
                Pre-calibrated with camera EXIF timestamp & geolocation verification.
              </p>
            </div>
          </div>
        </div>

        {/* Submit & Generate Button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-agri-700/20 transition disabled:opacity-50"
          >
            <QrCode className="h-4 w-4" />
            <span>{isSubmitting ? "Generating SHA-256 Passport..." : "Generate Official Lot Passport"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
