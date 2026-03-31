import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardRouteLayout({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}