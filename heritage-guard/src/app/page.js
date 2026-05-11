"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";

/* ─── Scan Visualizer ────────────────────────────────────────────────────────── */

const BOXES = [
	{
		id: "crack",
		label: "CRACK",
		conf: 98.4,
		x: 38,
		y: 52,
		w: 148,
		h: 196,
		color: "#ef4444",
		delay: 1.0,
	},
	{
		id: "spalling",
		label: "SPALLING",
		conf: 87.1,
		x: 228,
		y: 128,
		w: 164,
		h: 108,
		color: "#eab308",
		delay: 2.0,
	},
	{
		id: "moisture",
		label: "MOISTURE",
		conf: 91.5,
		x: 86,
		y: 276,
		w: 190,
		h: 82,
		color: "#3b82f6",
		delay: 3.0,
	},
];

function CountUp({ target, duration = 1200 }) {
	const [val, setVal] = useState(0);
	const started = useRef(false);
	useEffect(() => {
		if (started.current) return;
		started.current = true;
		const start = performance.now();
		const tick = (now) => {
			const t = Math.min((now - start) / duration, 1);
			setVal(Math.round(t * target * 10) / 10);
			if (t < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}, [target, duration]);
	return <>{val.toFixed(1)}%</>;
}

function ScanVisualizer() {
	const [phase, setPhase] = useState(0);
	useEffect(() => {
		const timers = BOXES.map((b, i) =>
			setTimeout(() => setPhase(i + 1), b.delay * 1000),
		);
		return () => timers.forEach(clearTimeout);
	}, []);

	const W = 440,
		H = 360;

	return (
		<div className="relative w-full max-w-[480px] select-none">
			<div
				className="absolute -inset-8 rounded-3xl pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at 50% 60%, rgba(38,75,221,0.1) 0%, transparent 70%)",
				}}
			/>

			<svg
				viewBox={`0 0 ${W} ${H}`}
				width="100%"
				style={{ display: "block", borderRadius: 12 }}
			>
				<defs>
					<pattern
						id="bricks"
						x="0"
						y="0"
						width="48"
						height="24"
						patternUnits="userSpaceOnUse"
					>
						<rect width="48" height="24" fill="#1c1917" />
						<rect x="1" y="1" width="44" height="10" fill="#28211e" rx="0.5" />
						<rect
							x="25"
							y="13"
							width="22"
							height="10"
							fill="#28211e"
							rx="0.5"
						/>
						<rect x="1" y="13" width="22" height="10" fill="#28211e" rx="0.5" />
					</pattern>
					<linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
						<stop offset="50%" stopColor="#3b82f6" stopOpacity="0.35" />
						<stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
					</linearGradient>
					<clipPath id="scanClip">
						<rect width={W} height={H} />
					</clipPath>
					<style>{`
            @keyframes scanline {
              0%   { transform: translateY(-40px); opacity: 0; }
              5%   { opacity: 1; }
              95%  { opacity: 1; }
              100% { transform: translateY(${H + 40}px); opacity: 0; }
            }
            @keyframes drawBox0 { 0% { stroke-dashoffset: ${2 * (148 + 196)}; } 100% { stroke-dashoffset: 0; } }
            @keyframes drawBox1 { 0% { stroke-dashoffset: ${2 * (164 + 108)}; } 100% { stroke-dashoffset: 0; } }
            @keyframes drawBox2 { 0% { stroke-dashoffset: ${2 * (190 + 82)};  } 100% { stroke-dashoffset: 0; } }
            @keyframes fadeLabel { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes crackDraw { 0% { stroke-dashoffset: 320; } 100% { stroke-dashoffset: 0; } }
            @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
          `}</style>
				</defs>

				<rect width={W} height={H} fill="url(#bricks)" rx="8" />
				<rect width={W} height={H} fill="rgba(0,0,0,0.28)" rx="8" />

				<g opacity="0.15" stroke="#999" strokeWidth="1" fill="none">
					<path
						d="M 60 60 L 80 110 L 70 160 L 95 200"
						strokeDasharray="320"
						style={{ animation: "crackDraw 2s ease-out 0.3s both" }}
					/>
					<path
						d="M 200 20 L 215 60 L 205 90"
						strokeDasharray="120"
						style={{ animation: "crackDraw 1.2s ease-out 0.5s both" }}
					/>
					<path
						d="M 340 180 L 370 230 L 360 280"
						strokeDasharray="200"
						style={{ animation: "crackDraw 1.8s ease-out 0.2s both" }}
					/>
				</g>

				<rect
					x="0"
					y="0"
					width={W}
					height="40"
					fill="url(#scanGrad)"
					clipPath="url(#scanClip)"
					style={{
						animation: "scanline 3s ease-in-out 0.2s infinite",
						transformOrigin: "0 0",
					}}
				/>

				{BOXES.map((b, i) => {
					const perim = 2 * (b.w + b.h);
					const visible = phase > i;
					return (
						<g key={b.id} clipPath="url(#scanClip)">
							{visible &&
								[
									[b.x, b.y],
									[b.x + b.w, b.y],
									[b.x, b.y + b.h],
									[b.x + b.w, b.y + b.h],
								].map(([cx, cy], j) => (
									<circle
										key={j}
										cx={cx}
										cy={cy}
										r="3"
										fill={b.color}
										style={{
											animation: `pulseDot 2s ease-in-out ${j * 0.15}s infinite`,
										}}
									/>
								))}
							<rect
								x={b.x}
								y={b.y}
								width={b.w}
								height={b.h}
								fill="none"
								stroke={b.color}
								strokeWidth="2"
								opacity={visible ? 1 : 0}
								strokeDasharray={perim}
								strokeDashoffset={visible ? undefined : perim}
								style={
									visible
										? {
												animation: `drawBox${i} 0.6s cubic-bezier(0.4,0,0.2,1) both`,
											}
										: {}
								}
							/>
							{visible && (
								<rect
									x={b.x}
									y={b.y}
									width={b.w}
									height={b.h}
									fill={b.color}
									fillOpacity="0.08"
								/>
							)}
							{visible && (
								<g
									style={{
										animation: "fadeLabel 0.4s ease 0.5s both",
										opacity: 0,
									}}
								>
									<rect
										x={b.x}
										y={b.y - 22}
										width={b.label.length * 7.2 + 48}
										height={22}
										fill={b.color}
										rx="3"
									/>
									<text
										x={b.x + 8}
										y={b.y - 7}
										fill="#fff"
										fontSize="9"
										fontFamily="'IBM Plex Mono', monospace"
										fontWeight="700"
										letterSpacing="0.08em"
									>
										{b.label}
									</text>
									<text
										x={b.x + b.label.length * 7.2 + 12}
										y={b.y - 7}
										fill="rgba(255,255,255,0.7)"
										fontSize="9"
										fontFamily="'IBM Plex Mono', monospace"
										fontWeight="500"
									>
										{b.conf}%
									</text>
								</g>
							)}
						</g>
					);
				})}

				{[
					"M 0 20 L 0 0 L 20 0",
					`M ${W - 20} 0 L ${W} 0 L ${W} 20`,
					`M 0 ${H - 20} L 0 ${H} L 20 ${H}`,
					`M ${W - 20} ${H} L ${W} ${H} L ${W} ${H - 20}`,
				].map((d, i) => (
					<path
						key={i}
						d={d}
						stroke="rgba(255,255,255,0.28)"
						strokeWidth="2"
						fill="none"
					/>
				))}

				<text
					x={W - 8}
					y={H - 8}
					textAnchor="end"
					fill="rgba(255,255,255,0.18)"
					fontSize="8"
					fontFamily="'IBM Plex Mono', monospace"
					letterSpacing="0.06em"
				>
					YOLOv12_HERITAGE_V2
				</text>
			</svg>

			{/* Detection pills */}
			<div className="flex gap-2.5 mt-3 flex-wrap">
				{BOXES.map((b, i) => (
					<div
						key={b.id}
						className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm text-xs"
						style={{
							opacity: phase > i ? 1 : 0,
							transition: "opacity 0.5s ease",
							fontFamily: "'IBM Plex Mono', monospace",
						}}
					>
						<span
							className="w-2 h-2 rounded-full flex-shrink-0"
							style={{ backgroundColor: b.color }}
						/>
						<span className="text-gray-500">{b.label}</span>
						{phase > i && (
							<span className="font-bold" style={{ color: b.color }}>
								<CountUp target={b.conf} duration={800} />
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

/* ─── FadeUp ──────────────────────────────────────────────────────────────────── */

function useFadeUp() {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVisible(true);
					obs.disconnect();
				}
			},
			{ threshold: 0.1 },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	return { ref, visible };
}

function FadeUp({ children, delay = 0, className = "" }) {
	const { ref, visible } = useFadeUp();
	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translateY(0)" : "translateY(24px)",
				transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
			}}
		>
			{children}
		</div>
	);
}

/* ─── Data ────────────────────────────────────────────────────────────────────── */

const STEPS = [
	{
		num: "01",
		title: "Upload Citra",
		body: "Unggah foto bangunan cagar budaya dari kamera, drone, atau smartphone. Sistem menerima format JPG dan PNG hingga 20 MB.",
	},
	{
		num: "02",
		title: "Analisis AI",
		body: "Model YOLOv12 memindai citra secara otomatis dan mendeteksi lokasi serta jenis kerusakan dalam hitungan detik — tanpa intervensi manual.",
	},
	{
		num: "03",
		title: "Laporan Instan",
		body: "Hasil deteksi dikonversi menjadi laporan teknis formal siap cetak — lengkap dengan koordinat, tingkat keparahan, dan rekomendasi tindakan.",
	},
];

const DAMAGE_TYPES = [
	{
		color: "#ef4444",
		bg: "#fef2f2",
		label: "Crack",
		labelId: "Retakan Struktural",
		badge: "Kritis",
		desc: "Retakan pada permukaan batu, beton, atau plester. Terdeteksi sebagai pola linear dengan lebar dan kedalaman bervariasi — indikator kerusakan struktural serius.",
	},
	{
		color: "#eab308",
		bg: "#fefce8",
		label: "Spalling",
		labelId: "Pengelupasan Material",
		badge: "Menengah",
		desc: "Pengelupasan permukaan akibat pelapukan kimia atau fisik. Ditandai area berbatas tidak beraturan dengan tekstur material terbuka.",
	},
	{
		color: "#3b82f6",
		bg: "#eff6ff",
		label: "Moisture",
		labelId: "Infiltrasi Kelembapan",
		badge: "Perlu Pantau",
		desc: "Noda air atau kelembapan yang mengindikasikan kebocoran atau kondensasi. Tampak sebagai area lebih gelap atau berwarna kekuningan.",
	},
];

const AUDIENCES = [
	{
		icon: "🏛️",
		title: "Instansi Pemerintah",
		sub: "BPK · Dinas Kebudayaan",
		desc: "Pantau kondisi aset cagar budaya nasional secara terpusat. Hasilkan laporan audit yang sesuai standar dokumentasi resmi pemerintah.",
	},
	{
		icon: "🏺",
		title: "Lembaga Swasta",
		sub: "Museum · Yayasan Pelestarian",
		desc: "Kelola dan dokumentasikan kondisi koleksi bangunan bersejarah. Deteksi dini sebelum kerusakan memerlukan biaya pemulihan yang besar.",
	},
	{
		icon: "🔬",
		title: "Tenaga Ahli",
		sub: "Arsitek · Insinyur Konservasi",
		desc: "Percepat proses inspeksi lapangan dengan bantuan AI. Fokus pada analisis strategis dan rekomendasi tindakan berbasis data akurat.",
	},
];

const STATS = [
	{ value: "94.7%", label: "Akurasi Deteksi" },
	{ value: "<3 dtk", label: "Waktu Proses" },
	{ value: "142+", label: "Aset Terpantau" },
	{ value: "3 Kelas", label: "Jenis Kerusakan" },
];

/* ─── Page ────────────────────────────────────────────────────────────────────── */

const mono = { fontFamily: "'IBM Plex Mono', monospace" };

export default function LandingPage() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const fadeIn = (delay = 0) => ({
		opacity: mounted ? 1 : 0,
		transform: mounted ? "translateY(0)" : "translateY(18px)",
		transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
	});

	return (
		<div className="min-h-screen bg-surface-container-low overflow-x-hidden">
			{/* ── NAVBAR ── */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<Logo size={36} href="/" />

					<div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
						{[
							["#cara-kerja", "Cara Kerja"],
							["#deteksi", "Deteksi AI"],
							["#pengguna", "Pengguna"],
						].map(([href, label]) => (
							<a
								key={href}
								href={href}
								className="hover:text-primary transition-colors"
							>
								{label}
							</a>
						))}
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/login"
							className="text-sm text-gray-500 hover:text-primary transition-colors px-4 py-2 font-medium"
						>
							Masuk
						</Link>
						<Link
							href="/register"
							className="text-sm font-bold text-white bg-primary hover:bg-blue-700 transition-colors px-5 py-2.5 rounded-xl shadow-sm"
						>
							Mulai Gratis
						</Link>
					</div>
				</div>
			</nav>

			{/* ── HERO ── */}
			<section className="pt-16 min-h-screen flex items-center bg-white">
				<div className="max-w-6xl mx-auto px-6 py-20 w-full">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						{/* Left */}
						<div>
							<div
								className="inline-flex items-center gap-2 bg-blue-50 text-primary text-xs font-bold px-4 py-2 rounded-full mb-8 border border-blue-100"
								style={{ ...fadeIn(0.1), ...mono, letterSpacing: "0.07em" }}
							>
								<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
								YOLOv12 · DETEKSI OTOMATIS
							</div>

							<h1
								className="text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight mb-6"
								style={fadeIn(0.2)}
							>
								Pantau Kondisi
								<br />
								<span className="text-primary">Cagar Budaya</span>
								<br />
								dengan AI
							</h1>

							<p
								className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md"
								style={fadeIn(0.35)}
							>
								Platform Cloud dengan model YOLOv12 yang mendeteksi retakan,
								pengelupasan, dan kelembapan secara otomatis — akurat, cepat,
								dan non-invasif.
							</p>

							<div className="flex flex-wrap gap-4" style={fadeIn(0.5)}>
								<Link
									href="/register"
									className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
								>
									Mulai Sekarang →
								</Link>
								<Link
									href="/login"
									className="inline-flex items-center gap-2 px-8 py-4 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-primary hover:text-primary transition-all"
								>
									Sudah punya akun
								</Link>
							</div>

							{/* Quick trust indicators */}
							<div
								className="flex items-center gap-8 mt-10 pt-8 border-t border-gray-100"
								style={fadeIn(0.65)}
							>
								{[
									{ val: "94.7%", label: "Akurasi" },
									{ val: "< 3 dtk", label: "Proses" },
									{ val: "Gratis", label: "Daftar" },
								].map((t) => (
									<div key={t.label}>
										<div className="text-2xl font-extrabold text-on-surface">
											{t.val}
										</div>
										<div className="text-xs text-gray-400 mt-0.5">
											{t.label}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Right — animated scan */}
						<div className="flex justify-center" style={fadeIn(0.4)}>
							<ScanVisualizer />
						</div>
					</div>
				</div>
			</section>

			{/* ── CARA KERJA ── */}
			<section id="cara-kerja" className="py-24 bg-surface-container-low">
				<div className="max-w-6xl mx-auto px-6">
					<FadeUp className="text-center mb-16">
						<div
							className="inline-block text-xs font-bold text-primary bg-blue-50 px-4 py-1.5 rounded-full mb-4 border border-blue-100"
							style={{ ...mono, letterSpacing: "0.08em" }}
						>
							CARA KERJA
						</div>
						<h2 className="text-4xl font-extrabold text-on-surface mb-3">
							Tiga Langkah Mudah
						</h2>
						<p className="text-gray-500 max-w-md mx-auto">
							Dari foto ke laporan teknis dalam hitungan detik — tanpa keahlian
							teknis khusus.
						</p>
					</FadeUp>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
						{STEPS.map((s, i) => (
							<FadeUp key={s.num} delay={i * 0.12}>
								<div className="relative bg-white rounded-2xl border border-gray-100 p-8 hover:border-blue-200 hover:shadow-md transition-all group">
									<div className="text-6xl font-extrabold text-gray-100 mb-5 group-hover:text-blue-100 transition-colors leading-none">
										{s.num}
									</div>
									<h3 className="text-xl font-bold text-on-surface mb-3">
										{s.title}
									</h3>
									<p className="text-gray-500 text-sm leading-relaxed">
										{s.body}
									</p>
									{i < 2 && (
										<div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-400 text-sm shadow-sm">
											→
										</div>
									)}
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</section>

			{/* ── STATS BAR ── */}
			<section className="bg-primary py-14">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						{STATS.map((s, i) => (
							<FadeUp key={s.label} delay={i * 0.1}>
								<div>
									<div className="text-3xl font-extrabold text-white mb-1">
										{s.value}
									</div>
									<div className="text-blue-200 text-sm">{s.label}</div>
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</section>

			{/* ── DETEKSI AI ── */}
			<section id="deteksi" className="py-24 bg-white">
				<div className="max-w-6xl mx-auto px-6">
					<FadeUp className="text-center mb-16">
						<div
							className="inline-block text-xs font-bold text-primary bg-blue-50 px-4 py-1.5 rounded-full mb-4 border border-blue-100"
							style={{ ...mono, letterSpacing: "0.08em" }}
						>
							KAPABILITAS AI
						</div>
						<h2 className="text-4xl font-extrabold text-on-surface mb-3">
							Tiga Jenis Kerusakan
							<br />
							yang Terdeteksi
						</h2>
						<p className="text-gray-500 max-w-lg mx-auto">
							Model dilatih pada ribuan citra bangunan bersejarah untuk
							mengidentifikasi tiga kelas kerusakan struktural paling umum dan
							paling kritis.
						</p>
					</FadeUp>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{DAMAGE_TYPES.map((d, i) => (
							<FadeUp key={d.label} delay={i * 0.12}>
								<div className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-all">
									<div className="flex items-start justify-between mb-6">
										<div
											className="w-12 h-12 rounded-xl flex items-center justify-center"
											style={{ backgroundColor: d.bg }}
										>
											<div
												className="w-5 h-5 rounded-full"
												style={{ backgroundColor: d.color }}
											/>
										</div>
										<span
											className="text-xs font-bold px-2.5 py-1 rounded-full"
											style={{ color: d.color, backgroundColor: d.bg }}
										>
											{d.badge}
										</span>
									</div>
									<h3 className="text-xl font-bold text-on-surface mb-1">
										{d.label}
									</h3>
									<p className="text-xs text-gray-400 mb-4" style={mono}>
										{d.labelId}
									</p>
									<p className="text-sm text-gray-500 leading-relaxed">
										{d.desc}
									</p>
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</section>

			{/* ── PENGGUNA ── */}
			<section id="pengguna" className="py-24 bg-surface-container-low">
				<div className="max-w-6xl mx-auto px-6">
					<FadeUp className="text-center mb-16">
						<div
							className="inline-block text-xs font-bold text-primary bg-blue-50 px-4 py-1.5 rounded-full mb-4 border border-blue-100"
							style={{ ...mono, letterSpacing: "0.08em" }}
						>
							DIRANCANG UNTUK
						</div>
						<h2 className="text-4xl font-extrabold text-on-surface mb-3">
							Untuk Siapa HeritageGuard?
						</h2>
						<p className="text-gray-500 max-w-md mx-auto">
							Dirancang untuk semua pihak yang terlibat dalam pelestarian
							warisan budaya Indonesia.
						</p>
					</FadeUp>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{AUDIENCES.map((a, i) => (
							<FadeUp key={a.title} delay={i * 0.12}>
								<div className="bg-white rounded-2xl border-2 border-gray-100 p-8 hover:border-primary/20 hover:shadow-md transition-all">
									<div className="text-4xl mb-5">{a.icon}</div>
									<h3 className="text-xl font-bold text-on-surface mb-1">
										{a.title}
									</h3>
									<p
										className="text-xs font-bold text-primary mb-4"
										style={mono}
									>
										{a.sub}
									</p>
									<p className="text-sm text-gray-500 leading-relaxed">
										{a.desc}
									</p>
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA ── */}
			<section className="py-24 bg-white">
				<div className="max-w-3xl mx-auto px-6 text-center">
					<FadeUp>
						<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 p-16 shadow-xl shadow-blue-100/50">
							<div
								className="inline-block text-xs font-bold text-primary bg-white px-4 py-1.5 rounded-full mb-6 border border-blue-200 shadow-sm"
								style={{ ...mono, letterSpacing: "0.08em" }}
							>
								MULAI SEKARANG
							</div>
							<h2 className="text-4xl font-extrabold text-on-surface mb-4 leading-tight">
								Lindungi Warisan Budaya
								<br />
								dengan Kecerdasan Buatan
							</h2>
							<p className="text-gray-500 mb-10 max-w-sm mx-auto">
								Bergabunglah dengan lembaga-lembaga yang telah mempercayakan
								pemantauan aset budaya mereka kepada HeritageGuard.
							</p>
							<Link
								href="/register"
								className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-300/50 active:scale-95"
							>
								Buat Akun Gratis →
							</Link>
							<p className="text-gray-400 text-sm mt-5">
								Tidak perlu kartu kredit · Langsung aktif
							</p>
						</div>
					</FadeUp>
				</div>
			</section>

			{/* ── FOOTER ── */}
			<footer className="bg-surface-container-low border-t border-gray-200 py-10">
				<div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
					<Logo size={32} href="/" />
					<p className="text-gray-400 text-sm text-center">
						Platform Pemantauan Cagar Budaya Berbasis AI · © 2026
					</p>
					<div className="flex gap-6 text-sm text-gray-400">
						<Link
							href="/login"
							className="hover:text-primary transition-colors"
						>
							Masuk
						</Link>
						<Link
							href="/register"
							className="hover:text-primary transition-colors font-semibold text-primary"
						>
							Daftar Gratis
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
