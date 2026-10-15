import ScrollToTop from '../components/ScrollToTop';
import SiteNav from '../components/SiteNav';
import { LEGAL, type LegalDoc } from '../data/legal';
import Footer from '../sections/Footer';

const HOME = import.meta.env.BASE_URL;

/** Páginas legales (aviso de privacidad y términos de uso): encabezado azul y
 *  el texto con el estilo de lectura del blog. */
export default function LegalPage({ doc }: { doc: LegalDoc['slug'] }) {
  const d = LEGAL[doc];
  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />
      <header
        data-nav-bg="dark"
        className="bg-klein text-paper-pure px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 pb-12 sm:pb-16"
      >
        <div className="max-w-[820px] mx-auto">
          <nav aria-label="Ruta de navegación" className="text-sm text-paper-pure/75 mb-6">
            <a href={HOME} className="hover:text-paper-pure hover:underline underline-offset-4">Inicio</a>
            <span aria-hidden className="mx-2">/</span>
            <span aria-current="page">{doc === 'privacidad' ? 'Aviso de Privacidad' : 'Términos de Uso'}</span>
          </nav>
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[1.02]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}
          >
            {d.title}
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg text-paper-pure/85">{d.lead}</p>
          <p className="mt-4 text-sm text-paper-pure/70">Última actualización: {d.updated}</p>
        </div>
      </header>

      <article className="px-6 md:px-10 lg:px-16 py-12 sm:py-16 bg-paper-pure">
        <div className="prose-out max-w-[720px] mx-auto" dangerouslySetInnerHTML={{ __html: d.html }} />
      </article>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
