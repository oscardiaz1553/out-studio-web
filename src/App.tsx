import { useEffect, useState } from 'react';
import IntroOverlay, { shouldPlayIntro } from './components/IntroOverlay';
import SiteNav from './components/SiteNav';
import ScrollToTop from './components/ScrollToTop';
import MangoBot from './components/MangoBot';
import HeroSection from './sections/HeroSection';
import ClientsStrip from './sections/ClientsStrip';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import MethodSection from './sections/MethodSection';
import ReviewsSection from './sections/ReviewsSection';
import QuoteSection from './sections/QuoteSection';
import ResultsSection from './sections/ResultsSection';
import BlogTeaser from './sections/BlogTeaser';
import Footer from './sections/Footer';

export default function App() {
  const [intro, setIntro] = useState(shouldPlayIntro);
  // Al terminar la apertura se reinicia la portada para que entre con su
  // propia animación (el mono, el titular) justo cuando se descubre.
  const [heroKey, setHeroKey] = useState(0);
  useEffect(() => {
    // La portada se vuelve a montar: el menú debe volver a medir qué hay detrás.
    if (heroKey > 0) window.dispatchEvent(new Event('resize'));
  }, [heroKey]);

  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />
      <HeroSection key={heroKey} />
      <ClientsStrip />
      <ServicesSection />
      <ProjectsSection />
      <ResultsSection />
      <QuoteSection />
      <MethodSection />
      <ReviewsSection />
      <BlogTeaser />
      <Footer />
      <MangoBot />
      <ScrollToTop />
      {intro && (
        <IntroOverlay
          onFinish={() => setHeroKey((k) => k + 1)}
          onGone={() => setIntro(false)}
        />
      )}
    </main>
  );
}
