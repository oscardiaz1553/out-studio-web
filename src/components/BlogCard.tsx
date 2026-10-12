import { FrameKind, Sym } from './TitleFrame';
import blog from '../data/blog.json';

type Post = (typeof blog.posts)[number];

const HOME = import.meta.env.BASE_URL;
const IMG = {
  mango: `${HOME}mango-hero.webp`,
  laptop: `${HOME}mono-laptop.webp`,
  asoma: `${HOME}mono-asoma.webp`,
};

// Cada tarjeta lleva una portada con el material de la marca. Se reparten por
// orden para que dos seguidas nunca se vean iguales.
const COVERS: {
  bg: string;
  ink: string;
  sym: string;
  kind: FrameKind;
  art: string;
  artClass: string;
}[] = [
  {
    bg: '#F5E3B3', ink: '#1B2FCC', sym: '#1B2FCC', kind: 'curly', art: IMG.mango,
    artClass: 'w-[50%] right-[-10%] bottom-[-16%] rotate-[-10deg]',
  },
  {
    bg: '#1B2FCC', ink: '#FBF8F5', sym: '#F5E3B3', kind: 'square', art: IMG.laptop,
    artClass: 'w-[66%] right-[-6%] bottom-[-6%]',
  },
  {
    bg: '#141E5C', ink: '#FBF8F5', sym: '#F5E3B3', kind: 'angle', art: IMG.asoma,
    artClass: 'w-[78%] right-[-4%] bottom-[-8%]',
  },
];

// La palabra grande de cada portada: el tema del artículo en una o dos palabras.
const KICKER: Record<string, string> = {
  'cuanto-cuesta-una-tienda-online-colombia': 'Precios',
  'pasarelas-de-pago-colombia-tienda-online': 'Pagos',
  'shopify-vs-woocommerce-colombia': 'Shopify vs Woo',
};

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

/**
 * Tarjeta de artículo: portada de color con un par de símbolos, la palabra del
 * tema y un personaje de la marca asomándose; debajo, el título y el resumen.
 */
export default function BlogCard({
  post,
  index,
  className = '',
}: {
  post: Post;
  index: number;
  className?: string;
}) {
  const c = COVERS[index % COVERS.length];
  const kicker = KICKER[post.slug] ?? post.category;

  return (
    <article
      className={`group relative flex flex-col rounded-[24px] overflow-hidden bg-paper transition-transform duration-300 ease-out hover:-translate-y-1 ${className}`}
    >
      <div
        aria-hidden
        className="relative aspect-[16/10] overflow-hidden"
        style={{ background: c.bg, containerType: 'inline-size' }}
      >
        <span
          className="absolute left-[7%] top-[12%] flex gap-[0.3em] transition-transform duration-500 ease-out group-hover:-rotate-6"
          style={{ color: c.sym, fontSize: '16cqw' }}
        >
          <Sym kind={c.kind} />
          <Sym kind={c.kind} flip />
        </span>
        <span
          className="absolute z-[1] left-[7%] bottom-[10%] max-w-[60%] font-display font-extrabold tracking-[-0.045em] leading-[0.92]"
          style={{ color: c.ink, fontSize: '13cqw' }}
        >
          {kicker}
        </span>
        <img
          src={c.art}
          alt=""
          loading="lazy"
          className={`absolute h-auto transition-transform duration-500 ease-out group-hover:scale-105 ${c.artClass}`}
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-xs text-carne-tinta">
          {post.category} · {post.readingMin} min de lectura
        </p>
        <h3 className="mt-3 font-display font-bold text-klein tracking-[-0.025em] leading-[1.15] text-xl sm:text-[1.4rem]">
          <a href={`${HOME}blog/${post.slug}/`} className="after:absolute after:inset-0">
            {post.title}
          </a>
        </h3>
        <p className="mt-3 text-ink-2 leading-relaxed text-sm line-clamp-3">{post.description}</p>
        <div className="mt-auto pt-6 flex items-center justify-between gap-4">
          <span className="text-xs text-muted">{formatDate(post.date)}</span>
          <span
            aria-hidden
            className="w-11 h-11 rounded-full bg-klein text-paper-pure flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
