import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryFilters from "@/components/history/HistoryFilters";
import HistoryTable from "@/components/history/HistoryTable";
import HistoryPagination from "@/components/history/HistoryPagination";

export const metadata = {
  title: "Histori Inspeksi | HeritageGuard",
  description: "Daftar riwayat pemantauan dan hasil deteksi kerusakan aset cagar budaya",
};

export default function HistoryPage() {
  return (
    <main className="pb-20">
      {/* Header with Title and Export Button */}
      <HistoryHeader />
      
      {/* Filters Section */}
      <HistoryFilters />
      
      {/* Data Table */}
      <HistoryTable />
      
      {/* Pagination and Entries Info */}
      <HistoryPagination />
    </main>
  );
}
