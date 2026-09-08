"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { formatINR, formatQuintals, formatDate } from "@/lib/utils";
import { DealPipelineStepper } from "@/components/deals/DealPipelineStepper";
import { EscrowPaymentTracker } from "@/components/deals/EscrowPaymentTracker";
import { DisputeModal } from "@/components/deals/DisputeModal";
import { TransportBookingCard } from "@/components/logistics/TransportBookingCard";
import { StorageBookingCard } from "@/components/logistics/StorageBookingCard";
import {
  ShieldCheck,
  Truck,
  Building,
  Award,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  FileText,
  User,
  CheckCircle2,
} from "lucide-react";

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, language, showToast } = useApp();
  const isMr = language === "mr";

  const [deal, setDeal] = useState<any>(null);
  const [logisticsData, setLogisticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  const fetchDeal = async () => {
    try {
      const res = await fetch(`/api/deals/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setDeal(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogistics = async () => {
    try {
      const res = await fetch("/api/logistics");
      if (res.ok) {
        const data = await res.json();
        setLogisticsData(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDeal();
    fetchLogistics();
  }, [params.id]);

  const handleAdvanceStage = async (targetStage: string, note?: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId: deal.id,
          targetStage,
          note: note || `Stage advanced to ${targetStage} by ${user.name}`,
        }),
      });

      if (res.ok) {
        showToast(`Deal advanced to ${targetStage.replace(/_/g, " ")}!`);
        await fetchDeal();
      } else {
        alert("Failed to advance stage.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-stone-500">
        Loading deal tracking room...
      </div>
    );
  }

  if (!deal) {
    return <div className="p-20 text-center text-stone-500">Deal not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                {deal.dealNumber}
              </span>
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Guaranteed Escrow
              </span>
            </div>
            <h1 className="text-2xl font-display font-bold text-stone-900 mt-1">
              {deal.commodity?.nameEn} ({formatQuintals(deal.agreedQuantity)})
            </h1>
          </div>
        </div>

        {/* Action button: Raise Dispute */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDisputeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition shadow-sm"
          >
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span>{isMr ? "तक्रार नोंदवा (Dispute)" : "Raise Dispute"}</span>
          </button>

          <button
            onClick={fetchDeal}
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition"
            title="Refresh deal status"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 7-Step Deal Pipeline Stepper */}
      <DealPipelineStepper
        currentStage={deal.stage}
        onAdvanceStage={handleAdvanceStage}
        userRole={user.role}
        isUpdating={isUpdating}
      />

      {/* Grid: Escrow Tracker & Deal Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Escrow & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Escrow Tracker with FPO Payout split */}
          <EscrowPaymentTracker deal={deal} />

          {/* Delivery & Quality Audit Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-agri-700" />
              <span>Inspection & Logistics Verification Log</span>
            </h3>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Destination Warehouse:</span>
                <span className="font-semibold text-stone-900">{deal.deliveryLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Quality Inspector Note:</span>
                <span className="font-medium text-stone-800">
                  {deal.qualityInspectorNote || "Awaiting weighment and quality confirmation."}
                </span>
              </div>
              {deal.confirmedMoisture && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Confirmed Moisture Level:</span>
                  <span>{deal.confirmedMoisture}% (Matched Passport)</span>
                </div>
              )}
            </div>

            {deal.weighmentSlipUrl && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700">
                  Weighment Scale Receipt (काटा पावती):
                </span>
                <img
                  src={deal.weighmentSlipUrl}
                  alt="Weighment Slip"
                  className="h-36 w-full object-cover rounded-2xl border border-stone-300"
                />
              </div>
            )}
          </div>

          {/* Logistics Matching Options (transporters) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-agri-700" />
                  <span>Suggested Transport Carriers</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Pre-verified agricultural freight carriers available in {deal.seller?.district || "Maharashtra"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {logisticsData?.transporters?.slice(0, 2).map((tp: any) => (
                <TransportBookingCard
                  key={tp.id}
                  transporter={tp}
                  transactionId={deal.id}
                  onBookSuccess={fetchDeal}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Counterparty details & Storage options */}
        <div className="lg:col-span-4 space-y-6">
          {/* Buyer Profile Box */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Buyer Details
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                B
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {deal.buyer?.buyerProfile?.companyName || deal.buyer?.name}
                </h4>
                <p className="text-xs text-stone-500">{deal.buyer?.phone}</p>
              </div>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-xl text-xs space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>APMC License:</span>
                <span className="font-mono font-semibold">
                  {deal.buyer?.buyerProfile?.apmcLicenseNo || "APMC/PUN/B-4501"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Reliability Rating:</span>
                <span className="font-bold text-amber-600">★ 4.9 / 5.0</span>
              </div>
            </div>
          </div>

          {/* Storage facilities if farmer holds instead of selling */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-emerald-700" />
                <span>Nearby MSWC Cold Storages</span>
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Hold produce safely if market prices are rising
              </p>
            </div>

            <div className="space-y-3">
              {logisticsData?.storages?.slice(0, 1).map((sf: any) => (
                <StorageBookingCard key={sf.id} storage={sf} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        transactionId={deal.id}
        dealNumber={deal.dealNumber}
        onDisputeRaised={fetchDeal}
      />
    </div>
  );
}
