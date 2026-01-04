import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Container, Section, Badge, Card } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';

const services = [
  {
    icon: '🦷',
    title: 'טיפולי שיניים כלליים',
    description: 'טיפולים מונעים, סתימות, ניקוי שיניים מקצועי ובדיקות תקופתיות.',
  },
  {
    icon: '✨',
    title: 'הלבנת שיניים',
    description: 'טיפולי הלבנה מתקדמים לחיוך לבן וזוהר יותר.',
  },
  {
    icon: '🔧',
    title: 'שתלים דנטליים',
    description: 'שתלי שיניים איכותיים עם אחוזי הצלחה גבוהים.',
  },
  {
    icon: '👶',
    title: 'רפואת שיניים לילדים',
    description: 'טיפול עדין ומותאם לילדים בסביבה ידידותית ונעימה.',
  },
  {
    icon: '😁',
    title: 'יישור שיניים',
    description: 'פתרונות אורתודנטיים מתקדמים כולל קשתיות שקופות.',
  },
  {
    icon: '🏆',
    title: 'אסתטיקה דנטלית',
    description: 'ציפויי חרסינה, עיצוב חיוך ושיפור מראה השיניים.',
  },
];

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.colors.secondary}4d;
`;

const Header = styled.div`
  text-align: center;
  max-width: 42rem;
  margin: 0 auto ${({ theme }) => theme.spacing[16]};
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ServiceCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-0.5rem);
  }
`;

const ServiceIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.875rem;
  margin-bottom: 1.5rem;
  transition: transform ${({ theme }) => theme.transitions.normal};
  
  ${ServiceCard}:hover & {
    transform: scale(1.1);
  }
`;

const ServiceTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.75rem;
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
  line-height: 1.7;
`;

const CTAWrapper = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const ServicesSection = () => {
  return (
    <SectionWrapper>
      <Container>
        <Header>
          <Badge>השירותים שלנו</Badge>
          <Title $size="lg" style={{ marginTop: '1rem' }}>
            טיפולי שיניים מקצועיים
          </Title>
          <Text $color="muted" $size="lg">
            אנו מציעים מגוון רחב של טיפולי שיניים מתקדמים לכל המשפחה
          </Text>
        </Header>

        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </ServiceCard>
          ))}
        </ServicesGrid>

        <CTAWrapper>
          <Button as={Link} to="/services" $variant="heroPrimary" $size="lg">
            לכל השירותים
            <ArrowLeft size={20} />
          </Button>
        </CTAWrapper>
      </Container>
    </SectionWrapper>
  );
};

export default ServicesSection;
