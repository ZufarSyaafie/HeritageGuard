"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Gagal masuk. Periksa kembali email dan sandi Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || "Gagal masuk dengan Google.");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
          {error}
        </div>
      )}
      
      <div className="space-y-5">
        <AuthInput 
          label="Email Kerja" 
          type="email" 
          placeholder="nama@gmail.com" 
          icon={<Mail size={20} />} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput 
          label="Kata Sandi" 
          type="password" 
          placeholder="••••••••" 
          icon={<Lock size={20} />} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
          <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">Ingat saya</span>
        </label>
        <Link href="#" className="text-sm font-bold text-primary hover:underline">Lupa sandi?</Link>
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
              <span>Masuk ke Dashboard</span>
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-200 text-gray-600 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span>Masuk dengan Google</span>
        </button>
      </div>

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

export function AuthInput({ label, type, placeholder, icon, value, onChange, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input 
          {...props}
          type={type} 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
          className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none transition-all font-bold placeholder:font-medium placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}
