import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardRouteLayout({ children }) {
  return (
    <div className="bg-white dark:bg-dark-bg transition-colors duration-300">
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </div>
  );
}