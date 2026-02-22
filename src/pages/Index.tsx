import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import AboutPreview from '@/components/AboutPreview';
import VideoSection from '@/components/VideoSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

const Index = () => {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
        <ScrollAnimationWrapper>
          <ServicesSection />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <AboutPreview />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <VideoSection />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <TestimonialsSection />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <CTASection />
        </ScrollAnimationWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
