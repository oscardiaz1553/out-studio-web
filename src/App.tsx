import { useState } from 'react';
import IntroOverlay, { shouldPlayIntro } from './components/IntroOverlay';
import SiteNav from './components/SiteNav';
import ScrollToTop from './components/ScrollToTop';
import MangoBot from './components/MangoBot';
import HeroSection from './sections/HeroSection';
import ClientsStrip from './sections/ClientsStrip';
import WhyOut from './sections/WhyOut';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import MethodSection from './sections/MethodSection';
import ReviewsSection from './sections/ReviewsSection';
import AboutSection from './sections/AboutSection';
import QuoteSection from './sections/QuoteSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
  const [intro, setIntro] = useState(shouldPlayIntro);
  // Al terminar la apertura se reinicia la portada para que entre con su
  // propia animación (el mono, el titular) justo cuando se descubre.
  const [heroKey, setHeroKey] = useState(0);

  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />
      <HeroSection key={heroKey} />
      <ClientsStrip />
      <WhyOut />
      <ServicesSection />
      <ProjectsSection />
      <QuoteSection />
      <MethodSection />
      <ReviewsSection />
      <AboutSection />
      <ContactSection />
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
