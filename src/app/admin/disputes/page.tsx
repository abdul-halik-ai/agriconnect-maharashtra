"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatINR, formatDateTime, formatDate } from "@/lib/utils";
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  Eye,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function AdminDisputesPage() {
  const { user, showToast } = useApp();

  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/disputes");
      if (res.ok) {
        const data = await res.json();
        setDisputes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleResolve = async (disputeId: string, status: "RESOLVED" | "UNDER_REVIEW") => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/disputes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId,
          status,
          resolutionNotes:
            resolutionNotes ||
            `Arbitrated by MSIS state officer. Escrow settlement instructed according to weighbridge slip.`,
          adminId: user.id,
        }),
      });

      if (res.ok) {
        showToast(`Dispute updated to ${status}! Both parties notified.`);
        setSelectedDispute(null);
        setResolutionNotes("");
        await loadDisputes();
      } else {
        alert("Failed to update dispute.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700">
            <Scale className="h-4 w-4" />
            <span>State Arbitration Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            Trade Dispute Resolution Desk
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Review buyer/seller claims, inspect digital weighment slips & lot passports, and release escrow judgments
          </p>
        </div>

        <button
          onClick={loadDisputes}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-stone-500">Loading disputes registry...</div>
      ) : disputes.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-stone-500">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-bold text-stone-800">Zero Pending Disputes</h3>
          <p className="text-xs text-stone-500 mt-1">
            All trades across Maharashtra are operating smoothly with 100% agreement.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => {
            const isOpen = d.status === "OPEN";
            const isResolved = d.status === "RESOLVED";

            return (
              <div
                key={d.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        isOpen
                          ? "bg-red-100 text-red-800"
                          : isResolved
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {d.status}
                    </span>

                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                      Deal: {d.transaction?.dealNumber}
                    </span>

                    <span className="text-xs text-stone-500">
                      Filed {formatDate(d.createdAt)}
                    </span>
                  </div>

                  <div className="text-xs text-stone-500">
                    Raised by: <strong className="text-stone-900">{d.raisedBy?.name}</strong> (
                    {d.raisedBy?.role})
                  </div>
                </div>

                {/* Dispute Category & Claim Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                    <h3 className="text-base font-bold text-stone-900">
                      Category: {d.reasonCategory.replace(/_/g, " ")}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-700 bg-red-50/50 p-3.5 rounded-2xl border border-red-100 leading-relaxed font-normal">
                    {d.description}
                  </p>
                </div>

                {/* Linked Transaction Snapshot */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Commodity</span>
                    <strong className="text-stone-900">
                      {d.transaction?.commodity?.nameEn}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total Escrow</span>
                    <strong className="text-stone-900 font-mono">
                      {formatINR(d.transaction?.totalAmount || 0)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Seller</span>
                    <strong className="text-stone-900">
                      {d.transaction?.seller?.fpoProfile?.fpoName || d.transaction?.seller?.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Buyer</span>
                    <strong className="text-stone-900">
                      {d.transaction?.buyer?.buyerProfile?.companyName || d.transaction?.buyer?.name}
                    </strong>
                  </div>
                </div>

                {/* Resolution Notes if already resolved */}
                {d.resolutionNotes && (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">
                      MSIS Official Arbitration Judgment:
                    </span>
                    <p className="text-emerald-900 leading-relaxed">{d.resolutionNotes}</p>
                    <span className="text-[10px] text-emerald-700 mt-1 block">
                      Resolved on: {formatDateTime(d.resolvedAt)}
                    </span>
                  </div>
                )}

                {/* Arbitration Actions */}
                {isOpen && (
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                    <Link
                      href={`/farmer/deals/${d.transactionId}`}
                      className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1"
                    >
                      <span>Inspect Complete Deal Room</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolve(d.id, "UNDER_REVIEW")}
                        disabled={isUpdating}
                        className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold transition"
                      >
                        Mark Under Review
                      </button>

                      <button
                        onClick={() => handleResolve(d.id, "RESOLVED")}
                        disabled={isUpdating}
                        className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-sm"
                      >
                        Resolve & Instruct Escrow
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
