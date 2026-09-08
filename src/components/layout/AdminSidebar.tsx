"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  UserCheck2,
  TrendingUp,
  FileSpreadsheet,
  Building,
  Scale,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useApp();

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Platform Analytics",
      icon: LayoutDashboard,
      badge: "Live Telemetry",
    },
    {
      href: "/admin/kyc",
      label: "Buyer KYC Approvals",
      icon: UserCheck2,
      badge: "1 Pending",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      href: "/admin/disputes",
      label: "Dispute Arbitration",
      icon: Scale,
      badge: "1 Open",
      badgeColor: "bg-red-100 text-red-800",
    },
    {
      href: "/farmer/prices",
      label: "Mandi Price Ingestion",
      icon: TrendingUp,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block border-r border-stone-200 bg-stone-900 text-stone-200 min-h-[calc(100vh-4rem)] p-4">
      {/* Officer Credential Badge */}
      <div className="p-3 bg-stone-800/90 rounded-xl border border-stone-700 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            MSIS State Oversight
          </span>
        </div>
        <div className="text-[11px] text-stone-400 font-medium">
          {user.name}
        </div>
        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
          Maharashtra Innovation Society
        </div>
      </div>

      <div className="text-[10px] font-bold text-stone-400 tracking-wider mb-2 px-2 uppercase">
        Regulatory Management
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? "bg-stone-800 text-white font-semibold border-l-2 border-emerald-400"
                  : "text-stone-400 hover:text-white hover:bg-stone-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-stone-400" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    item.badgeColor || "bg-stone-800 text-stone-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-12 p-3 bg-stone-800/40 rounded-xl border border-stone-700/60 text-[11px] text-stone-400 leading-relaxed">
        <span className="font-semibold text-stone-200 block mb-1">
          Dispute Resolution SLA
        </span>
        State arbitration window is active within 24 hours. Decisions directly release or refund escrow balances.
      </div>
    </aside>
  );
}
