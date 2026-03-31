import Link from "next/link";
import Logo from "./Logo";

export default function TopNavbar() {
  return (
    <nav className="fixed top-0 w-full bg-base-100/90 backdrop-blur-md border-b border-base-300 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo size={44} />
        
        <div className="hidden md:flex gap-8 font-medium text-secondary">
          <a href="#fitur" className="hover:text-primary transition">Fitur</a>
          <a href="#solusi" className="hover:text-primary transition">Solusi</a>
          <a href="#klien" className="hover:text-primary transition">Klien</a>
        </div>

        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-5 py-2 font-semibold text-neutral border border-base-300 rounded-md hover:bg-base-200 transition"
          >
            Masuk
          </Link>
          <Link 
            href="/register"
            className="px-5 py-2 font-semibold text-white bg-primary rounded-md hover:bg-blue-700 transition shadow-md"
          >
            Daftar
          </Link>
        </div>
      </div>
    </nav>
  );
}