import './footer.css';
import type { ReactNode } from 'react';
import { AZULEJO_BAND } from '../data/botanica';
import FooterAnimation from '../components/FooterAnimation';
import { SOCIAL, WHATSAPP_URL } from '../data/site';

// Copias suficientes para cubrir pantallas anchas; el loop mueve -50%,
// así que el track son dos mitades idénticas (8 + 8).
const TILE_COPIES = 16;
const HOME = import.meta.env.BASE_URL;

const SERVICES = [
  { label: 'Todos los servicios', href: `${HOME}servicios/` },
  { label: 'Tiendas Shopify', href: `${HOME}servicios/tiendas-shopify/` },
  { label: 'Out Emprende', href: `${HOME}servicios/out-emprende/` },
  { label: 'Sitios WordPress', href: `${HOME}servicios/sitios-wordpress/` },
  { label: 'Landing pages', href: `${HOME}servicios/landing-pages/` },
  { label: 'Branding', href: `${HOME}servicios/branding/` },
  { label: 'Desarrollo web', href: `${HOME}servicios/desarrollo-web/` },
];

const STUDIO = [
  { label: 'Proyectos', href: `${HOME}proyectos.html` },
  { label: 'Blog', href: `${HOME}blog/` },
  { label: 'Contacto', href: `${HOME}contacto.html` },
  { label: 'Cotizar', href: `${HOME}#cotizar` },
];

// Íconos de línea, mismo trazo para todos.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ICONS = {
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  ),
  instagram: (
    <Icon>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </Icon>
  ),
  linkedin: (
    <Icon>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6 1.4 0 2.2.9 2.2 2.6V16" />
    </Icon>
  ),
  tiktok: (
    <Icon>
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.4 2 4 4.5 4.2" />
    </Icon>
  ),
  behance: (
    <Icon>
      <path d="M3.5 7h4.3a2.4 2.4 0 0 1 0 4.8H3.5V7Zm0 4.8h4.8a2.6 2.6 0 0 1 0 5.2H3.5v-5.2ZM14.5 13.6h6c0-2.2-1.3-3.6-3-3.6s-3 1.4-3 3.4 1.3 3.6 3.2 3.6c1.3 0 2.2-.6 2.6-1.6M15 7.2h4" />
    </Icon>
  ),
};

const SOCIAL_LABELS: Record<keyof typeof SOCIAL, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  behance: 'Behance',
};

const CONTACT = [
  { key: 'whatsapp', label: 'WhatsApp', value: 'Escríbenos', href: WHATSAPP_URL, external: true },
] as const;

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3.5">
      <span className="text-sm text-carne/70">{title}</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          className="w-fit text-[15px] sm:text-base font-medium text-paper-pure/90 hover:text-carne transition-colors"
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}

export default function Footer() {
  const socials = (Object.keys(SOCIAL) as (keyof typeof SOCIAL)[]).filter((k) => SOCIAL[k]);

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
        {/* Cierre: el lema y la invitación a cotizar. */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <h2 className="font-display font-semibold tracking-[-0.035em] leading-[1.02] text-paper-pure" style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.4rem)' }}>
              Never the usual.
            </h2>
            <p className="mt-4 max-w-[38ch] text-paper-pure/75 leading-relaxed">
              Diseño UX/UI y desarrollo web a medida para negocios de toda Colombia.
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2.5">
            <a
              href={`${HOME}#cotizar`}
              className="group w-full sm:w-auto flex items-center justify-between gap-5 rounded-full bg-carne pl-7 pr-2 py-2 shadow-[0_16px_40px_rgba(245,227,179,0.18)] transition-transform active:scale-[0.98] hover:-translate-y-0.5"
            >
              <span className="font-display font-extrabold tracking-[-0.03em] text-klein leading-none whitespace-nowrap" style={{ fontSize: 'clamp(1.1rem, 5.6vw, 1.4rem)' }}>
                Cotiza tu proyecto
              </span>
              <span className="w-12 h-12 shrink-0 rounded-full bg-klein text-paper-pure flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <span className="text-xs text-paper-pure/60 self-center sm:self-auto lg:pr-6">
              Respuesta en 6 a 24 horas
            </span>
          </div>
        </div>

        {/* Contacto directo: WhatsApp. */}
        <div className="mt-10 sm:mt-12 flex">
          {CONTACT.map((c) => (
            <a
              key={c.key}
              href={c.href}
              {...('external' in c ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group w-full sm:w-auto sm:min-w-[320px] flex items-center gap-4 rounded-2xl bg-paper-pure/[0.07] hover:bg-paper-pure/[0.12] p-4 pr-8 transition-colors"
            >
              <span className="w-11 h-11 shrink-0 rounded-full bg-carne text-klein-deep flex items-center justify-center transition-transform group-hover:scale-105">
                {ICONS[c.key]}
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-paper-pure/60">{c.label}</span>
                <span className="block truncate font-medium text-paper-pure">{c.value}</span>
              </span>
            </a>
          ))}
        </div>

        {/* Enlaces en columnas con título, y redes. */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr] gap-x-6 gap-y-10 pt-10 border-t border-paper-pure/15">
          <LinkColumn title="Servicios" links={SERVICES} />
          <LinkColumn title="Estudio" links={STUDIO} />
          {socials.length > 0 && (
            <div className="col-span-2 lg:col-span-1 flex flex-col gap-3.5 lg:items-end">
              <span className="text-sm text-carne/70">Redes</span>
              <div className="flex gap-2.5">
                {socials.map((k) => (
                  <a
                    key={k}
                    href={SOCIAL[k]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={SOCIAL_LABELS[k]}
                    className="w-11 h-11 rounded-full border border-paper-pure/25 text-paper-pure flex items-center justify-center hover:bg-carne hover:text-klein-deep hover:border-carne transition-colors"
                  >
                    {ICONS[k]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="site-footer__brand-row">
          <FooterAnimation />
        </div>

        <div className="site-footer__legal">
          <p>© 2026 Out Studio. Todos los derechos reservados.</p>
          <a href="#privacidad">Aviso de Privacidad</a>
          <a href="#terminos">Términos de Uso</a>
        </div>
      </div>
    </footer>
  );
}
