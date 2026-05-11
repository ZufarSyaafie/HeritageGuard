"use client";

import { useState, useMemo } from "react";
import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryFilters from "@/components/history/HistoryFilters";
import HistoryTable from "@/components/history/HistoryTable";
import HistoryPagination from "@/components/history/HistoryPagination";

const MOCK_HISTORY_DATA = [
  {
    id: "HG-2024-001",
    image: "https://images.unsplash.com/photo-1590050752117-23a9d7f26a83?q=80&w=100&auto=format&fit=crop",
    location: "Candi Borobudur",
    subLocation: "Sektor B - Relief Dasar",
    date: "12 Okt 2024",
    timestamp: new Date("2024-10-12").getTime(),
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  },
  {
    id: "HG-2024-002",
    image: "https://images.unsplash.com/photo-1624388481491-c423c713b5d2?q=80&w=100&auto=format&fit=crop",
    location: "Museum Fatahillah",
    subLocation: "Pilar Utama - Sayap Barat",
    date: "10 Okt 2024",
    timestamp: new Date("2024-10-10").getTime(),
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-003",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=100&auto=format&fit=crop",
    location: "Candi Prambanan",
    subLocation: "Pagar Luar - Area Parkir",
    date: "08 Okt 2024",
    timestamp: new Date("2024-10-08").getTime(),
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-004",
    image: "https://images.unsplash.com/photo-1579446210852-6693a778e351?q=80&w=100&auto=format&fit=crop",
    location: "Benteng Vredeburg",
    subLocation: "Dinding Selatan - Parit Utama",
    date: "05 Okt 2024",
    timestamp: new Date("2024-10-05").getTime(),
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-005",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=100&auto=format&fit=crop",
    location: "Candi Borobudur",
    subLocation: "Sektor C - Stupa Atas",
    date: "01 Okt 2024",
    timestamp: new Date("2024-10-01").getTime(),
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-006",
    image: "https://images.unsplash.com/photo-1624235115264-70967396a84d?q=80&w=100&auto=format&fit=crop",
    location: "Istana Merdeka",
    subLocation: "Halaman Utama",
    date: "28 Sep 2024",
    timestamp: new Date("2024-09-28").getTime(),
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  },
  {
    id: "HG-2024-007",
    image: "https://images.unsplash.com/photo-1565153205315-9988ccf76326?q=80&w=100&auto=format&fit=crop",
    location: "Lawang Sewu",
    subLocation: "Gedung B - Lantai 2",
    date: "25 Sep 2024",
    timestamp: new Date("2024-09-25").getTime(),
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-008",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=100&auto=format&fit=crop",
    location: "Candi Prambanan",
    subLocation: "Candi Siwa - Area Utara",
    date: "20 Sep 2024",
    timestamp: new Date("2024-09-20").getTime(),
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-009",
    image: "https://images.unsplash.com/photo-1590050752117-23a9d7f26a83?q=80&w=100&auto=format&fit=crop",
    location: "Candi Borobudur",
    subLocation: "Sektor A - Gerbang Masuk",
    date: "15 Sep 2024",
    timestamp: new Date("2024-09-15").getTime(),
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  },
  {
    id: "HG-2024-010",
    image: "https://images.unsplash.com/photo-1624388481491-c423c713b5d2?q=80&w=100&auto=format&fit=crop",
    location: "Museum Fatahillah",
    subLocation: "Ruang Sidang - Area Atas",
    date: "12 Sep 2024",
    timestamp: new Date("2024-09-12").getTime(),
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-011",
    image: "https://images.unsplash.com/photo-1579446210852-6693a778e351?q=80&w=100&auto=format&fit=crop",
    location: "Benteng Vredeburg",
    subLocation: "Dinding Utara",
    date: "10 Sep 2024",
    timestamp: new Date("2024-09-10").getTime(),
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-012",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=100&auto=format&fit=crop",
    location: "Lawang Sewu",
    subLocation: "Gedung A - Basement",
    date: "05 Sep 2024",
    timestamp: new Date("2024-09-05").getTime(),
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  },
  {
    id: "HG-2024-013",
    image: "https://images.unsplash.com/photo-1624235115264-70967396a84d?q=80&w=100&auto=format&fit=crop",
    location: "Museum Nasional",
    subLocation: "Ruang Emas",
    date: "01 Sep 2024",
    timestamp: new Date("2024-09-01").getTime(),
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-014",
    image: "https://images.unsplash.com/photo-1565153205315-9988ccf76326?q=80&w=100&auto=format&fit=crop",
    location: "Gedung Sate",
    subLocation: "Menara Utama",
    date: "28 Agu 2024",
    timestamp: new Date("2024-08-28").getTime(),
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-015",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=100&auto=format&fit=crop",
    location: "Candi Sewu",
    subLocation: "Candi Perwara",
    date: "25 Agu 2024",
    timestamp: new Date("2024-08-25").getTime(),
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  }
];

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    time: "Bulan Ini",
    status: "Semua Status",
    sort: "Terbaru"
  });

  const itemsPerPage = 10;
  
  // Logic Filtering dan Sorting
  const filteredData = useMemo(() => {
    let result = [...MOCK_HISTORY_DATA];

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
  }, [searchQuery, filters]);

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
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

    // Filter berdasarkan rentang tanggal jika ada
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
