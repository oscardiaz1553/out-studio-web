import SiteNav from './components/SiteNav';
import ScrollToTop from './components/ScrollToTop';
import HeroSection from './sections/HeroSection';
import ScrollVideoSection from './sections/ScrollVideoSection';
import ServicesSection from './sections/ServicesSection';
import EditorialPlate from './components/EditorialPlate';
import { MANGOS } from './data/botanica';
import ProjectsSection from './sections/ProjectsSection';
import MarqueeStrip from './sections/MarqueeStrip';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />
      <HeroSection />
      <ScrollVideoSection />
      <ServicesSection />

      {/* Lámina I — macro con titular calado, en el umbral papel→Klein */}
      <EditorialPlate
        caption="Peonía azul, mango fugado"
        objectPosition="30% 45%"
        minH="min-h-[92vh]"
        quoteObeys="Casi todo obedece."
        quoteEscapes="Una se sale."
      />

      <ProjectsSection />
      <MarqueeStrip />

      {/* Lámina II — los mangos fugados, respiro antes de Nosotros.
          Segundo motivo botánico para no repetir imagen. */}
      <EditorialPlate
        caption="Mango fugado, escala 1:1"
        image={MANGOS}
        objectPosition="50% 50%"
        minH="min-h-[78vh]"
        hideWithoutImage
      />

      <AboutSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
