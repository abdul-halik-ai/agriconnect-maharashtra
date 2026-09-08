"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { formatINR, formatQuintals } from "@/lib/utils";
import {
  Layers,
  ShieldCheck,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface FarmerContributionInput {
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  contributedWeight: number;
  moisturePercent: number;
  visualGrade: string;
}

export default function LotAggregationBuilder() {
  const router = useRouter();
  const { user, language, showToast } = useApp();
  const isMr = language === "mr";

  const [commodities, setCommodities] = useState<any[]>([]);
  const [commodityId, setCommodityId] = useState("c_onion");
  const [basePriceExpected, setBasePriceExpected] = useState("2650");
  const [storageLocation, setStorageLocation] = useState("Sahyadri FPO Central Depot, Mohadi, Nashik");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seeded smallholder members of FPO for quick aggregation selection
  const availableFarmers = [
    { id: "u_farmer_ramesh", name: "Ramesh Patil", phone: "9822012345", defaultWeight: 80, moisture: 11.2 },
    { id: "u_farmer_baburao", name: "Baburao Shinde", phone: "9822012346", defaultWeight: 75, moisture: 11.4 },
    { id: "u_farmer_sunita", name: "Sunita Jadhav", phone: "9822012347", defaultWeight: 60, moisture: 11.1 },
    { id: "u_farmer_pandurang", name: "Pandurang Sutar", phone: "9822012360", defaultWeight: 85, moisture: 11.5 },
  ];

  const [contributions, setContributions] = useState<FarmerContributionInput[]>([
    {
      farmerId: availableFarmers[0].id,
      farmerName: availableFarmers[0].name,
      farmerPhone: availableFarmers[0].phone,
      contributedWeight: 80,
      moisturePercent: 11.2,
      visualGrade: "A",
    },
    {
      farmerId: availableFarmers[1].id,
      farmerName: availableFarmers[1].name,
      farmerPhone: availableFarmers[1].phone,
      contributedWeight: 75,
      moisturePercent: 11.4,
      visualGrade: "A",
    },
    {
      farmerId: availableFarmers[2].id,
      farmerName: availableFarmers[2].name,
      farmerPhone: availableFarmers[2].phone,
      contributedWeight: 60,
      moisturePercent: 11.1,
      visualGrade: "A",
    },
  ]);

  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch("/api/prices");
        if (res.ok) {
          const data = await res.json();
          setCommodities(data.commodities || []);
        }
      } catch (e) {}
    }
    loadMeta();
  }, []);

  // Compute live pooled metrics
  const totalWeight = contributions.reduce((sum, c) => sum + (Number(c.contributedWeight) || 0), 0);
  const weightedMoisture =
    totalWeight > 0
      ? contributions.reduce(
          (sum, c) => sum + (Number(c.contributedWeight) || 0) * (Number(c.moisturePercent) || 0),
          0
        ) / totalWeight
      : 0;

  const totalEstimatedLotValue = totalWeight * Number(basePriceExpected || 0);

  const handleAddFarmer = () => {
    const nextFarmer =
      availableFarmers.find((f) => !contributions.some((c) => c.farmerId === f.id)) ||
      availableFarmers[availableFarmers.length - 1];

    setContributions([
      ...contributions,
      {
        farmerId: nextFarmer.id,
        farmerName: nextFarmer.name,
        farmerPhone: nextFarmer.phone,
        contributedWeight: 50,
        moisturePercent: 11.5,
        visualGrade: "A",
      },
    ]);
  };

  const handleRemoveContribution = (index: number) => {
    if (contributions.length <= 1) {
      alert("At least one farmer contribution is required.");
      return;
    }
    setContributions(contributions.filter((_, i) => i !== index));
  };

  const handleWeightChange = (index: number, weight: number) => {
    const next = [...contributions];
    next[index].contributedWeight = weight;
    setContributions(next);
  };

  const handleMoistureChange = (index: number, moisture: number) => {
    const next = [...contributions];
    next[index].moisturePercent = moisture;
    setContributions(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contributions.length === 0 || totalWeight <= 0) {
      alert("Please add at least one valid farmer contribution.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lots/aggregate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fpoUserId: user.id,
          commodityId,
          basePriceExpected: Number(basePriceExpected),
          storageLocation,
          contributions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(
          `Aggregated Lot ${data.lot.lotNumber} created successfully with ${contributions.length} member smallholders!`
        );
        router.push("/fpo/dashboard");
      } else {
        alert("Failed to create aggregated lot.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating pooled lot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to FPO Dashboard
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri-700">
          <Layers className="h-4 w-4" />
          <span>FPO Produce Pooling Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
          {isMr ? "शेतकरी उत्पादक कंपनी लॉट संकलन" : "FPO Produce Aggregation & Fair Contribution Ledger"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          {isMr
            ? "अनेक लहान शेतकऱ्यांचा शेतीमाल एकत्र करून मोठा विक्रीयोग्य लॉट तयार करा आणि प्रत्येक शेतकऱ्याचा हिस्सा निश्चित करा."
            : "Pool smallholder farmer produce into bulk institutional lots. Automatically logs transparent contribution weights for proportionate deal escrow payouts."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lot Configuration Header */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <span>Target Commodity & Expected Lot Terms</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Commodity to Aggregate
              </label>
              <select
                value={commodityId}
                onChange={(e) => setCommodityId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-stone-800 bg-white text-xs focus:ring-2 focus:ring-agri-500 outline-none"
              >
                {commodities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn} ({c.nameMr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Target Asking Rate (₹ / Quintal)
              </label>
              <input
                type="number"
                value={basePriceExpected}
                onChange={(e) => setBasePriceExpected(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 text-xs focus:ring-2 focus:ring-agri-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Aggregation Hub / Warehouse
              </label>
              <input
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-agri-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Aggregation Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-agri-900 to-stone-900 text-white shadow-md">
          <div>
            <span className="text-[11px] text-emerald-300 font-semibold block uppercase">
              Total Pooled Weight
            </span>
            <span className="text-2xl font-bold font-mono">
              {formatQuintals(totalWeight)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-emerald-300 font-semibold block uppercase">
              Weighted Avg Moisture
            </span>
            <span className="text-2xl font-bold font-mono">
              {weightedMoisture.toFixed(1)}%
            </span>
            <span className="text-[10px] text-emerald-400 block">Grade A Uniformity</span>
          </div>

          <div>
            <span className="text-[11px] text-emerald-300 font-semibold block uppercase">
              Participating Farmers
            </span>
            <span className="text-2xl font-bold font-mono">
              {contributions.length} Members
            </span>
          </div>

          <div>
            <span className="text-[11px] text-emerald-300 font-semibold block uppercase">
              Estimated Total Value
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-300">
              {formatINR(totalEstimatedLotValue)}
            </span>
          </div>
        </div>

        {/* Contributing Farmers Table */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-agri-700" />
                <span>Smallholder Member Contributions & Share Ledger</span>
              </h3>
              <p className="text-xs text-stone-500">
                Transparently tracks individual quantities for automatic escrow payout splits
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddFarmer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-800 transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Member Farmer
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                <tr>
                  <th className="py-3 px-3 font-semibold">Farmer Member</th>
                  <th className="py-3 px-3 font-semibold">Phone / Kisan ID</th>
                  <th className="py-3 px-3 font-semibold">Weight (Qtl)</th>
                  <th className="py-3 px-3 font-semibold">Moisture %</th>
                  <th className="py-3 px-3 font-semibold">Grade</th>
                  <th className="py-3 px-3 font-semibold">Pool Share %</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {contributions.map((c, idx) => {
                  const sharePercent = totalWeight > 0 ? (c.contributedWeight / totalWeight) * 100 : 0;

                  return (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3">
                        <select
                          value={c.farmerId}
                          onChange={(e) => {
                            const found = availableFarmers.find((f) => f.id === e.target.value);
                            if (found) {
                              const next = [...contributions];
                              next[idx].farmerId = found.id;
                              next[idx].farmerName = found.name;
                              next[idx].farmerPhone = found.phone;
                              setContributions(next);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 text-xs"
                        >
                          {availableFarmers.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-stone-500">
                        {c.farmerPhone}
                      </td>

                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          step="1"
                          min="1"
                          value={c.contributedWeight}
                          onChange={(e) => handleWeightChange(idx, Number(e.target.value))}
                          className="w-24 p-1.5 rounded-lg border border-stone-300 font-mono font-bold text-stone-900 text-xs"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="5"
                          max="20"
                          value={c.moisturePercent}
                          onChange={(e) => handleMoistureChange(idx, Number(e.target.value))}
                          className="w-20 p-1.5 rounded-lg border border-stone-300 font-mono font-medium text-stone-800 text-xs"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          Grade {c.visualGrade}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-stone-900 text-sm">
                        {sharePercent.toFixed(1)}%
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveContribution(idx)}
                          className="p-1 text-stone-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || totalWeight <= 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>
              {isSubmitting
                ? "Generating Aggregated Passport..."
                : `Create Aggregated Lot (${totalWeight} Qtl)`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}


