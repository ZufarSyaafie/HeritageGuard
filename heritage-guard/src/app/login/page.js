import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Masuk | HeritageGuard",
  description: "Masuk ke akun HeritageGuard Anda untuk memantau aset cagar budaya",
};

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Selamat Datang" 
      subtitle="Masuk untuk mengelola inspeksi aset Anda"
    >
      <LoginForm />
    </AuthLayout>
  );
}
