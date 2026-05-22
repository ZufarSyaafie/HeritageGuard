"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const MOCK_DATA = [
  { month: "Jan", crack: 8,  spalling: 4,  moisture: 6  },
  { month: "Feb", crack: 12, spalling: 7,  moisture: 9  },
  { month: "Mar", crack: 7,  spalling: 5,  moisture: 11 },
  { month: "Apr", crack: 15, spalling: 9,  moisture: 8  },
  { month: "Mei", crack: 10, spalling: 6,  moisture: 14 },
  { month: "Jun", crack: 18, spalling: 11, moisture: 10 },
];

export default function DamageChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Tren Deteksi Kerusakan</h3>
        <p className="text-xs text-gray-400 mt-1 font-medium">6 bulan terakhir — jumlah deteksi per kategori</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={MOCK_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #f3f4f6",
              fontSize: "12px",
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
