"use client";

import { useState } from "react";
import ProfilAvatar from "@/components/profil/ProfilAvatar";
import ProfilForm from "@/components/profil/ProfilForm";

export default function ProfilPage() {
  const [name, setName] = useState("Arch. Hendrawan");

  return (
    <div className="max-w-2xl space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profil Saya</h1>
        <p className="text-gray-500 text-sm">Kelola informasi akun dan preferensi Anda.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <ProfilAvatar name={name} role="ahli" />
      </div>

      <ProfilForm onNameChange={setName} />
    </div>
  );
}
