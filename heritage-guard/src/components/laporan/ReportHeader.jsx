import Logo from "@/components/Logo";

function pad(n) { return String(n).padStart(2, "0"); }

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function ReportHeader({ assetMeta, reportId }) {
  const printDate = formatDate(new Date().toISOString());

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 print:rounded-none print:border-0 print:p-0">
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
        <Logo size={40} showText href="/" />
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. Laporan</p>
          <p className="text-sm font-black text-gray-900 mt-0.5">{reportId}</p>
          <p className="text-[11px] text-gray-400 mt-1">Dicetak: {printDate}</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">
          Dokumen Teknis Resmi
        </p>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          LAPORAN INSPEKSI TEKNIS
        </h1>
        <p className="text-sm text-gray-500 mt-1">Deteksi Kerusakan Cagar Budaya — HeritageGuard AI</p>
      </div>

      <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-xl overflow-hidden text-sm">
        {[
          ["Nama Bangunan",    assetMeta.buildingName || "-"],
          ["Lokasi",           assetMeta.location     || "-"],
          ["Tanggal Inspeksi", formatDate(assetMeta.inspectedAt)],
          ["Nama Inspektor",   "Arch. Hendrawan (mock)"],
        ].map(([label, value], i) => (
          <div
            key={label}
            className={`flex flex-col gap-1 p-4 ${i % 2 === 0 ? "bg-gray-50/60" : "bg-white"} border-b border-gray-100 last:border-0`}
          >
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="font-bold text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
