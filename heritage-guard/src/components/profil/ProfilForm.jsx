"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase";

const ROLES = [
  { value: "pemerintah", label: "Instansi Pemerintah (BPK / Dinas Kebudayaan)" },
  { value: "swasta",     label: "Lembaga Swasta / Yayasan Museum"              },
  { value: "ahli",       label: "Tenaga Ahli (Arsitek / Insinyur Konservasi)"  },
];

const inputCls =
  "w-full bg-gray-50 dark:bg-dark-bg border border-transparent dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-gray-200 dark:focus:border-primary focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-primary/10 rounded-xl py-3.5 px-4 text-sm outline-none transition-all font-semibold disabled:opacity-60 dark:text-dark-text";

function FormField({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}

export default function ProfilForm({ initialUser }) {
  const [form, setForm] = useState({
    name:      initialUser?.user_metadata?.full_name || "",
    email:     initialUser?.email || "",
    institusi: initialUser?.user_metadata?.institusi || "",
    role:      initialUser?.user_metadata?.role || "ahli",
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");

  const isOAuth = initialUser?.app_metadata?.provider !== 'email' && initialUser?.app_metadata?.provider !== undefined;

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: form.name,
          institusi: form.institusi
        }
      });

      if (updateError) throw updateError;

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwords.next.length < 8)                    { setPwError("Kata sandi baru minimal 8 karakter."); return; }
    if (passwords.next !== passwords.confirm)          { setPwError("Konfirmasi kata sandi tidak cocok."); return; }
    
    setLoading(true);
    setPwError("");
    try {
      const { error: pwUpdateError } = await supabase.auth.updateUser({
        password: passwords.next
      });

      if (pwUpdateError) throw pwUpdateError;

      setPasswords({ current: "", next: "", confirm: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setPwError(err.message || "Gagal memperbarui kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 transition-colors">
      {/* Profile Info */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Informasi Akun</h3>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <FormField label="Nama Lengkap">
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </FormField>
        <FormField label="Email (Tidak dapat diubah)">
          <input
            className={inputCls}
            type="email"
            value={form.email}
            disabled
          />
        </FormField>
        <FormField label="Institusi">
          <input
            className={inputCls}
            value={form.institusi}
            onChange={(e) => setForm({ ...form, institusi: e.target.value })}
            placeholder="Contoh: Balai Pelestarian Kebudayaan"
          />
        </FormField>
        <FormField label="Peran">
          <input
            className={`${inputCls} cursor-not-allowed`}
            value={ROLES.find(r => r.value === form.role)?.label || form.role}
            disabled
          />
        </FormField>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Simpan Perubahan
          </button>
          {saved && (
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              Tersimpan!
            </div>
          )}
        </div>
      </div>

      {/* Change Password - Only for Email Login */}
      {!isOAuth ? (
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Ubah Kata Sandi</h3>

          <FormField label="Kata Sandi Baru">
            <input
              className={inputCls}
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            />
          </FormField>
          <FormField label="Konfirmasi Kata Sandi Baru">
            <input
              className={inputCls}
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </FormField>

          {pwError && <p className="text-sm text-red-500 font-medium">{pwError}</p>}

          <button
            onClick={handlePasswordSave}
            disabled={loading}
            className="px-6 py-3 bg-gray-900 dark:bg-dark-bg text-white rounded-xl font-bold hover:bg-gray-700 dark:hover:bg-dark-card transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Perbarui Kata Sandi
          </button>
        </div>
      ) : (
        <div className="bg-blue-50/50 dark:bg-primary/5 rounded-xl border border-blue-100/50 dark:border-primary/20 p-6">
          <p className="text-sm text-primary/80 dark:text-primary font-medium leading-relaxed">
            Anda masuk menggunakan <strong>Google OAuth</strong>. Pengaturan kata sandi dikelola langsung melalui akun Google Anda dan tidak dapat diubah di sini demi keamanan.
          </p>
        </div>
      )}
    </div>
  );
}
