"use client";

import { Printer, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import useScanStore from "@/store/useScanStore";

export default function ReportActions() {
  const router = useRouter();
  const resetScan = useScanStore((s) => s.resetScan);

  const handleNewScan = () => {
    resetScan();
    router.push("/dashboard/upload");
  };

  return (
    <div className="flex items-center gap-4 mb-6 print:hidden transition-colors">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none"
      >
        <Printer size={18} />
        Cetak / Ekspor PDF
      </button>
      <button
        onClick={handleNewScan}
        className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-dark-text rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-dark-card transition-all active:scale-95"
      >
        <RotateCcw size={18} />
        Scan Baru
      </button>
    </div>
  );
}
