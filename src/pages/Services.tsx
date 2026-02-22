import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Check, Loader2, Stethoscope } from 'lucide-react';
import { useTreatments } from '@/hooks/useTreatments';
import heroImage from '@/assets/hero-dental.jpg';

const isImageUrl = (value: string) => {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');
};

const HeroSection = styled.section`position: relative; padding-top: 8rem; padding-bottom: 6rem; overflow: hidden;`;
const HeroBg = styled.div`position: absolute; inset: 0;`;
const HeroImageStyled = styled.img`width: 100%; height: 100%; object-fit: cover; opacity: 0.2;`;
const HeroOverlay = styled.div`position: absolute; inset: 0; background: linear-gradient(to bottom, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.background}e6, ${({ theme }) => theme.colors.background});`;
const HeroContent = styled.div`position: relative; z-index: 10; text-align: center; max-width: 48rem; margin: 0 auto;`;
const ServicesWrapper = styled.section`padding: ${({ theme }) => theme.spacing[24]} 0; background: ${({ theme }) => theme.colors.secondary}4d;`;
const ServicesGrid = styled.div`display: grid; grid-template-columns: 1fr; gap: 2rem; @media (min-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: repeat(2, 1fr); }`;
const ServiceCard = styled(Link)`display: block; background: ${({ theme }) => theme.colors.card}; border-radius: ${({ theme }) => theme.radii['2xl']}; padding: ${({ theme }) => theme.spacing[8]}; box-shadow: ${({ theme }) => theme.shadows.soft}; transition: all ${({ theme }) => theme.transitions.normal}; &:hover { box-shadow: ${({ theme }) => theme.shadows.elevated}; transform: translateY(-4px); }`;
const ServiceInner = styled.div`display: flex; align-items: flex-start; gap: 1.5rem;`;
const ServiceIcon = styled.div`width: 4rem; height: 4rem; background: ${({ theme }) => theme.gradients.hero}; border-radius: ${({ theme }) => theme.radii['2xl']}; display: flex; align-items: center; justify-content: center; font-size: 1.875rem; flex-shrink: 0; overflow: hidden;`;
const ServiceIconImage = styled.img`width: 100%; height: 100%; object-fit: cover;`;
const ServiceContent = styled.div`flex: 1;`;
const ServiceTitle = styled.h3`font-size: ${({ theme }) => theme.fontSizes.xl}; font-weight: ${({ theme }) => theme.fontWeights.bold}; color: ${({ theme }) => theme.colors.foreground}; margin-bottom: 0.75rem;`;
const ServiceDescription = styled.p`color: ${({ theme }) => theme.colors.mutedForeground}; line-height: 1.7; margin-bottom: 1rem;`;
const FeaturesList = styled.ul`display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;`;
const FeatureItem = styled.li`display: flex; align-items: center; gap: 0.5rem; font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.foreground}; svg { color: ${({ theme }) => theme.colors.primary}; flex-shrink: 0; }`;
const LoadingWrapper = styled.div`display: flex; align-items: center; justify-content: center; min-height: 200px;`;

const Services = () => {
  const { data: treatments = [], isLoading } = useTreatments();

  return (
    <div>
      <Header />
      <main>
        <HeroSection>
          <HeroBg><HeroImageStyled src={heroImage} alt="שירותי מרפאה" /><HeroOverlay /></HeroBg>
          <Container><HeroContent><Badge>השירותים שלנו</Badge><Title $size="xl" style={{ marginTop: '1rem' }}>טיפולי שיניים מקצועיים</Title><Text $color="muted" $size="lg">מגוון רחב של טיפולי שיניים מתקדמים</Text></HeroContent></Container>
        </HeroSection>
        <ServicesWrapper>
          <Container>
            {isLoading ? (
              <LoadingWrapper>
                <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
              </LoadingWrapper>
            ) : (
              <ServicesGrid>
                {treatments.map((treatment) => (
                  <ServiceCard key={treatment.id} to={`/treatment/${treatment.slug}`}>
                    <ServiceInner>
                      <ServiceIcon>
                        {isImageUrl(treatment.icon) ? (
                          <ServiceIconImage src={treatment.icon} alt={treatment.title} />
                        ) : (
                          <Stethoscope size={28} color="white" />
                        )}
                      </ServiceIcon>
                      <ServiceContent>
                        <ServiceTitle>{treatment.title}</ServiceTitle>
                        <ServiceDescription>{treatment.short_description}</ServiceDescription>
                        <FeaturesList>
                          {treatment.features.slice(0, 4).map((f, j) => (
                            <FeatureItem key={j}><Check size={16} />{f}</FeatureItem>
                          ))}
                        </FeaturesList>
                      </ServiceContent>
                    </ServiceInner>
                  </ServiceCard>
                ))}
              </ServicesGrid>
            )}
          </Container>
        </ServicesWrapper>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
