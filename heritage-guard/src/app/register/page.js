import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Daftar | HeritageGuard",
  description: "Buat akun HeritageGuard baru untuk mulai digitalisasi aset cagar budaya",
};

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Daftar Akun" 
      subtitle="Mulai pantau aset cagar budaya dengan teknologi AI"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
