"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";
import { AuthInput } from "./LoginForm";

const ROLES = [
  { value: "", label: "Pilih Peran Anda" },
  { value: "pemerintah", label: "Instansi Pemerintah (BPK / Dinas Kebudayaan)" },
  { value: "swasta", label: "Lembaga Swasta / Yayasan Museum" },
  { value: "ahli", label: "Tenaga Ahli (Arsitek / Insinyur Konservasi)" },
];

export default function RegisterForm() {
  const [role, setRole] = useState("");

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-5">
        <AuthInput
          label="Nama Lengkap"
          type="text"
          placeholder="Arch. Hendrawan"
          icon={<User size={20} />}
        />
        <AuthInput
          label="Email Kerja"
          type="email"
          placeholder="nama@heritage.id"
          icon={<Mail size={20} />}
        />

        <div className="space-y-2">
          <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
            Peran / Institusi
          </label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
              <Briefcase size={20} />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none transition-all font-bold appearance-none text-gray-700"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value} disabled={r.value === ""}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AuthInput
          label="Kata Sandi"
          type="password"
          placeholder="Minimal 8 karakter"
          icon={<Lock size={20} />}
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
        <ShieldCheck className="text-primary shrink-0" size={20} />
        <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
          Dengan mendaftar, Anda menyetujui{" "}
          <span className="font-bold underline">Ketentuan Layanan</span> dan{" "}
          <span className="font-bold underline">Kebijakan Privasi</span> HeritageGuard.
        </p>
      </div>

      <button className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(38,75,221,0.3)] hover:bg-blue-700 transition-all active:scale-[0.98] group">
        <span>Buat Akun Gratis</span>
        <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      <div className="pt-6 border-t border-gray-50 text-center">
        <p className="text-gray-500 font-medium text-sm">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline inline-flex items-center gap-1 group"
          >
            Masuk di sini
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </p>
      </div>
    </form>
  );
}
