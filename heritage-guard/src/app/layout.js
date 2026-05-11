import "./globals.css";

export const metadata = {
  title: "HeritageGuard",
  description: "Platform pemantauan otomasi dan pelaporan kerusakan cagar budaya",
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