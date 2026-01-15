import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Check, Clock, Banknote, ArrowLeft, Loader2 } from 'lucide-react';
import { useTreatment } from '@/hooks/useTreatments';
import heroImage from '@/assets/hero-dental.jpg';

const HeroSection = styled.section`
  position: relative;
  padding-top: 8rem;
  padding-bottom: 6rem;
  overflow: hidden;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
`;

const HeroImageStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.background},
    ${({ theme }) => theme.colors.background}e6,
    ${({ theme }) => theme.colors.background}
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
`;

const TreatmentIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem;
`;

const ContentSection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeaturesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.foreground};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

const ProcessList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  counter-reset: step;
`;

const ProcessStep = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  counter-increment: step;

  &::before {
    content: counter(step);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: ${({ theme }) => theme.gradients.hero};
    color: white;
    border-radius: ${({ theme }) => theme.radii.full};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    flex-shrink: 0;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-right: auto;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.8;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 1.5rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const NotFoundWrapper = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const TreatmentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: treatment, isLoading, error } = useTreatment(slug || '');

  if (isLoading) {
    return (
      <div>
        <Header />
        <main>
          <LoadingWrapper>
            <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
          </LoadingWrapper>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !treatment) {
    return (
      <div>
        <Header />
        <main>
          <ContentSection>
            <Container>
              <NotFoundWrapper>
                <Title $size="lg">הטיפול לא נמצא</Title>
                <Text $color="muted" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                  מצטערים, לא הצלחנו למצוא את הטיפול המבוקש.
                </Text>
                <Button as={Link} to="/services" $variant="heroPrimary" $size="lg">
                  לכל השירותים
                  <ArrowLeft size={20} />
                </Button>
              </NotFoundWrapper>
            </Container>
          </ContentSection>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main>
        <HeroSection>
          <HeroBg>
            <HeroImageStyled src={heroImage} alt={treatment.title} />
            <HeroOverlay />
          </HeroBg>
          <Container>
            <HeroContent>
              <TreatmentIcon>{treatment.icon}</TreatmentIcon>
              <Badge>טיפולי שיניים</Badge>
              <Title $size="xl" style={{ marginTop: '1rem' }}>
                {treatment.title}
              </Title>
              <Text $color="muted" $size="lg">
                {treatment.short_description}
              </Text>
            </HeroContent>
          </Container>
        </HeroSection>

        <ContentSection>
          <Container>
            <ContentGrid>
              <MainContent>
                {treatment.full_description && (
                  <Description>{treatment.full_description}</Description>
                )}

                {treatment.features && treatment.features.length > 0 && (
                  <>
                    <SectionTitle>מה כולל הטיפול?</SectionTitle>
                    <Card style={{ marginBottom: '2rem' }}>
                      <FeaturesList>
                        {treatment.features.map((feature, index) => (
                          <FeatureItem key={index}>
                            <Check size={20} />
                            {feature}
                          </FeatureItem>
                        ))}
                      </FeaturesList>
                    </Card>
                  </>
                )}

                {treatment.process_steps && treatment.process_steps.length > 0 && (
                  <>
                    <SectionTitle>תהליך הטיפול</SectionTitle>
                    <Card>
                      <ProcessList>
                        {treatment.process_steps.map((step, index) => (
                          <ProcessStep key={index}>{step}</ProcessStep>
                        ))}
                      </ProcessList>
                    </Card>
                  </>
                )}
              </MainContent>

              <Sidebar>
                <Card>
                  <CardTitle>פרטי הטיפול</CardTitle>
                  {treatment.duration && (
                    <InfoRow>
                      <Clock size={20} />
                      <InfoLabel>משך הטיפול:</InfoLabel>
                      <InfoValue>{treatment.duration}</InfoValue>
                    </InfoRow>
                  )}
                  {treatment.price_range && (
                    <InfoRow>
                      <Banknote size={20} />
                      <InfoLabel>טווח מחירים:</InfoLabel>
                      <InfoValue>{treatment.price_range}</InfoValue>
                    </InfoRow>
                  )}
                </Card>

                {treatment.benefits && treatment.benefits.length > 0 && (
                  <Card>
                    <CardTitle>יתרונות הטיפול</CardTitle>
                    <FeaturesList>
                      {treatment.benefits.map((benefit, index) => (
                        <FeatureItem key={index}>
                          <Check size={18} />
                          {benefit}
                        </FeatureItem>
                      ))}
                    </FeaturesList>
                  </Card>
                )}

                <Button as={Link} to="/appointments" $variant="heroPrimary" $size="lg" $fullWidth>
                  לקביעת תור
                  <ArrowLeft size={20} />
                </Button>
              </Sidebar>
            </ContentGrid>
          </Container>
        </ContentSection>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default TreatmentPage;
