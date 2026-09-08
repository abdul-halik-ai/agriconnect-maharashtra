"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { LotCard } from "@/components/lots/LotCard";
import { formatINR, formatQuintals } from "@/lib/utils";
import {
  Search,
  Filter,
  ShieldCheck,
  Send,
  X,
  Award,
  Layers,
  Building2,
  RefreshCw,
} from "lucide-react";

export default function BuyerBrowseLotsPage() {
  const { user, showToast } = useApp();

  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "FPO" | "FARMER">("ALL");

  // Offer modal state
  const [selectedLotForOffer, setSelectedLotForOffer] = useState<any | null>(null);
  const [offeredPrice, setOfferedPrice] = useState("");
  const [offeredQuantity, setOfferedQuantity] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("Buyer Processing Depot, Chakan, Pune");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  const fetchLots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lots?status=AVAILABLE");
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
  }, []);

  const handleOpenOfferModal = (lot: any) => {
    setSelectedLotForOffer(lot);
    setOfferedPrice(String(lot.basePriceExpected));
    setOfferedQuantity(String(lot.quantityQuintals));
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotForOffer) return;

    setIsSubmittingOffer(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: user.id,
          sellerId: selectedLotForOffer.creatorId,
          lotId: selectedLotForOffer.id,
          offeredPrice: Number(offeredPrice),
          offeredQuantity: Number(offeredQuantity),
          deliveryLocation,
          paymentTerms: "100% Escrow on Quality Acceptance",
          notes: `Digital offer submitted by ${user.name} for Lot #${selectedLotForOffer.lotNumber}.`,
        }),
      });

      if (res.ok) {
        showToast(`Digital offer sent to ${selectedLotForOffer.creator?.name}! Seller notified.`);
        setSelectedLotForOffer(null);
        await fetchLots();
      } else {
        alert("Failed to submit offer.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting offer.");
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const filtered = lots.filter((l) => {
    if (filterType === "ALL") return true;
    if (filterType === "FPO") return l.isAggregated;
    if (filterType === "FARMER") return !l.isAggregated;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Search className="h-4 w-4" />
            <span>Verified Lot Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            Browse Quality-Verified Lots
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Inspect digital lot passports with verifiable moisture %, visual grades, and direct farm gate quotes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterType === "ALL" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
            }`}
          >
            All Lots ({lots.length})
          </button>
          <button
            onClick={() => setFilterType("FPO")}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterType === "FPO" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
            }`}
          >
            FPO Pooled Lots ({lots.filter((l) => l.isAggregated).length})
          </button>
          <button
            onClick={() => setFilterType("FARMER")}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterType === "FARMER" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
            }`}
          >
            Individual Farmer Lots ({lots.filter((l) => !l.isAggregated).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200 text-stone-500">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-700">Loading verified lots...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-stone-500">
          <Search className="h-10 w-10 text-stone-300 mx-auto mb-2" />
          <p className="font-semibold">No available lots in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lot) => (
            <LotCard
              key={lot.id}
              lot={lot}
              showMakeOffer={true}
              onMakeOffer={handleOpenOfferModal}
            />
          ))}
        </div>
      )}

      {/* Send Offer Modal */}
      {selectedLotForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <Send className="h-4 w-4 text-blue-600" />
                <span>Submit Digital Offer: {selectedLotForOffer.lotNumber}</span>
              </div>
              <button
                onClick={() => setSelectedLotForOffer(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendOffer} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Commodity:</span>
                  <span className="font-bold text-stone-900">
                    {selectedLotForOffer.commodity?.nameEn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Seller:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedLotForOffer.creator?.name} ({selectedLotForOffer.ownerType})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Seller Base Asking:</span>
                  <span className="font-mono font-bold text-agri-700">
                    {formatINR(selectedLotForOffer.basePriceExpected)}/qtl
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Offered Price (₹ / Qtl) *
                  </label>
                  <input
                    type="number"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Quantity (Qtl) *
                  </label>
                  <input
                    type="number"
                    value={offeredQuantity}
                    onChange={(e) => setOfferedQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Delivery Destination Depot *
                </label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-900">
                Total Offer Value:{" "}
                <strong className="font-mono text-sm">
                  {formatINR(Number(offeredPrice) * Number(offeredQuantity))}
                </strong>
                . Upon acceptance by seller, funds will be locked in State Apex Escrow.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setSelectedLotForOffer(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOffer}
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition disabled:opacity-50"
                >
                  {isSubmittingOffer ? "Sending..." : "Submit Digital Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
