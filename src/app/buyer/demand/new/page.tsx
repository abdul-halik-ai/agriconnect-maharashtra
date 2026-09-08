"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ClipboardList, ArrowLeft, Building2, CheckCircle2, ShieldCheck } from "lucide-react";

export default function NewDemandPage() {
  const router = useRouter();
  const { user, showToast } = useApp();

  const [commodities, setCommodities] = useState<any[]>([]);
  const [commodityId, setCommodityId] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("500");
  const [minPrice, setMinPrice] = useState("2500");
  const [maxPrice, setMaxPrice] = useState("2700");
  const [targetGrade, setTargetGrade] = useState("A");
  const [minMoisture, setMinMoisture] = useState("9.0");
  const [maxMoisture, setMaxMoisture] = useState("12.0");
  const [deliveryLocation, setDeliveryLocation] = useState("ITC Processing Hub, Pimpalgaon, Nashik");
  const [deliveryTerms, setDeliveryTerms] = useState("Buyer Warehouse Gate with Digital Weighment");
  const [daysValid, setDaysValid] = useState("14");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch("/api/prices");
        if (res.ok) {
          const data = await res.json();
          setCommodities(data.commodities || []);
          if (data.commodities?.[0]) setCommodityId(data.commodities[0].id);
        }
      } catch (e) {}
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: user.id,
          commodityId,
          requiredQuantity: Number(requiredQuantity),
          minPrice: Number(minPrice),
          maxPrice: Number(maxPrice),
          targetGrade,
          minMoisture: Number(minMoisture),
          maxMoisture: Number(maxMoisture),
          deliveryLocation,
          deliveryTerms,
          daysValid: Number(daysValid),
        }),
      });

      if (res.ok) {
        showToast("Open demand published to AgriConnect network!");
        router.push("/buyer/demand");
      } else {
        alert("Failed to publish demand.");
      }
    } catch (e) {
      console.error(e);
      alert("Error publishing demand.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl p-6 lg:p-8 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Demand Board
      </button>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
          <Building2 className="h-4 w-4" />
          <span>Institutional Procurement Listing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
          Publish Open Demand Tender
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Specify volume requirements, quality tolerances, and delivery location to receive direct quotes from farmers and FPOs
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 text-xs"
      >
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Target Commodity *
          </label>
          <select
            value={commodityId}
            onChange={(e) => setCommodityId(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-300 font-semibold text-stone-800 bg-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {commodities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn} ({c.nameMr}) — MSP: ₹{c.mspPrice}/qtl
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Required Volume (Qtl) *
            </label>
            <input
              type="number"
              value={requiredQuantity}
              onChange={(e) => setRequiredQuantity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Min Price (₹ / Qtl) *
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Max Price (₹ / Qtl) *
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Quality parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Target Grade</label>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="w-full p-2 rounded-lg border border-stone-300 bg-white font-bold"
            >
              <option value="A">Grade A (Export / Bold)</option>
              <option value="B">Grade B (Standard Commercial)</option>
              <option value="C">Grade C (Processing)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Min Moisture %</label>
            <input
              type="number"
              step="0.5"
              value={minMoisture}
              onChange={(e) => setMinMoisture(e.target.value)}
              className="w-full p-2 rounded-lg border border-stone-300 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Max Moisture %</label>
            <input
              type="number"
              step="0.5"
              value={maxMoisture}
              onChange={(e) => setMaxMoisture(e.target.value)}
              className="w-full p-2 rounded-lg border border-stone-300 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Delivery Depot Location *
            </label>
            <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Tender Expiry Window
            </label>
            <select
              value={daysValid}
              onChange={(e) => setDaysValid(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold"
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-sm transition disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish Open Demand"}
          </button>
        </div>
      </form>
    </div>
  );
}
