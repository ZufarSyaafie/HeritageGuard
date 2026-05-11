// src/components/DashboardLayout.jsx
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-white text-gray-900 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        {/* Background area konten kita buat sedikit berbeda agar kontras */}
        <main className="flex-1 p-10 bg-gray-50/50 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}