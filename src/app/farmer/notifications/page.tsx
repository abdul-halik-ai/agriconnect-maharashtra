"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatDateTime } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  FileCheck,
  Truck,
  Wallet,
  Scale,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function NotificationsPage() {
  const { user, language, refreshNotifications } = useApp();
  const isMr = language === "mr";

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user.id]);

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, markAll: true }),
      });
      if (res.ok) {
        await loadNotifications();
        refreshNotifications();
      }
    } catch (e) {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "OFFER":
        return <FileCheck className="h-5 w-5 text-blue-600" />;
      case "DEAL_STAGE":
        return <Truck className="h-5 w-5 text-agri-600" />;
      case "PAYMENT":
        return <Wallet className="h-5 w-5 text-emerald-600" />;
      case "DISPUTE":
        return <Scale className="h-5 w-5 text-red-600" />;
      default:
        return <Sparkles className="h-5 w-5 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri-700">
            <Bell className="h-4 w-4" />
            <span>{isMr ? "महत्त्वाच्या सूचना व संदेश" : "Alerts & Notifications"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
            {isMr ? "सूचना केंद्र" : "Notification Center"}
          </h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition shadow-sm"
        >
          <CheckCheck className="h-4 w-4" />
          <span>{isMr ? "सर्व वाचल्या म्हणून खूण करा" : "Mark all as read"}</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200 text-stone-500">
          <RefreshCw className="h-8 w-8 text-agri-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-700">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-stone-500">
          <Bell className="h-10 w-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">No new notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                n.isRead
                  ? "bg-white border-stone-200 text-stone-700"
                  : "bg-agri-50/70 border-agri-200 text-stone-900 shadow-subtle"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono flex-shrink-0">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-2">
                  {n.message}
                </p>

                {n.link && (
                  <Link
                    href={n.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-agri-700 hover:text-agri-800"
                  >
                    <span>View details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
