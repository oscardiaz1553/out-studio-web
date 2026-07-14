import './footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-dots" aria-hidden="true">
        <div className="footer-dots__line" />
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__top">
          <h2>Fuera de lo usual.</h2>

          <nav className="site-footer__nav" aria-label="Navegación del footer">
            <a href="#servicios">Servicios</a>
            <a href="#proyectos">Proyectos</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Contacto">
            <a href="mailto:oscar.diaz@out-studio.net">Email</a>
            <a href="tel:+573005658674">Teléfono</a>
            <a href="#contacto">Hablar</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Redes sociales">
            {/* TODO: reemplazar con el link real de Instagram */}
            <a href="#">Instagram</a>
            {/* TODO: reemplazar con el link real de LinkedIn */}
            <a href="#">LinkedIn</a>
          </nav>
        </div>

        <div className="site-footer__brand-row">
          <a
            className="site-footer__brand"
            href={import.meta.env.BASE_URL}
            aria-label="Out. Studio inicio"
          >
            <span className="site-footer__wordmark">Out</span>
            <span className="site-footer__mark" aria-hidden="true" />
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
