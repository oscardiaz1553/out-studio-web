import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <main className="min-h-screen bg-[#0A0A0A]" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
