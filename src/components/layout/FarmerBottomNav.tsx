"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { TrendingUp, PackageCheck, Handshake, Bell, User } from "lucide-react";

export function FarmerBottomNav() {
  const pathname = usePathname();
  const { language, unreadCount } = useApp();

  const isMr = language === "mr";

  const navItems = [
    {
      href: "/farmer/prices",
      label: isMr ? "बाजार भाव" : "Prices",
      subLabel: isMr ? "दर व सल्ला" : "Rates & Adv.",
      icon: TrendingUp,
      activePattern: /^\/farmer\/prices/,
    },
    {
      href: "/farmer/lots",
      label: isMr ? "माझा माल" : "My Lots",
      subLabel: isMr ? "पासपोर्ट" : "Passports",
      icon: PackageCheck,
      activePattern: /^\/farmer\/lots/,
    },
    {
      href: "/farmer/deals",
      label: isMr ? "सौदे व ट्रॅकिंग" : "Deals",
      subLabel: isMr ? "व्यवहार" : "Live Deals",
      icon: Handshake,
      activePattern: /^\/farmer\/deals/,
    },
    {
      href: "/farmer/notifications",
      label: isMr ? "सूचना" : "Alerts",
      subLabel: isMr ? "संदेश" : "Updates",
      icon: Bell,
      badge: unreadCount,
      activePattern: /^\/farmer\/notifications/,
    },
    {
      href: "/farmer/profile",
      label: isMr ? "खाते" : "Profile",
      subLabel: isMr ? "माहिती" : "Account",
      icon: User,
      activePattern: /^\/farmer\/profile/,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg md:hidden">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const isActive = item.activePattern.test(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center relative py-1 px-1 transition-all duration-150 ${
                isActive
                  ? "text-agri-700 font-semibold"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] mt-0.5 leading-tight text-center truncate w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
