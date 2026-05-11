import TopNavbar from "@/components/TopNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      id: 1,
      title: "Upload dan Scan",
      desc: "Unggah citra bangunan dengan mudah. Sistem berbasis Cloud kami siap memproses data dari kamera atau drone dalam hitungan detik.",
      colorClass: "bg-blue-100 text-primary"
    },
    {
      id: 2,
      title: "Deteksi AI Otomatis",
      desc: "Sistem secara instan mengenali dan menandai jenis kerusakan seperti crack, spalling, dan moisture menggunakan model YOLO.",
      colorClass: "bg-green-100 text-accent"
    },
    {
      id: 3,
      title: "Automated Report",
      desc: "Konversi hasil deteksi menjadi laporan teknis formal secara otomatis. Siap diserahkan kepada pihak berwenang dan insinyur.",
      colorClass: "bg-gray-200 text-neutral"
    }
  ];

  const audiences = [
    "🏛️ Pemerintah (BPK & Dinas Kebudayaan)",
    "🏢 Lembaga Swasta (Yayasan Museum)",
    "👷 Tenaga Ahli (Arsitek & Insinyur Konservasi)"
  ];

  return (
    <div className="min-h-screen bg-base-100 font-sans text-neutral scroll-smooth">
      <TopNavbar />
      
      <main>
        {/* HERO SECTION */}
        <div className="min-h-screen">
          <section className="pt-60 pb-20 px-6 max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-neutral leading-tight mb-6">
              Kecerdasan Buatan untuk <br className="hidden md:block"/> 
              <span className="text-primary">Pelestarian Cagar Budaya</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
              Platform pemantauan otomatis berbasis Cloud. Deteksi kerusakan struktur seperti retakan, pengelupasan, dan kelembapan secara akurat, cepat, dan non-invasif.
            </p>``
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/register" 
                className="px-8 py-4 text-lg font-bold text-white bg-primary rounded-lg hover:bg-blue-700 transition shadow-lg inline-block"
              >
                Mulai Digitalisasi Aset
              </Link>
              <button className="px-8 py-4 text-lg font-bold text-neutral bg-base-200 rounded-lg hover:bg-base-300 border border-base-300 transition">
                Pelajari Teknologi YOLO
              </button>
            </div>
          </section>
        </div>

        {/* FEATURES SECTION */}
        <div className="min-h-screen">
          <section id="fitur" className="py-20 bg-base-200">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4">Mengapa HeritageGuard?</h2>
              <p className="text-secondary max-w-2xl mx-auto mb-12 text-lg">
                Inspeksi visual manual memberikan hasil kuantitatif yang tidak konsisten, sementara sensor fisik terlalu mahal untuk pemantauan rutin.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 text-left">
                {features.map((feature) => (
                  <div key={feature.id} className="p-8 bg-base-100 rounded-xl shadow-sm border border-base-300 hover:border-primary transition duration-300">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-2xl font-bold ${feature.colorClass}`}>
                      {feature.id}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-secondary">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* TARGET AUDIENCE SECTION */}
        <div className="min-h-screen">
          <section id="klien" className="py-20 max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-10 text-neutral">Dirancang untuk Para Profesional</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {audiences.map((item, index) => (
                <div key={index} className="px-6 py-3 bg-base-200 border border-base-300 rounded-full text-neutral font-medium hover:bg-base-300 transition cursor-default">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}