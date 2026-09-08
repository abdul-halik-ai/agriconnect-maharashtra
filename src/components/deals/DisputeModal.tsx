"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Upload, ShieldAlert, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  dealNumber: string;
  onDisputeRaised: () => void;
}

export function DisputeModal({
  isOpen,
  onClose,
  transactionId,
  dealNumber,
  onDisputeRaised,
}: DisputeModalProps) {
  const { user, showToast } = useApp();
  const [reasonCategory, setReasonCategory] = useState("WEIGHT_DISCREPANCY");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please provide details of the dispute.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          raisedById: user.id,
          reasonCategory,
          description,
          evidenceUrls: [
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
          ],
        }),
      });

      if (res.ok) {
        showToast(`Dispute raised on deal ${dealNumber}. Escrow balance frozen pending MSIS review.`);
        onDisputeRaised();
        onClose();
      } else {
        alert("Failed to submit dispute. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while filing the dispute.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-red-50/60">
          <div className="flex items-center gap-2 text-red-800">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="font-bold text-sm">Raise Trade Dispute (तक्रार नोंदवा)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <span className="text-stone-500 font-semibold block mb-1">Deal Reference</span>
            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded-lg">
              {dealNumber}
            </span>
          </div>

          <div>
            <label className="text-stone-700 font-semibold block mb-1">
              Reason for Dispute
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-800 focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="WEIGHT_DISCREPANCY">
                Weight Discrepancy at Weighbridge (काटा वजनात तफावत)
              </option>
              <option value="QUALITY_MISMATCH">
                Quality / Moisture Below Passport Spec (दर्जा / ओलावा विसंगती)
              </option>
              <option value="TRANSIT_DAMAGE">Transit Spoilage / Damage (वाहतुकीत नुकसान)
              </option>
              <option value="PAYMENT_DELAY">Payment Clearance Delay (पैसे जमा होण्यास विलंब)</option>
              <option value="OTHER">Other Contractual Dispute (इतर तक्रार)</option>
            </select>
          </div>

          <div>
            <label className="text-stone-700 font-semibold block mb-1">
              Description & Specific Claim
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the exact discrepancy (e.g. Weighbridge slip recorded 58.2 Qtl instead of 60.0 Qtl. Requesting ₹3,690 escrow deduction before release)..."
              className="w-full p-3 rounded-xl border border-stone-300 text-stone-800 focus:ring-2 focus:ring-red-400 outline-none text-xs"
              required
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center">
            <Upload className="h-5 w-5 text-stone-400 mx-auto mb-1" />
            <span className="text-stone-600 font-medium block">
              Weighment slip & inspection photo auto-attached
            </span>
            <span className="text-[10px] text-stone-400">
              Files referenced from digital lot passport & depot weighment
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <strong>Important:</strong> Filing a dispute immediately freezes the transaction escrow. The Maharashtra State Innovation Society arbitration desk will review the evidence within 24 hours.
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Dispute to MSIS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
