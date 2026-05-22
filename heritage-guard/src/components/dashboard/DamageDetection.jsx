"use client";

import { Maximize2, ZoomIn, Layers } from "lucide-react";

export default function DamageDetection() {
	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
			{/* Header */}
			<div className="p-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-1.5 h-6 bg-primary rounded-full"></div>
					<h2 className="text-xl font-bold text-gray-900">
						Hasil Deteksi Kerusakan
					</h2>
				</div>
				<div className="flex gap-2">
					<span className="px-3 py-1 bg-blue-50 text-primary text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100">
						YOLOv12X_MODEL_V2
					</span>
					<span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider border border-gray-100">
						REF: 2024-CANDI-091
					</span>
				</div>
			</div>

			{/* Image Container */}
			<div className="px-6 pb-6 relative flex-1">
				<div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3]">
					{/* Placeholder for the actual image from Body.png */}
					<div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 italic">
						[Visualisasi Deteksi Kerusakan]
					</div>

					{/* Mock Bounding Boxes (matching the design) */}
					{/* <div className="absolute top-1/4 left-1/3 w-1/4 h-1/2 border-2 border-red-500 rounded shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            <span className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-t uppercase">
              Crack 98.4%
            </span>
          </div>
          
          <div className="absolute top-[30%] left-[45%] w-[30%] h-[1/3] border-2 border-blue-500 rounded shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-t uppercase">
              Moisture 91.5%
            </span>
          </div>

          <div className="absolute bottom-[20%] left-[10%] w-[20%] h-[1/4] border-2 border-yellow-500 rounded shadow-[0_0_10px_rgba(234,179,8,0.3)]">
            <span className="absolute -top-6 left-0 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-t uppercase">
              Spalling 87.1%
            </span>
          </div> */}

					{/* Controls overlay */}
					<div className="absolute bottom-4 right-4 flex flex-col gap-2">
						<button className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg flex items-center justify-center shadow-md hover:bg-white transition-all text-gray-600">
							<Maximize2 size={18} />
						</button>
						<button className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg flex items-center justify-center shadow-md hover:bg-white transition-all text-gray-600">
							<ZoomIn size={18} />
						</button>
						<button className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg flex items-center justify-center shadow-md hover:bg-white transition-all text-gray-600">
							<Layers size={18} />
						</button>
					</div>
				</div>

				{/* Legend */}
				<div className="mt-6 flex flex-wrap gap-6 text-xs font-semibold text-gray-600">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-red-500 rounded-sm"></div>
						<span>Struktural Crack (Major)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
						<span>Concrete Spalling</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
						<span>Moisture Ingress</span>
					</div>
				</div>
			</div>
		</div>
	);
}
