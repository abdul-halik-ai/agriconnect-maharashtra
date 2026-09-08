"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Search,
  Handshake,
  ShieldCheck,
  Truck,
  Building2,
  FileCheck,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export function BuyerSidebar() {
  const pathname = usePathname();
  const { user } = useApp();

  const sections = [
    {
      title: "PROCUREMENT & SOURCING",
      items: [
        {
          href: "/buyer/demand",
          label: "Demand Board",
          icon: ClipboardList,
          badge: "Active Demands",
        },
        {
          href: "/buyer/demand/new",
          label: "Post New Demand",
          icon: FileCheck,
        },
        {
          href: "/buyer/browse-lots",
          label: "Browse Verified Lots",
          icon: Search,
          badge: "Passports Ready",
        },
      ],
    },
    {
      title: "TRANSACTIONS & SETTLEMENT",
      items: [
        {
          href: "/buyer/deals",
          label: "Active Deals Pipeline",
          icon: Handshake,
        },
        {
          href: "/farmer/logistics",
          label: "Logistics & Transport",
          icon: Truck,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block border-r border-stone-200 bg-stone-50/50 min-h-[calc(100vh-4rem)] p-4">
      {/* Buyer profile badge */}
      <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-bold text-stone-900 truncate">
            {user.name}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="h-3 w-3" /> APMC Verified
          </span>
          <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-mono">
            ★ 4.9 Rating
          </span>
        </div>
      </div>

      <nav className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="text-[10px] font-bold text-stone-400 tracking-wider mb-2 px-2">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-white text-stone-950 font-semibold shadow-subtle border border-stone-200"
                        : "text-stone-600 hover:text-stone-950 hover:bg-stone-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-stone-500" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-8 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
        <div className="font-semibold mb-1 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-700" /> State Escrow Protected
        </div>
        <p className="text-blue-700/90 leading-relaxed">
          Buyer payments remain securely held in Apex escrow until digital quality sign-off.
        </p>
      </div>
    </aside>
  );
}
