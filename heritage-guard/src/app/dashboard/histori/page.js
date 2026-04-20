"use client";

import { useState } from "react";
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
  },
  {
    id: "HG-2024-005",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=100&auto=format&fit=crop",
    location: "Candi Borobudur",
    subLocation: "Sektor C - Stupa Atas",
    date: "01 Okt 2024",
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-006",
    image: "https://images.unsplash.com/photo-1624235115264-70967396a84d?q=80&w=100&auto=format&fit=crop",
    location: "Istana Merdeka",
    subLocation: "Halaman Utama",
    date: "28 Sep 2024",
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  },
  {
    id: "HG-2024-007",
    image: "https://images.unsplash.com/photo-1565153205315-9988ccf76326?q=80&w=100&auto=format&fit=crop",
    location: "Lawang Sewu",
    subLocation: "Gedung B - Lantai 2",
    date: "25 Sep 2024",
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-008",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=100&auto=format&fit=crop",
    location: "Candi Prambanan",
    subLocation: "Candi Siwa - Area Utara",
    date: "20 Sep 2024",
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-009",
    image: "https://images.unsplash.com/photo-1590050752117-23a9d7f26a83?q=80&w=100&auto=format&fit=crop",
    location: "Candi Borobudur",
    subLocation: "Sektor A - Gerbang Masuk",
    date: "15 Sep 2024",
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  },
  {
    id: "HG-2024-010",
    image: "https://images.unsplash.com/photo-1624388481491-c423c713b5d2?q=80&w=100&auto=format&fit=crop",
    location: "Museum Fatahillah",
    subLocation: "Ruang Sidang - Area Atas",
    date: "12 Sep 2024",
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-011",
    image: "https://images.unsplash.com/photo-1579446210852-6693a778e351?q=80&w=100&auto=format&fit=crop",
    location: "Benteng Vredeburg",
    subLocation: "Dinding Utara",
    date: "10 Sep 2024",
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-012",
    id: "HG-2024-012",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=100&auto=format&fit=crop",
    location: "Lawang Sewu",
    subLocation: "Gedung A - Basement",
    date: "05 Sep 2024",
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  },
  {
    id: "HG-2024-013",
    image: "https://images.unsplash.com/photo-1624235115264-70967396a84d?q=80&w=100&auto=format&fit=crop",
    location: "Museum Nasional",
    subLocation: "Ruang Emas",
    date: "01 Sep 2024",
    status: "MENENGAH",
    statusColor: "text-orange-600 bg-orange-50 border-orange-100"
  },
  {
    id: "HG-2024-014",
    image: "https://images.unsplash.com/photo-1565153205315-9988ccf76326?q=80&w=100&auto=format&fit=crop",
    location: "Gedung Sate",
    subLocation: "Menara Utama",
    date: "28 Agu 2024",
    status: "AMAN",
    statusColor: "text-green-600 bg-green-50 border-green-100"
  },
  {
    id: "HG-2024-015",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=100&auto=format&fit=crop",
    location: "Candi Sewu",
    subLocation: "Candi Perwara",
    date: "25 Agu 2024",
    status: "KRITIS",
    statusColor: "text-red-600 bg-red-50 border-red-100"
  }
];

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalEntries = MOCK_HISTORY_DATA.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = MOCK_HISTORY_DATA.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: Scroll to top of table
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="pb-20">
      <HistoryHeader />
      <HistoryFilters />
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
