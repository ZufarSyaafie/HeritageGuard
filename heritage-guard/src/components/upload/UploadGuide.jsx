import { Info, AlertTriangle } from 'lucide-react';

export default function UploadGuide() {
  return (
    <aside className="space-y-6 transition-colors">
      {/* Panduan Unggah */}
      <section className="bg-white dark:bg-dark-surface rounded-3xl p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Info size={16} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Panduan Unggah</h2>
        </div>

        <ol className="space-y-8">
          <GuideStep 
            number="1" 
            text="Pastikan citra memiliki pencahayaan yang cukup (siang hari atau lampu sorot)." 
          />
          <GuideStep 
            number="2" 
            text="Ambil foto tegak lurus terhadap bidang permukaan yang ingin diperiksa." 
          />
          <GuideStep 
            number="3" 
            text="Hindari blur akibat guncangan kamera untuk hasil deteksi retak rambut yang akurat." 
          />
          <GuideStep 
            number="4" 
            text={<>Gunakan format <strong className="text-gray-900 dark:text-dark-text font-bold">.jpg</strong> atau <strong className="text-gray-900 dark:text-dark-text font-bold">.png</strong> dengan resolusi minimal 1080p.</>} 
          />
        </ol>
      </section>

      {/* Contoh Citra */}
      <section className="relative h-56 rounded-3xl overflow-hidden group border border-gray-100 dark:border-dark-border shadow-sm shadow-black/5 bg-gray-100 dark:bg-dark-bg">
        <img 
          src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop" 
          alt="Optimal Sample" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
          <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-[0.2em] mb-2">Contoh Citra Optimal</span>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight leading-relaxed">
            Candi Borobudur, Magelang
          </h4>
        </div>
      </section>

      {/* Catatan Privasi */}
      <section className="bg-[#fff9f4] dark:bg-orange-500/5 p-8 rounded-3xl border border-[#fee4d2] dark:border-orange-500/20">
        <div className="flex items-center gap-3 mb-4 text-[#bf5500] dark:text-orange-400">
          <AlertTriangle size={24} />
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Catatan Privasi</h3>
        </div>
        <p className="text-sm text-[#7a4115] dark:text-orange-300/80 leading-relaxed font-medium">
          Seluruh citra yang diunggah akan disimpan dalam server terenkripsi sesuai dengan standar perlindungan aset nasional.
        </p>
      </section>
    </aside>
  );
}

function GuideStep({ number, text }) {
  return (
    <li className="flex gap-5 group transition-colors">
      <span className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border text-gray-400 dark:text-dark-text-muted flex items-center justify-center shrink-0 font-bold text-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 group-hover:rotate-6">
        {number}
      </span>
      <p className="text-sm text-gray-500 dark:text-dark-text-muted leading-[1.8] pt-1 transition-colors group-hover:text-gray-900 dark:group-hover:text-dark-text font-medium">
        {text}
      </p>
    </li>
  );
}
