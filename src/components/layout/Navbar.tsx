"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp, DEMO_USERS } from "@/context/AppContext";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Globe,
  Layers,
  ShieldCheck,
  Sprout,
  UserCheck,
  Building2,
  Briefcase,
  SlidersHorizontal,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchDemoRole, language, setLanguage, t, unreadCount } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleRoleSelect = (role: "FARMER" | "FPO" | "BUYER" | "ADMIN") => {
    switchDemoRole(role);
    setRoleDropdownOpen(false);
    if (role === "FARMER") router.push("/farmer/prices");
    else if (role === "FPO") router.push("/fpo/dashboard");
    else if (role === "BUYER") router.push("/buyer/demand");
    else if (role === "ADMIN") router.push("/admin/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Tricolor Government Ribbon */}
      <div className="govt-ribbon" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md shadow-agri-600/20 group-hover:bg-agri-700 transition">
                <Sprout className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg text-stone-900 leading-tight">
                    AgriConnect
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    MH
                  </span>
                </div>
                <span className="text-[11px] font-medium text-stone-500 leading-none">
                  {language === "mr" ? "महाराष्ट्र शासन • बाजार जोडणी मंच" : "Govt. of Maharashtra Agri Market Platform"}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links (Contextual to role) */}
          <nav className="hidden md:flex items-center gap-1">
            {user.role === "FARMER" && (
              <>
                <Link
                  href="/farmer/prices"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/farmer/prices")
                      ? "bg-agri-50 text-agri-700 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {t.nav.prices}
                </Link>
                <Link
                  href="/farmer/lots"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/farmer/lots")
                      ? "bg-agri-50 text-agri-700 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {t.nav.myLots}
                </Link>
                <Link
                  href="/farmer/deals"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/farmer/deals")
                      ? "bg-agri-50 text-agri-700 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {t.nav.deals}
                </Link>
                <Link
                  href="/farmer/logistics"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/farmer/logistics")
                      ? "bg-agri-50 text-agri-700 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {t.nav.logistics}
                </Link>
              </>
            )}

            {user.role === "FPO" && (
              <>
                <Link
                  href="/fpo/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname === "/fpo/dashboard"
                      ? "bg-agri-50 text-agri-700 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  FPO Dashboard
                </Link>
                <Link
                  href="/fpo/lots/aggregate"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.includes("/aggregate")
                      ? "bg-agri-50 text-agri-700 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Pool Lots (संकलन)
                </Link>
                <Link
                  href="/fpo/payouts"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.includes("/payouts")
                      ? "bg-agri-50 text-agri-700 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Farmer Payouts
                </Link>
                <Link
                  href="/buyer/demand"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
                >
                  Buyer Demands
                </Link>
              </>
            )}

            {user.role === "BUYER" && (
              <>
                <Link
                  href="/buyer/demand"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/buyer/demand")
                      ? "bg-stone-100 text-stone-900 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Demand Board
                </Link>
                <Link
                  href="/buyer/browse-lots"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/buyer/browse-lots")
                      ? "bg-stone-100 text-stone-900 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Browse Lots
                </Link>
                <Link
                  href="/buyer/deals"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/buyer/deals")
                      ? "bg-stone-100 text-stone-900 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Active Deals
                </Link>
              </>
            )}

            {user.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname === "/admin/dashboard"
                      ? "bg-stone-900 text-white font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  State Overview
                </Link>
                <Link
                  href="/admin/kyc"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/admin/kyc")
                      ? "bg-stone-900 text-white font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Buyer KYC Queue
                </Link>
                <Link
                  href="/admin/disputes"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith("/admin/disputes")
                      ? "bg-stone-900 text-white font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  Disputes Center
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "mr" : "en")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
              title="Change Language / भाषा बदला"
            >
              <Globe className="h-3.5 w-3.5 text-stone-500" />
              <span>{language === "en" ? "मराठी" : "English"}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <Link
                href={user.role === "FARMER" ? "/farmer/notifications" : "/admin/disputes"}
                className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition block"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Fast Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 transition shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-stone-900 flex items-center gap-1">
                    {user.name.split(" ")[0]}
                    <span className="text-[10px] px-1 rounded bg-stone-200 text-stone-700 font-mono uppercase">
                      {user.role}
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Demo Role Switcher
                    </div>
                    <div className="text-xs text-stone-500">
                      Switch personas to test all four user experiences
                    </div>
                  </div>

                  <div className="p-1 space-y-1">
                    {DEMO_USERS.map((demo) => {
                      const isActive = demo.id === user.id;
                      return (
                        <button
                          key={demo.id}
                          onClick={() => handleRoleSelect(demo.role)}
                          className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition ${
                            isActive
                              ? "bg-agri-50 border border-agri-200 text-agri-900"
                              : "hover:bg-stone-100 text-stone-700"
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                              demo.role === "FARMER"
                                ? "bg-emerald-100 text-emerald-800"
                                : demo.role === "FPO"
                                ? "bg-amber-100 text-amber-800"
                                : demo.role === "BUYER"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {demo.role === "FARMER" ? "F" : demo.role === "FPO" ? "P" : demo.role === "BUYER" ? "B" : "A"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-stone-900 truncate">
                              {demo.name}
                            </div>
                            <div className="text-[11px] text-stone-500 truncate">
                              {demo.titleBadge}
                            </div>
                          </div>
                          {isActive && <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 py-2 border-t border-stone-100 bg-stone-50 rounded-b-2xl text-[11px] text-stone-500 text-center">
                    Simulates verified Maharashtra APMC credentials
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
