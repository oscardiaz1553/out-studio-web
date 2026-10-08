import SiteNav from './components/SiteNav';
import ScrollToTop from './components/ScrollToTop';
import FloatingQuoteCTA from './components/FloatingQuoteCTA';
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
  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />
      <HeroSection />
      <ClientsStrip />
      <WhyOut />
      <ServicesSection />
      <ProjectsSection />
      <MethodSection />
      <ReviewsSection />
      <AboutSection />
      <QuoteSection />
      <ContactSection />
      <Footer />
      <FloatingQuoteCTA />
      <ScrollToTop />
    </main>
  );
}
