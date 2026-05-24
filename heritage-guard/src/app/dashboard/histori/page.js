"use client";

import { useState, useMemo, useEffect } from "react";
import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryFilters from "@/components/history/HistoryFilters";
import HistoryTable from "@/components/history/HistoryTable";
import HistoryPagination from "@/components/history/HistoryPagination";
import { supabase } from "@/utils/supabase";
import { Loader2 } from "lucide-react";

const getStatusInfo = (score) => {
  if (score >= 80) return { label: "AMAN", color: "text-green-600 bg-green-50 border-green-100" };
  if (score >= 50) return { label: "MENENGAH", color: "text-orange-600 bg-orange-50 border-orange-100" };
  return { label: "KRITIS", color: "text-red-600 bg-red-50 border-red-100" };
};

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    time: "Semua Waktu",
    status: "Semua Status",
    sort: "Terbaru"
  });

  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("Sesi berakhir. Silakan masuk kembali.");
          setLoading(false);
          return;
        }

        const response = await fetch('/api/history', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Gagal mengambil data histori");
        }

        const transformed = result.data.map(item => {
          const statusInfo = getStatusInfo(item.overall_health_score);
          const rowData = {
            id: `HG-${new Date(item.inspection_date).getFullYear()}-${item.id.slice(0, 4).toUpperCase()}`,
            realId: item.id,
            image: item.image_url || "/next.svg",
            location: item.ASSETS?.name || "Unknown Asset",
            subLocation: item.ASSETS?.location || "Unknown Location",
            date: new Date(item.inspection_date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
            timestamp: new Date(item.inspection_date).getTime(),
            status: statusInfo.label,
            statusColor: statusInfo.color,
            reportUrl: item.report_url
          };
          return rowData;
        });

        setData(transformed);
      } catch (err) {
        console.error("Fetch history error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);
  
  // Logic Filtering dan Sorting
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.id.toLowerCase().includes(query) || 
        item.location.toLowerCase().includes(query) ||
        item.subLocation.toLowerCase().includes(query)
      );
    }

    if (filters.status !== "Semua Status") {
      result = result.filter(item => item.status === filters.status.toUpperCase());
    }

    // Time filtering logic (simplified for now)
    if (filters.time !== "Semua Waktu") {
      const now = new Date();
      let startTime = 0;
      
      if (filters.time === "Hari Ini") {
        startTime = new Date(now.setHours(0,0,0,0)).getTime();
      } else if (filters.time === "Minggu Ini") {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startTime = lastWeek.getTime();
      } else if (filters.time === "Bulan Ini") {
        startTime = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      } else if (filters.time === "Tahun Ini") {
        startTime = new Date(now.getFullYear(), 0, 1).getTime();
      }
      
      result = result.filter(item => item.timestamp >= startTime);
    }

    if (filters.sort === "Terbaru") {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (filters.sort === "Terlama") {
      result.sort((a, b) => a.timestamp - b.timestamp);
    } else if (filters.sort === "Lokasi A-Z") {
      result.sort((a, b) => a.location.localeCompare(b.location));
    } else if (filters.sort === "Lokasi Z-A") {
      result.sort((a, b) => b.location.localeCompare(a.location));
    }

    return result;
  }, [data, searchQuery, filters]);

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleExportCSV = (startDate, endDate) => {
    let dataToExport = [...filteredData];

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      
      dataToExport = dataToExport.filter(item => {
        const itemTime = item.timestamp;
        return itemTime >= start && itemTime <= end;
      });
    }

    if (dataToExport.length === 0) {
      alert("Tidak ada data dalam rentang waktu tersebut untuk diekspor!");
      return;
    }

    const headers = ["ID Inspeksi", "Lokasi", "Sub-Lokasi", "Tanggal", "Tingkat Kerusakan"];
    const rows = dataToExport.map(item => [
      item.id,
      item.location,
      item.subLocation,
      item.date,
      item.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const fileName = (startDate && endDate) 
      ? `Laporan_Histori_${startDate}_s.d_${endDate}.csv`
      : `Laporan_Histori_Seluruhnya_${new Date().toLocaleDateString('id-ID')}.csv`;

    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Memuat data histori...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 max-w-md">
          <p className="font-bold mb-1">Terjadi Kesalahan</p>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <main className="pb-20">
      <HistoryHeader onExport={handleExportCSV} />
      <HistoryFilters 
        onFilterChange={handleFilterChange} 
        onSearchChange={handleSearchChange} 
      />
      <HistoryTable data={currentData} />
      <HistoryPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={totalEntries}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
