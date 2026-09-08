"use client";

import React, { useState } from "react";
import { Building, ShieldCheck, ThermometerSnowflake, CheckCircle, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface StorageBookingCardProps {
  storage: {
    id: string;
    name: string;
    facilityType: string;
    district: string;
    location: string;
    totalCapacityMT: number;
    availableCapacityMT: number;
    monthlyRatePerQuintal: number;
    humidityControlled: boolean;
    contactPhone: string;
  };
  onBookSuccess?: () => void;
}

export function StorageBookingCard({ storage, onBookSuccess }: StorageBookingCardProps) {
  const { user, showToast } = useApp();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const estimatedCost = Math.round(storage.monthlyRatePerQuintal * 50); // e.g. 50 qtls for 1 mo
      const res = await fetch("/api/logistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          bookingType: "STORAGE",
          storageFacilityId: storage.id,
          durationDays: 30,
          estimatedCost,
        }),
      });

      if (res.ok) {
        setBooked(true);
        showToast(`Space reserved at ${storage.name}! Storage slip generated.`);
        if (onBookSuccess) onBookSuccess();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-subtle hover:shadow-card transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 leading-tight">
                {storage.name}
              </h4>
              <span className="text-[11px] text-stone-500 font-medium">
                {storage.district} • {storage.facilityType.replace("_", " ")}
              </span>
            </div>
          </div>

          {storage.humidityControlled && (
            <span className="flex items-center gap-1 bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
              <ThermometerSnowflake className="h-3 w-3" />
              Cold Chain
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-stone-50 text-xs">
          <div>
            <span className="text-[10px] text-stone-400 block">Available Space</span>
            <span className="font-bold text-stone-800 font-mono">
              {storage.availableCapacityMT} MT
            </span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 block">Monthly Tariff</span>
            <span className="font-bold text-agri-700 font-mono">
              ₹{storage.monthlyRatePerQuintal}/Qtl / Mo
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-500 mb-3 line-clamp-1">
          {storage.location} • Ph: {storage.contactPhone}
        </p>
      </div>

      <button
        onClick={handleBook}
        disabled={isBooking || booked}
        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
          booked
            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
            : "bg-agri-700 hover:bg-agri-800 text-white shadow-sm"
        }`}
      >
        {booked ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Storage Bay Reserved
          </>
        ) : isBooking ? (
          "Reserving Space..."
        ) : (
          <>
            Reserve Storage Bay
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
