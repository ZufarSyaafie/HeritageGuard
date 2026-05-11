"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const ROLES = [
  { value: "pemerintah", label: "Instansi Pemerintah (BPK / Dinas Kebudayaan)" },
  { value: "swasta",     label: "Lembaga Swasta / Yayasan Museum"              },
  { value: "ahli",       label: "Tenaga Ahli (Arsitek / Insinyur Konservasi)"  },
];

const inputCls =
  "w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-xl py-3.5 px-4 text-sm outline-none transition-all font-semibold";

function FormField({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}

export default function ProfilForm({ onNameChange }) {
  const [form, setForm] = useState({
    name:      "Arch. Hendrawan",
    email:     "hendrawan@heritage.id",
    institusi: "Balai Pelestarian Kebudayaan Wilayah X",
    role:      "ahli",
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved]   = useState(false);
  const [pwError, setPwError] = useState("");

  const handleSave = () => {
    setSaved(true);
    onNameChange?.(form.name);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSave = () => {
    if (!passwords.current)                           { setPwError("Masukkan kata sandi saat ini."); return; }
    if (passwords.next.length < 8)                    { setPwError("Kata sandi baru minimal 8 karakter."); return; }
    if (passwords.next !== passwords.confirm)          { setPwError("Konfirmasi kata sandi tidak cocok."); return; }
    setPwError("");
    setPasswords({ current: "", next: "", confirm: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Informasi Akun</h3>

        <FormField label="Nama Lengkap">
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </FormField>
        <FormField label="Email">
          <input
            className={inputCls}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </FormField>
        <FormField label="Institusi">
          <input
            className={inputCls}
            value={form.institusi}
            onChange={(e) => setForm({ ...form, institusi: e.target.value })}
          />
        </FormField>
        <FormField label="Peran">
          <select
            className={`${inputCls} appearance-none`}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </FormField>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95"
          >
            Simpan Perubahan
          </button>
          {saved && (
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-bold">
              <CheckCircle2 size={16} />
              Tersimpan!
            </div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Ubah Kata Sandi</h3>

        <FormField label="Kata Sandi Saat Ini">
          <input
            className={inputCls}
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
        </FormField>
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
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-700 transition-all active:scale-95"
        >
          Perbarui Kata Sandi
        </button>
      </div>
    </div>
  );
}
