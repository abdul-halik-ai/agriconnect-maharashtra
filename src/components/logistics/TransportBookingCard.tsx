"use client";

import React, { useState } from "react";
import { Truck, Star, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface TransportBookingCardProps {
  transporter: {
    id: string;
    companyName: string;
    contactName: string;
    phone: string;
    vehicleType: string;
    capacityMT: number;
    ratePerKm: number;
    baseDistrict: string;
    rating: number;
    isAvailable: boolean;
  };
  transactionId?: string;
  onBookSuccess?: () => void;
}

export function TransportBookingCard({
  transporter,
  transactionId,
  onBookSuccess,
}: TransportBookingCardProps) {
  const { user, showToast } = useApp();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const estimatedCost = Math.round(transporter.ratePerKm * 180); // sample 180km trip
      const res = await fetch("/api/logistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          transactionId: transactionId || null,
          bookingType: "TRANSPORT",
          transportProviderId: transporter.id,
          durationDays: 1,
          estimatedCost,
        }),
      });

      if (res.ok) {
        setBooked(true);
        showToast(`Vehicle booked: ${transporter.companyName} (${transporter.vehicleType})! Driver notified.`);
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
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 leading-tight">
                {transporter.companyName}
              </h4>
              <span className="text-[11px] text-stone-500">{transporter.vehicleType}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>{transporter.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-stone-50 text-xs">
          <div>
            <span className="text-[10px] text-stone-400 block">Payload Capacity</span>
            <span className="font-bold text-stone-800 font-mono">
              {transporter.capacityMT} MT ({(transporter.capacityMT * 10).toFixed(0)} Qtl)
            </span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 block">Base Freight Rate</span>
            <span className="font-bold text-emerald-700 font-mono">
              ₹{transporter.ratePerKm}/km
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-stone-400" />
            {transporter.baseDistrict} Hub
          </span>
          <span className="text-stone-700 font-mono">
            Driver: {transporter.phone}
          </span>
        </div>
      </div>

      <button
        onClick={handleBook}
        disabled={isBooking || booked}
        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
          booked
            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
            : "bg-stone-900 hover:bg-stone-800 text-white shadow-sm"
        }`}
      >
        {booked ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Vehicle Booked & Dispatched
          </>
        ) : isBooking ? (
          "Confirming..."
        ) : (
          <>
            Book Transport
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
