"use client";

const ROLE_LABELS = {
  pemerintah: "Instansi Pemerintah",
  swasta:     "Lembaga Swasta / Yayasan",
  ahli:       "Tenaga Ahli Konservasi",
};

function getInitials(name) {
  return (name || "U")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfilAvatar({ name, role }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200">
        {getInitials(name)}
      </div>
      <div className="text-center">
        <p className="text-xl font-black text-gray-900">{name || "—"}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full">
          {ROLE_LABELS[role] ?? "Pengguna"}
        </span>
      </div>
    </div>
  );
}
