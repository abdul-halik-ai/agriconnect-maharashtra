"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, DEMO_USERS } from "@/context/AppContext";
import {
  Sprout,
  ShieldCheck,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchDemoRole, showToast } = useApp();

  const [identifier, setIdentifier] = useState("9822012345");
  const [otp, setOtp] = useState("123456");
  const [useOtp, setUseOtp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (role: "FARMER" | "FPO" | "BUYER" | "ADMIN") => {
    switchDemoRole(role);
    if (role === "FARMER") router.push("/farmer/prices");
    else if (role === "FPO") router.push("/fpo/dashboard");
    else if (role === "BUYER") router.push("/buyer/demand");
    else router.push("/admin/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      handleQuickLogin("FARMER");
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-agri-600 text-white flex items-center justify-center mx-auto shadow-md shadow-agri-600/20">
            <Sprout className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-display font-bold text-stone-900">
            AgriConnect Maharashtra
          </h1>
          <p className="text-xs text-stone-500">
            Government of Maharashtra • MSIS & MSAMB Digital Gateway
          </p>
        </div>

        {/* 1-Click Demo Persona Fast-Logins */}
        <div className="space-y-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider text-center">
            One-Click Demo Personas
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin("FARMER")}
              className="p-2 bg-white rounded-xl border border-stone-200 hover:border-agri-600 text-left transition shadow-subtle text-xs"
            >
              <div className="font-bold text-stone-900 truncate">Ramesh Patil</div>
              <div className="text-[10px] text-emerald-700">Demo Farmer</div>
            </button>
            <button
              onClick={() => handleQuickLogin("FPO")}
              className="p-2 bg-white rounded-xl border border-stone-200 hover:border-amber-600 text-left transition shadow-subtle text-xs"
            >
              <div className="font-bold text-stone-900 truncate">Sahyadri FPO</div>
              <div className="text-[10px] text-amber-700">FPO Admin</div>
            </button>
            <button
              onClick={() => handleQuickLogin("BUYER")}
              className="p-2 bg-white rounded-xl border border-stone-200 hover:border-blue-600 text-left transition shadow-subtle text-xs"
            >
              <div className="font-bold text-stone-900 truncate">ITC Agri Business</div>
              <div className="text-[10px] text-blue-700">Verified Buyer</div>
            </button>
            <button
              onClick={() => handleQuickLogin("ADMIN")}
              className="p-2 bg-white rounded-xl border border-stone-200 hover:border-purple-600 text-left transition shadow-subtle text-xs"
            >
              <div className="font-bold text-stone-900 truncate">MSIS Officer</div>
              <div className="text-[10px] text-purple-700">State Admin</div>
            </button>
          </div>
        </div>

        {/* Standard Phone / OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Mobile Number (मोबाईल क्रमांक)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-stone-400 font-bold">
                +91
              </span>
              <input
                type="tel"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-stone-300 font-mono font-medium text-stone-900 text-sm focus:ring-2 focus:ring-agri-500 outline-none"
                placeholder="98220 12345"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-stone-700">
                OTP (ओटीपी)
              </label>
              <span className="text-[10px] text-emerald-700 font-bold">
                Default OTP: 123456
              </span>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-center tracking-widest font-bold text-stone-900 text-base focus:ring-2 focus:ring-agri-500 outline-none"
              placeholder="123456"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Verifying with MSAMB..." : "Verify OTP & Enter"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-[11px] text-emerald-900 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <span>Aadhaar-linked OTP gateway simulation</span>
        </div>
      </div>
    </div>
  );
}
