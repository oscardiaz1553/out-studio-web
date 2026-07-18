import SiteNav from '../components/SiteNav';
import ScrollToTop from '../components/ScrollToTop';
import ContactSection from '../sections/ContactSection';

/**
 * Página de contacto independiente. Vive en /contacto.html. Lleva el navbar
 * compartido (como todas las páginas) y reutiliza la sección de contacto del
 * landing, con un pie de página sobrio.
 */
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-paper flex flex-col" style={{ overflowX: 'clip' }}>
      <SiteNav />

      <ContactSection />

      <footer className="mt-auto px-6 md:px-10 lg:px-16 py-10 border-t border-klein-deep/15">
        <p className="text-muted text-sm">
          © 2026 Out. Studio. Todos los derechos reservados.
        </p>
      </footer>

      <ScrollToTop />
    </main>
  );
}
