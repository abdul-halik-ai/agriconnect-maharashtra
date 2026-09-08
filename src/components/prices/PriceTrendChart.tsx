"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatINR } from "@/lib/utils";
import { TrendingUp, BarChart2 } from "lucide-react";

interface PriceTrendChartProps {
  data: Array<{
    date: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
    arrivalVolume: number;
  }>;
  commodityName: string;
  marketName: string;
  onDaysChange?: (days: number) => void;
  selectedDays?: number;
}

export function PriceTrendChart({
  data,
  commodityName,
  marketName,
  onDaysChange,
  selectedDays = 30,
}: PriceTrendChartProps) {
  const [showVolume, setShowVolume] = useState(true);

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500">
        <TrendingUp className="h-8 w-8 text-stone-400 mb-2" />
        <p className="text-sm font-medium">No historical price records available</p>
      </div>
    );
  }

  // Format date display for chart axis (e.g. "12 Aug")
  const formattedData = data.map((d) => {
    const parts = d.date.split("-");
    const label = `${parts[2]}/${parts[1]}`;
    return {
      ...d,
      shortDate: label,
    };
  });

  const minVal = Math.min(...data.map((d) => d.minPrice));
  const maxVal = Math.max(...data.map((d) => d.maxPrice));
  const yDomainMin = Math.max(0, Math.floor((minVal * 0.95) / 100) * 100);
  const yDomainMax = Math.ceil((maxVal * 1.05) / 100) * 100;

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-agri-600" />
            <span>Mandi Price Trends & Arrival Volumes</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {commodityName} at {marketName} APMC
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Day range pills */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => onDaysChange && onDaysChange(days)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedDays === days
                    ? "bg-white text-stone-900 shadow-sm font-bold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {days}D
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition ${
              showVolume
                ? "bg-agri-50 border-agri-200 text-agri-800"
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
            title="Toggle arrival volumes"
          >
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Arrivals</span>
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f0eb" />
            <XAxis
              dataKey="shortDate"
              tickLine={false}
              axisLine={{ stroke: "#e7e5e4" }}
              tick={{ fontSize: 11, fill: "#78716c" }}
            />
            <YAxis
              yAxisId="price"
              domain={[yDomainMin, yDomainMax]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#78716c" }}
              tickFormatter={(val) => `₹${val}`}
            />
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={false}
              />
            )}
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const curr = payload[0].payload;
                  return (
                    <div className="bg-stone-900 text-white text-xs p-3 rounded-xl shadow-xl border border-stone-700 space-y-1">
                      <div className="font-bold text-stone-300 border-b border-stone-700 pb-1">
                        Date: {curr.date}
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-emerald-400 font-semibold">Modal Price:</span>
                        <span className="font-mono">{formatINR(curr.modalPrice)}/qtl</span>
                      </div>
                      <div className="flex justify-between gap-4 text-stone-400">
                        <span>Range:</span>
                        <span className="font-mono">
                          {formatINR(curr.minPrice)} - {formatINR(curr.maxPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 text-stone-400">
                        <span>Arrival Volume:</span>
                        <span className="font-mono">{curr.arrivalVolume.toLocaleString()} Qtl</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: -10 }}
            />
            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="arrivalVolume"
                name="Daily Arrivals (Qtl)"
                fill="#e7e5e4"
                radius={[4, 4, 0, 0]}
                opacity={0.7}
              />
            )}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="modalPrice"
              name="Modal Price (₹/qtl)"
              stroke="#15803d"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#15803d" }}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="maxPrice"
              name="Max Price"
              stroke="#86efac"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="minPrice"
              name="Min Price"
              stroke="#fca5a5"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-3 border-t border-stone-100 mt-2">
        <span>Verified Maharashtra State Agricultural Marketing Board (MSAMB) daily data feed</span>
        <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          Last Synced: Today
        </span>
      </div>
    </div>
  );
}
