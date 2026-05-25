"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck, Briefcase, Loader2 } from "lucide-react";
import { AuthInput } from "./LoginForm";
import { supabase } from "@/utils/supabase";

const ROLES = [
  { value: "", label: "Pilih Peran Anda" },
  { value: "pemerintah", label: "Instansi Pemerintah (BPK / Dinas Kebudayaan)" },
  { value: "swasta", label: "Lembaga Swasta / Yayasan Museum" },
  { value: "ahli", label: "Tenaga Ahli (Arsitek / Insinyur Konservasi)" },
];

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!role) {
      setError("Silakan pilih peran Anda.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });

      if (authError) throw authError;

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || "Gagal mendaftar dengan Google.");
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 py-10">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Pendaftaran Berhasil!</h2>
        <p className="text-gray-500">
          Silakan periksa email Anda untuk memverifikasi akun sebelum masuk ke dashboard.
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
        >
          Ke Halaman Masuk <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleRegister}>
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <AuthInput
          label="Nama Lengkap"
          type="text"
          placeholder="Arch. Hendrawan"
          icon={<User size={20} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <AuthInput
          label="Email Kerja"
          type="email"
          placeholder="nama@heritage.id"
          icon={<Mail size={20} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
              required
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
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

      <div className="space-y-3">
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(38,75,221,0.3)] hover:bg-blue-700 transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <span>Buat Akun Gratis</span>
              <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>

      </div>

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
