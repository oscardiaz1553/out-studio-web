import './footer.css';
import { AZULEJO_BAND } from '../data/botanica';
import LogoOut from '../components/LogoOut';

// Copias suficientes para cubrir pantallas anchas; el loop mueve -50%,
// así que el track son dos mitades idénticas (8 + 8).
const TILE_COPIES = 16;

export default function Footer() {
  return (
    <footer className="site-footer" data-nav-bg="dark">
      <div className="footer-dots" aria-hidden="true">
        <div className="footer-tiles__track">
          {Array.from({ length: TILE_COPIES }).map((_, i) => (
            <img key={i} src={AZULEJO_BAND} alt="" loading="lazy" />
          ))}
        </div>
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__top">
          <h2>Never the usual.</h2>

          <nav className="site-footer__nav" aria-label="Navegación del footer">
            <a href="#servicios">Servicios</a>
            <a href={`${import.meta.env.BASE_URL}proyectos.html`}>Proyectos</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Contacto">
            <a href="mailto:oscar.diaz@outstudio.online">Email</a>
            <a href="tel:+573188888392">Teléfono</a>
            <a href="#contacto">Hablar</a>
          </nav>
        </div>

        <div className="site-footer__brand-row">
          <a
            className="site-footer__brand"
            href={import.meta.env.BASE_URL}
            aria-label="Out. Studio inicio"
          >
            <LogoOut
              onBlue
              decorative
              className="w-[clamp(120px,30vw,300px)] h-auto text-paper-pure"
            />
          </a>
        </div>

        <div className="site-footer__legal">
          <p>© 2026 Out. Studio. Todos los derechos reservados.</p>
          <a href="#privacidad">Aviso de Privacidad</a>
          <a href="#terminos">Términos de Uso</a>
        </div>
      </div>
    </footer>
  );
}
