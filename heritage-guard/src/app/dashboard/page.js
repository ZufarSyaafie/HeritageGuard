import DamageDetection from "@/components/dashboard/DamageDetection";
import AnalysisSummary from "@/components/dashboard/AnalysisSummary";
import HealthScore from "@/components/dashboard/HealthScore";
import AssetInfo from "@/components/dashboard/AssetInfo";
import ActionCards from "@/components/dashboard/ActionCards";
import MetricCard from "@/components/dashboard/MetricCard";
import DamageChart from "@/components/dashboard/DamageChart";
import { Building2, ScanLine, AlertTriangle, CheckCircle } from "lucide-react";

const METRICS = [
	{
		title: "Total Aset Terpantau",
		value: "142",
		icon: Building2,
		colorClass: "bg-blue-50 text-blue-600",
		subtitle: "Aktif dimonitor",
	},
	{
		title: "Inspeksi Bulan Ini",
		value: "38",
		icon: ScanLine,
		colorClass: "bg-purple-50 text-purple-600",
		subtitle: "Sejak 1 Mei 2026",
	},
	{
		title: "Tingkat Kritis",
		value: "12",
		icon: AlertTriangle,
		colorClass: "bg-red-50 text-red-600",
		subtitle: "Butuh perhatian segera",
	},
	{
		title: "Tingkat Aman",
		value: "118",
		icon: CheckCircle,
		colorClass: "bg-green-50 text-green-600",
		subtitle: "Kondisi terpantau baik",
	},
];

export default function DashboardPage() {
	return (
		<div className="space-y-8 pb-12">
			<div className="space-y-1">
				<h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
					HeritageGuard AI Dashboard
				</h1>
				<p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
					Visualisasi deteksi anomali struktural menggunakan computer vision
					YOLOv12 untuk preservasi situs cagar budaya.
				</p>
			</div>

			<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
				{METRICS.map((m) => (
					<MetricCard key={m.title} {...m} />
				))}
			</div>

			<DamageChart />

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
				<div className="xl:col-span-2">
					<DamageDetection />
				</div>
				<div className="flex flex-col gap-8">
					<AnalysisSummary />
					<HealthScore />
					<AssetInfo />
				</div>
			</div>

			<ActionCards />
		</div>
	);
}
