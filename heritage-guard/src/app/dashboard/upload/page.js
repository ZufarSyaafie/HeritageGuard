import UploadHeader from "@/components/upload/UploadHeader";
import UploadZone from "@/components/upload/UploadZone";
import UploadGuide from "@/components/upload/UploadGuide";

export const metadata = {
  title: "Upload Citra | HeritageGuard",
  description: "Unggah foto struktur bangunan cagar budaya untuk dianalisis oleh model AI YOLO12",
};

export default function UploadPage() {
  return (
    <main className="flex flex-col gap-8">
      {/* Header section with Title and Description */}
      <UploadHeader />
      
      {/* Layout grid for Upload Zone and Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-20">
        {/* Left Column: Upload area (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <UploadZone />
        </div>
        
        {/* Right Column: Guide and Privacy info (4 columns) */}
        <aside className="lg:col-span-4">
          <UploadGuide />
        </aside>
      </div>
    </main>
  );
}
