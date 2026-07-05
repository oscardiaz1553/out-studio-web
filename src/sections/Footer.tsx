import { BrandName } from '../components/Brand';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 px-6 md:px-10 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-white text-lg">
          <BrandName />
        </span>
        <span className="text-[#888888] text-sm font-medium">
          © 2026 Out. Studio — Fuera del molde
        </span>
        <a
          href="mailto:oscar.diaz@out-studio.net"
          className="text-[#888888] text-sm font-medium hover:text-[#FF5733] transition-colors duration-200"
        >
          oscar.diaz@out-studio.net
        </a>
      </div>
    </footer>
  );
}
