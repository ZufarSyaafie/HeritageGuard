export default function Footer() {
    return (
      <footer className="bg-neutral text-base-200 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Kelompok Sidat Sawah. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    );
  }