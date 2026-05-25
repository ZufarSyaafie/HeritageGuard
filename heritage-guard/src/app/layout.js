import "./globals.css";

export const metadata = {
  title: "HeritageGuard",
  description: "Platform pemantauan otomasi dan pelaporan kerusakan cagar budaya",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}