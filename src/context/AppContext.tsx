"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/i18n";

export interface CurrentUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "FARMER" | "FPO" | "BUYER" | "ADMIN";
  district: string;
  titleBadge: string;
}

export const DEMO_USERS: CurrentUser[] = [
  {
    id: "u_farmer_ramesh",
    name: "Ramesh Patil",
    phone: "9822012345",
    email: "ramesh.patil@kisan.in",
    role: "FARMER",
    district: "Nashik (Niphad)",
    titleBadge: "Smallholder Farmer (4.5 Acres)",
  },
  {
    id: "u_fpo_sahyadri",
    name: "Prakash Deshmukh",
    phone: "9822022222",
    email: "admin@sahyadrifpo.org",
    role: "FPO",
    district: "Nashik (Dindori)",
    titleBadge: "Sahyadri FPO Admin (480 Members)",
  },
  {
    id: "u_buyer_itc",
    name: "Vikram Singhania",
    phone: "9822033333",
    email: "vikram@itcagri.com",
    role: "BUYER",
    district: "Pune / Nashik",
    titleBadge: "ITC Agri Business (Verified Buyer)",
  },
  {
    id: "u_admin_msis",
    name: "Sunita Kulkarni",
    phone: "9822044444",
    email: "admin@msis.gov.in",
    role: "ADMIN",
    district: "Mumbai HQ",
    titleBadge: "MSIS / MSAMB State Officer",
  },
];

interface AppContextType {
  user: CurrentUser;
  setUser: (u: CurrentUser) => void;
  switchDemoRole: (role: "FARMER" | "FPO" | "BUYER" | "ADMIN") => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  refreshNotifications: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser>(DEMO_USERS[0]);
  const [language, setLanguage] = useState<Language>("en");
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore user selection or language from localStorage if present
  useEffect(() => {
    try {
      const savedRoleId = localStorage.getItem("agriconnect_role_id");
      if (savedRoleId) {
        const found = DEMO_USERS.find((u) => u.id === savedRoleId);
        if (found) setUser(found);
      }
      const savedLang = localStorage.getItem("agriconnect_lang") as Language;
      if (savedLang === "mr" || savedLang === "en") {
        setLanguage(savedLang);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const switchDemoRole = (role: "FARMER" | "FPO" | "BUYER" | "ADMIN") => {
    const target = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setUser(target);
    try {
      localStorage.setItem("agriconnect_role_id", target.id);
    } catch (e) {}
    showToast(`Switched active view to: ${target.name} (${target.role})`);
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem("agriconnect_lang", lang);
    } catch (e) {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    refreshNotifications();
  }, [user.id]);

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        switchDemoRole,
        language,
        setLanguage: handleSetLanguage,
        t,
        unreadCount,
        setUnreadCount,
        refreshNotifications,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-3 bg-stone-900 text-stone-100 px-4 py-3 rounded-xl shadow-2xl border border-stone-700 text-sm font-medium animate-bounce">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          {toastMessage}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
