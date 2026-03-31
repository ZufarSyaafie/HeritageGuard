import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    
    <>
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] font-sans text-[#1a1c1c]">
    {/* Mini Navbar */}
    <nav className="p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto w-full">
      <Logo size={48} href="/" />
      
      <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft size={18} />
        <span>Kembali ke Beranda</span>
      </Link>
    </nav>

    {/* Main Content */}
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-[#1a1c1c]">{title}</h1>
          <p className="text-gray-500 font-medium text-lg">{subtitle}</p>
        </div>
        
        <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          {children}
        </div>
      </div>
    </main>

    {/* Footer */}
  </div>
  <Footer />
  </>
    
  );
}
