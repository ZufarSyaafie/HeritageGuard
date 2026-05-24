"use client";

import { Zap, ShieldCheck, ClipboardList } from 'lucide-react';

export default function ActionCards() {
  const cards = [
    {
      title: "Tindakan Mendesak",
      description: "Injeksi epoxy diperlukan pada retakan vertikal pilar dalam kurun waktu 48 jam untuk mencegah degradasi lebih lanjut.",
      icon: Zap,
      color: "bg-orange-50 dark:bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      title: "Verifikasi Ahli",
      description: "Sistem merekomendasikan peninjauan ulang oleh insinyur sipil spesialis struktur kuno untuk pilar sektor B.",
      icon: ShieldCheck,
      color: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Log Pemeliharaan",
      description: "Terakhir kali dilakukan perawatan preventif pada pilar ini adalah 24 bulan yang lalu (Okt 2022).",
      icon: ClipboardList,
      color: "bg-slate-50 dark:bg-slate-500/10",
      iconColor: "text-slate-500 dark:text-slate-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
      {cards.map((card) => (
        <div key={card.title} className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-8 flex flex-col gap-5 hover:shadow-md dark:hover:shadow-primary/5 transition-all">
          <div className={`w-12 h-12 ${card.color} ${card.iconColor} rounded-xl flex items-center justify-center`}>
            <card.icon size={24} />
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-gray-900 dark:text-dark-text">{card.title}</h4>
            <p className="text-sm text-gray-500 dark:text-dark-text-muted leading-relaxed">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
