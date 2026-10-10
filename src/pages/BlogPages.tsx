import AccentButton from '../components/AccentButton';
import ScrollToTop from '../components/ScrollToTop';
import SiteNav from '../components/SiteNav';
import blog from '../data/blog.json';
import services from '../data/services.json';

export type Post = (typeof blog.posts)[number];

const HOME = import.meta.env.BASE_URL;
const postPath = (slug: string) => `${HOME}blog/${slug}/`;

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(d);
}

function BlogFooter() {
  return (
    <footer className="px-6 md:px-10 lg:px-16 py-10 border-t border-klein-deep/15 text-sm text-muted">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-4">
        <nav aria-label="Servicios" className="flex flex-wrap gap-x-5 gap-y-2">
          {services.pages.map((p) => (
            <a key={p.slug} href={`${HOME}servicios/${p.slug}/`} className="hover:text-klein">
              {p.nav}
            </a>
          ))}
          <a href={`${HOME}blog/`} className="hover:text-klein">Blog</a>
          <a href={`${HOME}contacto.html`} className="hover:text-klein">Contacto</a>
        </nav>
        <p>© 2026 Out Studio. Colombia.</p>
      </div>
    </footer>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col rounded-2xl bg-paper-pure p-6 sm:p-7 transition-colors hover:bg-white/70">
      <p className="text-xs text-carne-tinta mb-3">
        {post.category} · {post.readingMin} min de lectura
      </p>
      <h2 className="font-display font-semibold text-klein tracking-[-0.02em] leading-snug text-xl sm:text-2xl">
        <a href={postPath(post.slug)} className="after:absolute after:inset-0 relative">
          {post.title}
        </a>
      </h2>
      <p className="mt-3 text-ink-2 leading-relaxed text-sm sm:text-base">{post.description}</p>
      <p className="mt-auto pt-5 text-sm font-medium text-klein group-hover:underline underline-offset-4">
        Leer artículo
      </p>
    </article>
  );
}

/** Índice del blog: todos los artículos, del más reciente al más antiguo. */
export function BlogIndex() {
  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />
      <header
        data-nav-bg="dark"
        className="bg-klein text-paper-pure px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 pb-14 sm:pb-20"
      >
        <div className="max-w-[1100px] mx-auto">
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[1]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
          >
            Blog
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-paper-pure/90">
            Guías prácticas sobre tiendas online, Shopify, WordPress, pagos y diseño
            web para negocios en Colombia.
          </p>
        </div>
      </header>
      <section className="px-6 md:px-10 lg:px-16 py-12 sm:py-16">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blog.posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
      <BlogFooter />
      <ScrollToTop />
    </main>
  );
}

/** Un artículo: título, datos de autor y fecha, el texto y un llamado final. */
export function BlogPost({ post }: { post: Post }) {
  const others = blog.posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const related = services.pages.filter((s) => post.related.includes(s.slug));

  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />
      <header
        data-nav-bg="dark"
        className="bg-klein text-paper-pure px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 pb-14 sm:pb-20"
      >
        <div className="max-w-[820px] mx-auto">
          <nav aria-label="Ruta de navegación" className="text-sm text-paper-pure/75 mb-6">
            <a href={HOME} className="hover:text-paper-pure hover:underline underline-offset-4">Inicio</a>
            <span aria-hidden className="mx-2">/</span>
            <a href={`${HOME}blog/`} className="hover:text-paper-pure hover:underline underline-offset-4">Blog</a>
          </nav>
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[1.02]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
          >
            {post.title}
          </h1>
          <p className="mt-6 text-sm text-paper-pure/80">
            Por <span className="text-paper-pure font-medium">Oscar Díaz</span>, Out Studio ·{' '}
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMin} min de lectura
          </p>
        </div>
      </header>

      <article className="px-6 md:px-10 lg:px-16 py-12 sm:py-16 bg-paper-pure">
        <div
          className="prose-out max-w-[720px] mx-auto"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <section data-nav-bg="dark" className="bg-klein-deep text-paper-pure px-6 md:px-10 lg:px-16 py-14 sm:py-16">
        <div className="max-w-[820px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="font-display font-extrabold tracking-[-0.03em] text-2xl sm:text-3xl">
              ¿Tienes un proyecto en mente?
            </p>
            <p className="mt-2 text-paper-pure/85">Te enviamos una cotización a la medida en 24 a 48 horas.</p>
          </div>
          <AccentButton href={`${HOME}#cotizar`} onBlue>
            Cotiza tu proyecto
          </AccentButton>
        </div>
      </section>

      {(related.length > 0 || others.length > 0) && (
        <section className="px-6 md:px-10 lg:px-16 py-12 sm:py-16">
          <div className="max-w-[1100px] mx-auto flex flex-col gap-10">
            {related.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-4">Servicios relacionados</h2>
                <ul className="flex flex-wrap gap-3">
                  {related.map((s) => (
                    <li key={s.slug}>
                      <a
                        href={`${HOME}servicios/${s.slug}/`}
                        className="inline-block rounded-full border border-klein text-klein font-medium px-6 py-2.5 text-sm hover:bg-klein hover:text-paper-pure transition-colors"
                      >
                        {s.nav}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {others.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-4">Sigue leyendo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {others.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <BlogFooter />
      <ScrollToTop />
    </main>
  );
}
