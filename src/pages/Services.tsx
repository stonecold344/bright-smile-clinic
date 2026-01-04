import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Check } from 'lucide-react';
import heroImage from '@/assets/hero-dental.jpg';

const services = [
  { icon: '🦷', title: 'טיפולי שיניים כלליים', description: 'טיפולים מונעים, סתימות, ניקוי שיניים מקצועי.', features: ['בדיקות תקופתיות', 'ניקוי מקצועי', 'סתימות לבנות', 'טיפולי חניכיים'] },
  { icon: '✨', title: 'הלבנת שיניים', description: 'טיפולי הלבנה מתקדמים לחיוך לבן וזוהר.', features: ['הלבנה במרפאה', 'ערכת הלבנה ביתית', 'הלבנה בלייזר', 'תוצאות מהירות'] },
  { icon: '🔧', title: 'שתלים דנטליים', description: 'שתלי שיניים איכותיים עם אחוזי הצלחה גבוהים.', features: ['שתלים מתקדמים', 'תכנון מחשב', 'ריפוי מהיר', 'אחריות מלאה'] },
  { icon: '👶', title: 'רפואת שיניים לילדים', description: 'טיפול עדין ומותאם לילדים.', features: ['סביבה ידידותית', 'טיפול עדין', 'הרדמה מותאמת', 'מניעה מוקדמת'] },
  { icon: '😁', title: 'יישור שיניים', description: 'פתרונות אורתודנטיים מתקדמים.', features: ['קשתיות שקופות', 'גשרים קבועים', 'ריטיינרים', 'מעקב קבוע'] },
  { icon: '🏆', title: 'אסתטיקה דנטלית', description: 'ציפויי חרסינה, עיצוב חיוך.', features: ['ציפויי חרסינה', 'עיצוב חיוך', 'סגירת רווחים', 'שיקום אסתטי'] },
];

const HeroSection = styled.section`position: relative; padding-top: 8rem; padding-bottom: 6rem; overflow: hidden;`;
const HeroBg = styled.div`position: absolute; inset: 0;`;
const HeroImageStyled = styled.img`width: 100%; height: 100%; object-fit: cover; opacity: 0.2;`;
const HeroOverlay = styled.div`position: absolute; inset: 0; background: linear-gradient(to bottom, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.background}e6, ${({ theme }) => theme.colors.background});`;
const HeroContent = styled.div`position: relative; z-index: 10; text-align: center; max-width: 48rem; margin: 0 auto;`;
const ServicesWrapper = styled.section`padding: ${({ theme }) => theme.spacing[24]} 0; background: ${({ theme }) => theme.colors.secondary}4d;`;
const ServicesGrid = styled.div`display: grid; grid-template-columns: 1fr; gap: 2rem; @media (min-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: repeat(2, 1fr); }`;
const ServiceCard = styled.div`background: ${({ theme }) => theme.colors.card}; border-radius: ${({ theme }) => theme.radii['2xl']}; padding: ${({ theme }) => theme.spacing[8]}; box-shadow: ${({ theme }) => theme.shadows.soft}; transition: all ${({ theme }) => theme.transitions.normal}; &:hover { box-shadow: ${({ theme }) => theme.shadows.elevated}; }`;
const ServiceInner = styled.div`display: flex; align-items: flex-start; gap: 1.5rem;`;
const ServiceIcon = styled.div`width: 4rem; height: 4rem; background: ${({ theme }) => theme.gradients.hero}; border-radius: ${({ theme }) => theme.radii['2xl']}; display: flex; align-items: center; justify-content: center; font-size: 1.875rem; flex-shrink: 0;`;
const ServiceContent = styled.div`flex: 1;`;
const ServiceTitle = styled.h3`font-size: ${({ theme }) => theme.fontSizes.xl}; font-weight: ${({ theme }) => theme.fontWeights.bold}; color: ${({ theme }) => theme.colors.foreground}; margin-bottom: 0.75rem;`;
const ServiceDescription = styled.p`color: ${({ theme }) => theme.colors.mutedForeground}; line-height: 1.7; margin-bottom: 1rem;`;
const FeaturesList = styled.ul`display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;`;
const FeatureItem = styled.li`display: flex; align-items: center; gap: 0.5rem; font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.foreground}; svg { color: ${({ theme }) => theme.colors.primary}; flex-shrink: 0; }`;

const Services = () => (
  <div>
    <Header />
    <main>
      <HeroSection>
        <HeroBg><HeroImageStyled src={heroImage} alt="שירותי מרפאה" /><HeroOverlay /></HeroBg>
        <Container><HeroContent><Badge>השירותים שלנו</Badge><Title $size="xl" style={{ marginTop: '1rem' }}>טיפולי שיניים מקצועיים</Title><Text $color="muted" $size="lg">מגוון רחב של טיפולי שיניים מתקדמים</Text></HeroContent></Container>
      </HeroSection>
      <ServicesWrapper>
        <Container>
          <ServicesGrid>
            {services.map((service, i) => (
              <ServiceCard key={i}>
                <ServiceInner>
                  <ServiceIcon>{service.icon}</ServiceIcon>
                  <ServiceContent>
                    <ServiceTitle>{service.title}</ServiceTitle>
                    <ServiceDescription>{service.description}</ServiceDescription>
                    <FeaturesList>{service.features.map((f, j) => (<FeatureItem key={j}><Check size={16} />{f}</FeatureItem>))}</FeaturesList>
                  </ServiceContent>
                </ServiceInner>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Container>
      </ServicesWrapper>
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Services;
