"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  CalendarCheck,
  Truck,
  MapPin,
  Award,
  Wallet,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export const PIPELINE_STAGES = [
  {
    key: "OFFER_ACCEPTED",
    step: 1,
    titleEn: "Offer Accepted",
    titleMr: "सौदा निश्चित",
    descEn: "Agreed terms & Escrow funded",
    descMr: "दर व अटी मान्य, हमी रक्कम जमा",
    icon: FileCheck2,
  },
  {
    key: "LOGISTICS_SCHEDULED",
    step: 2,
    titleEn: "Logistics Scheduled",
    titleMr: "वाहतूक निश्चित",
    descEn: "Vehicle assigned & pickup planned",
    descMr: "वाहन निश्चित, उचलण्याची वेळ ठरली",
    icon: CalendarCheck,
  },
  {
    key: "IN_TRANSIT",
    step: 3,
    titleEn: "In Transit",
    titleMr: "वाहतूक सुरू",
    descEn: "On the way to buyer depot",
    descMr: "खरेदीदाराच्या गोदामाकडे रवाना",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    step: 4,
    titleEn: "Delivered at Depot",
    titleMr: "गोदामात पोहोचला",
    descEn: "Weighment slip generated",
    descMr: "काटा पावती तयार झाली",
    icon: MapPin,
  },
  {
    key: "QUALITY_CONFIRMED",
    step: 5,
    titleEn: "Quality Confirmed",
    titleMr: "प्रतवारी तपासणी",
    descEn: "Moisture & Grade verified against passport",
    descMr: "पासपोर्टनुसार ओलावा व दर्जा तपासणी पूर्ण",
    icon: Award,
  },
  {
    key: "PAYMENT_RELEASED",
    step: 6,
    titleEn: "Payment Released",
    titleMr: "रक्कम जमा",
    descEn: "Escrow disbursed to farmer bank account",
    descMr: "शेतकऱ्याच्या बँक खात्यात पैसे जमा",
    icon: Wallet,
  },
  {
    key: "COMPLETED",
    step: 7,
    titleEn: "Completed",
    titleMr: "व्यवहार पूर्ण",
    descEn: "Official transaction receipt issued",
    descMr: "शासकीय व्यवहार पावती जारी",
    icon: CheckCircle2,
  },
];

interface DealPipelineStepperProps {
  currentStage: string;
  onAdvanceStage?: (targetStage: string, note?: string) => Promise<void>;
  userRole?: string;
  isUpdating?: boolean;
}

export function DealPipelineStepper({
  currentStage,
  onAdvanceStage,
  userRole,
  isUpdating,
}: DealPipelineStepperProps) {
  const { language } = useApp();
  const isMr = language === "mr";

  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.key === currentStage);
  const activeStep = currentIndex !== -1 ? currentIndex + 1 : 1;

  const nextStage =
    currentIndex < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[currentIndex + 1] : null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-agri-700 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            {isMr ? "७-टप्पे थेट पारदर्शक व्यवहार पाइपलाइन" : "7-Step Guaranteed Settlement Pipeline"}
          </span>
          <h3 className="text-lg font-bold text-stone-900 mt-0.5">
            {isMr ? "सध्याचा टप्पा:" : "Current Stage:"}{" "}
            <span className="text-agri-700">
              {isMr ? PIPELINE_STAGES[currentIndex]?.titleMr : PIPELINE_STAGES[currentIndex]?.titleEn}
            </span>{" "}
            (Step {activeStep} of 7)
          </h3>
        </div>

        {/* Advance Stage Trigger Button if permitted */}
        {nextStage && onAdvanceStage && (
          <button
            onClick={() => onAdvanceStage(nextStage.key)}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-agri-700 hover:bg-agri-800 disabled:opacity-50 text-white transition shadow-sm"
          >
            <span>
              {isMr ? `टप्पा ${nextStage.step} वर जा:` : "Advance to:"} {isMr ? nextStage.titleMr : nextStage.titleEn}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Visual Stepper Bar */}
      <div className="relative">
        {/* Desktop Progress Line */}
        <div className="hidden md:block absolute top-6 left-6 right-6 h-1 bg-stone-200 -z-0">
          <div
            className="h-1 bg-agri-600 transition-all duration-500"
            style={{
              width: `${(currentIndex / (PIPELINE_STAGES.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Stepper Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-2">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className={`flex md:flex-col items-center md:items-center text-left md:text-center gap-3 md:gap-2 p-3 md:p-1 rounded-2xl md:rounded-none transition ${
                  isCurrent
                    ? "bg-agri-50 md:bg-transparent border border-agri-200 md:border-none"
                    : ""
                }`}
              >
                {/* Node Icon */}
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-sm z-10 transition-all shadow-sm ${
                    isCompleted
                      ? "bg-agri-600 text-white"
                      : isCurrent
                      ? "bg-agri-700 text-white ring-4 ring-agri-200 animate-soft-pulse"
                      : "bg-stone-100 text-stone-400 border border-stone-200"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>

                {/* Node Text */}
                <div className="flex-1 md:w-full">
                  <div className="flex items-center gap-1.5 md:justify-center">
                    <span className="text-[10px] font-bold text-stone-400 font-mono">
                      0{stage.step}
                    </span>
                    <h4
                      className={`text-xs font-bold leading-snug ${
                        isCurrent
                          ? "text-agri-900 font-extrabold"
                          : isCompleted
                          ? "text-stone-900"
                          : "text-stone-400"
                      }`}
                    >
                      {isMr ? stage.titleMr : stage.titleEn}
                    </h4>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5 hidden sm:block">
                    {isMr ? stage.descMr : stage.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
