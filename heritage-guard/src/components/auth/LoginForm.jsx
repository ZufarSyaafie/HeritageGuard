"use client";

import Link from "next/link";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

export default function LoginForm() {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-5">
        <AuthInput 
          label="Email Kerja" 
          type="email" 
          placeholder="nama@gmail.com" 
          icon={<Mail size={20} />} 
        />
        <AuthInput 
          label="Kata Sandi" 
          type="password" 
          placeholder="••••••••" 
          icon={<Lock size={20} />} 
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
          <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">Ingat saya</span>
        </label>
        <Link href="#" className="text-sm font-bold text-primary hover:underline">Lupa sandi?</Link>
      </div>

      <button className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(38,75,221,0.3)] hover:bg-blue-700 transition-all active:scale-[0.98] group">
        <span>Masuk ke Dashboard</span>
        <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="pt-6 border-t border-gray-50 text-center">
        <p className="text-gray-500 font-medium text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline inline-flex items-center gap-1 group">
            Daftar sekarang
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </p>
      </div>
    </form>
  );
}

export function AuthInput({ label, type, placeholder, icon }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input 
          type={type} 
          placeholder={placeholder} 
          className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none transition-all font-bold placeholder:font-medium placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}
