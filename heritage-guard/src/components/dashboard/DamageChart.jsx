"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function DamageChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { month: "Jan", crack: 0, spalling: 0, moisture: 0 },
    { month: "Feb", crack: 0, spalling: 0, moisture: 0 },
    { month: "Mar", crack: 0, spalling: 0, moisture: 0 },
    { month: "Apr", crack: 0, spalling: 0, moisture: 0 },
    { month: "Mei", crack: 0, spalling: 0, moisture: 0 },
    { month: "Jun", crack: 0, spalling: 0, moisture: 0 },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">Tren Deteksi Kerusakan</h3>
        <p className="text-xs text-gray-400 dark:text-dark-text-muted mt-1 font-medium">Histori deteksi per kategori (6 bulan terakhir)</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gCrack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gSpalling" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#eab308" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#eab308" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gMoisture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" className="dark:opacity-5" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #f3f4f6",
              fontSize: "12px",
              backgroundColor: "var(--bg-card, #fff)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
          <Area type="monotone" dataKey="crack"    name="Crack"    stroke="#ef4444" strokeWidth={2} fill="url(#gCrack)"    dot={false} />
          <Area type="monotone" dataKey="spalling" name="Spalling" stroke="#eab308" strokeWidth={2} fill="url(#gSpalling)" dot={false} />
          <Area type="monotone" dataKey="moisture" name="Moisture" stroke="#3b82f6" strokeWidth={2} fill="url(#gMoisture)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
