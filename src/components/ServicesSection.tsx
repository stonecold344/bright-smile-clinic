import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Stethoscope, Sparkles, CircleDot, Baby, AlignCenter, Smile, LucideIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { useTreatments } from '@/hooks/useTreatments';

const iconMap: Record<string, LucideIcon> = {
  'general-dentistry': Stethoscope,
  'teeth-whitening': Sparkles,
  'dental-implants': CircleDot,
  'pediatric-dentistry': Baby,
  'orthodontics': AlignCenter,
  'cosmetic-dentistry': Smile,
};

const getIcon = (slug: string) => {
  const IconComponent = iconMap[slug] || Stethoscope;
  return <IconComponent size={32} color="white" />;
};

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
  grid-auto-rows: 1fr;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ServiceCard = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 220px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  
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

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const ServicesSection = () => {
  const { data: treatments = [], isLoading } = useTreatments();

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

        {isLoading ? (
          <LoadingWrapper>
            <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
          </LoadingWrapper>
        ) : (
          <ServicesGrid>
            {treatments.map((treatment) => (
              <ServiceCard key={treatment.id} to={`/treatment/${treatment.slug}`}>
                <ServiceIcon>{getIcon(treatment.slug)}</ServiceIcon>
                <ServiceTitle>{treatment.title}</ServiceTitle>
                <ServiceDescription>{treatment.short_description}</ServiceDescription>
              </ServiceCard>
            ))}
          </ServicesGrid>
        )}

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
