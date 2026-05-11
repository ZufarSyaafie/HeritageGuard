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
    <div className="flex items-center gap-4 mb-6 print:hidden">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
      >
        <Printer size={18} />
        Cetak / Ekspor PDF
      </button>
      <button
        onClick={handleNewScan}
        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
      >
        <RotateCcw size={18} />
        Scan Baru
      </button>
    </div>
  );
}
