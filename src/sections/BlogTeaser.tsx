import RevealText from '../components/RevealText';
import TitleFrame from '../components/TitleFrame';
import blog from '../data/blog.json';

const HOME = import.meta.env.BASE_URL;

/** Los artículos más recientes del blog, al final de la portada. */
export default function BlogTeaser() {
  const posts = blog.posts.slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <section
      id="blog"
      className="bg-paper-pure border-t border-klein-deep/15 px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8 sm:mb-10">
          <TitleFrame kind="curly" tone="warm" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
              as="h2"
              text="Blog"
              className="font-display font-semibold text-klein tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            />
          </TitleFrame>
          <a href={`${HOME}blog/`} className="text-klein font-medium hover:underline underline-offset-4">
            Ver todo el blog
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="group relative flex flex-col rounded-2xl border border-klein-deep/15 bg-paper p-6 sm:p-7 transition-colors hover:border-klein"
            >
              <p className="text-xs text-carne-tinta mb-3">
                {p.category} · {p.readingMin} min de lectura
              </p>
              <h3 className="font-display font-semibold text-klein tracking-[-0.02em] leading-snug text-xl">
                <a href={`${HOME}blog/${p.slug}/`} className="after:absolute after:inset-0">
                  {p.title}
                </a>
              </h3>
              <p className="mt-3 text-ink-2 leading-relaxed text-sm">{p.description}</p>
              <p className="mt-auto pt-5 text-sm font-medium text-klein group-hover:underline underline-offset-4">
                Leer artículo
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
