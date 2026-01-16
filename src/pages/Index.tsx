import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import AboutPreview from '@/components/AboutPreview';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';

const Index = () => {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutPreview />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
