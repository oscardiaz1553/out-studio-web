import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import EditorialPlate from './components/EditorialPlate';
import ProjectsSection from './sections/ProjectsSection';
import MarqueeStrip from './sections/MarqueeStrip';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <ServicesSection />

      {/* Lámina I — macro con titular calado, en el umbral papel→Klein */}
      <EditorialPlate
        fig="Fig. 03"
        caption="Peonía azul, mango fugado · lám. facsímil"
        objectPosition="30% 45%"
        minH="min-h-[92vh]"
        quoteObeys="Casi todo obedece."
        quoteEscapes="Una se sale."
        captionSide="right"
      />

      <ProjectsSection />
      <MarqueeStrip />

      {/* Lámina II — el patrón continuo, respiro antes de Nosotros.
          Se oculta hasta que exista la imagen (evita panel vacío). */}
      <EditorialPlate
        fig="Fig. 07"
        caption="Patrón continuo, escala 1:1"
        objectPosition="70% 55%"
        minH="min-h-[78vh]"
        captionSide="left"
        hideWithoutImage
      />

      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
