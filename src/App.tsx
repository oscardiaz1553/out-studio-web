import SiteNav from './components/SiteNav';
import ScrollToTop from './components/ScrollToTop';
import FloatingQuoteCTA from './components/FloatingQuoteCTA';
import HeroSection from './sections/HeroSection';
import ScrollVideoSection from './sections/ScrollVideoSection';
import WhyOut from './sections/WhyOut';
import ServicesSection from './sections/ServicesSection';
import MethodSection from './sections/MethodSection';
import ProjectsSection from './sections/ProjectsSection';
import MarqueeStrip from './sections/MarqueeStrip';
import AboutSection from './sections/AboutSection';
import QuoteSection from './sections/QuoteSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />
      <HeroSection />
      <MarqueeStrip />
      <WhyOut />
      <ServicesSection />
      <ProjectsSection />
      <MethodSection />
      <ScrollVideoSection />
      <AboutSection />
      <QuoteSection />
      <ContactSection />
      <Footer />
      <FloatingQuoteCTA />
      <ScrollToTop />
    </main>
  );
}
