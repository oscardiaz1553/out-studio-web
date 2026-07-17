import { BrandName } from '../components/Brand';
import ContactSection from '../sections/ContactSection';

/**
 * Página de contacto independiente. Vive en /contacto.html y se abre en una
 * pestaña nueva desde el menú del landing. Reutiliza la sección de contacto
 * del landing y la enmarca con un encabezado mínimo (marca + volver) y un
 * pie de página sobrio, para que sea una página completa por sí sola.
 */
export default function ContactPage() {
  const home = import.meta.env.BASE_URL;

  return (
    <main className="min-h-screen bg-paper flex flex-col" style={{ overflowX: 'clip' }}>
      <header className="px-6 md:px-10 pt-6 md:pt-8">
        <div className="flex items-center justify-between gap-4">
          <a href={home} className="text-klein text-xl md:text-2xl">
            <BrandName />
          </a>
          <a
            href={home}
            className="text-klein-deep font-medium text-sm md:text-base hover:text-klein transition-colors duration-200"
          >
            ← Volver al inicio
          </a>
        </div>
      </header>

      <ContactSection />

      <footer className="mt-auto px-6 md:px-10 lg:px-16 py-10 border-t border-klein-deep/15">
        <p className="text-muted text-sm">
          © 2026 Out. Studio. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}
