import { Eye, FileText } from 'lucide-react';

const historyData = [
  {
    id: "HG-2024-001",
    image: "https://images.unsplash.com/photo-1590050752117-23a9d7f26a83?q=80&w=100&auto=format&fit=crop",
    location: "Candi Borobudur",
    subLocation: "Sektor B - Relief Dasar",
    date: "12 Okt 2024",
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  },
  {
    id: "HG-2024-002",
    image: "https://images.unsplash.com/photo-1624388481491-c423c713b5d2?q=80&w=100&auto=format&fit=crop",
    location: "Museum Fatahillah",
    subLocation: "Pilar Utama - Sayap Barat",
    date: "10 Okt 2024",
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-003",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=100&auto=format&fit=crop",
    location: "Candi Prambanan",
    subLocation: "Pagar Luar - Area Parkir",
    date: "08 Okt 2024",
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-004",
    image: "https://images.unsplash.com/photo-1579446210852-6693a778e351?q=80&w=100&auto=format&fit=crop",
    location: "Benteng Vredeburg",
    subLocation: "Dinding Selatan - Parit Utama",
    date: "05 Okt 2024",
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  }
];

export default function HistoryTable() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">ID Inspeksi</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Citra</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Lokasi Aset</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tanggal</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Tingkat Kerusakan</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {historyData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <span className="text-sm font-extrabold text-primary tracking-tight">{row.id}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <img src={row.image} alt={row.location} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-tight mb-0.5">{row.location}</span>
                    <span className="text-[11px] text-gray-500 font-medium leading-none">{row.subLocation}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-gray-600 font-medium">{row.date}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border ${row.statusColor}`}>
                      • {row.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <ActionButton icon={<Eye size={18} />} title="Lihat Detail" />
                    <ActionButton icon={<FileText size={18} />} title="Unduh PDF" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({ icon, title }) {
  return (
    <button 
      className="p-2.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all outline-none"
      title={title}
    >
      {icon}
    </button>
  );
}
