"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  UserCheck2,
  Building2,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  Search,
} from "lucide-react";

export default function AdminKycPage() {
  const { showToast } = useApp();
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadKyc = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setBuyers(data.pendingBuyers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKyc();
  }, []);

  const handleAction = async (buyerProfileId: string, action: "VERIFY" | "REJECT") => {
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerProfileId, action }),
      });

      if (res.ok) {
        showToast(
          `Buyer application successfully ${action === "VERIFY" ? "Approved" : "Rejected"}!`
        );
        await loadKyc();
      } else {
        alert("Failed to update status.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <UserCheck2 className="h-4 w-4" />
            <span>Accreditation Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            Buyer KYC Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Review GSTIN authenticity, APMC market licenses, and grant institutional trading rights
          </p>
        </div>

        <button
          onClick={loadKyc}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-stone-500">Loading KYC queue...</div>
      ) : buyers.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-stone-500">
          <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-bold text-stone-800">KYC Verification Queue Clear</h3>
          <p className="text-xs text-stone-500 mt-1">
            All registered buyers in Maharashtra are currently verified with valid APMC credentials.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {buyers.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      {b.companyName}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Contact: {b.user?.name} • Phone: {b.user?.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-400 block">APMC License</span>
                    <span className="font-mono font-bold text-stone-900">
                      {b.apmcLicenseNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">GSTIN</span>
                    <span className="font-mono font-bold text-stone-900">{b.gstin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Annual Trade Volume</span>
                    <span className="font-mono font-bold text-stone-900">
                      {b.tradeVolumeMT} MT
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600">
                  <strong>Stated Payment Terms:</strong> {b.paymentTerms}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                <button
                  onClick={() => handleAction(b.id, "REJECT")}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold transition"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleAction(b.id, "VERIFY")}
                  className="flex items-center gap-1 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve & Grant APMC Badge</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
