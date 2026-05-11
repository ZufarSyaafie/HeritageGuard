import { Cpu, Zap } from "lucide-react";

export default function ModelStats() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
			<StatCard
				icon={<Cpu className="text-primary" size={28} />}
				label="AI Model"
				value="YOLOv12 Structural v2.4"
			/>
			<StatCard
				icon={<Zap className="text-primary" size={28} />}
				label="Inference Speed"
				value="< 1.2s per detection"
			/>
		</div>
	);
}

function StatCard({ icon, label, value }) {
	return (
		<div className="bg-white p-7 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
			<div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center border border-blue-50/50">
				{icon}
			</div>
			<div>
				<span className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-1.5">
					{label}
				</span>
				<span className="block text-base font-bold text-gray-900 leading-tight">
					{value}
				</span>
			</div>
		</div>
	);
}
