import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount?: number | null): string {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatQuintals(qtl?: number | null): string {
  if (typeof qtl !== "number" || isNaN(qtl)) return "0 Qtl (0 MT)";
  return `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(qtl)} Qtl (${(qtl / 10).toFixed(1)} MT)`;
}

export function formatDate(date?: Date | string | null): string {
  if (!date) return "Recently";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return "Recently";
    return format(d, "dd MMM yyyy");
  } catch {
    return "Recently";
  }
}

export function formatDateTime(date?: Date | string | null): string {
  if (!date) return "Recently";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return "Recently";
    return format(d, "dd MMM yyyy, hh:mm a");
  } catch {
    return "Recently";
  }
}
