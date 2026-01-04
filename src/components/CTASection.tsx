import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Container } from '@/components/styled/Layout';

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.gradients.hero};
  position: relative;
  overflow: hidden;
`;

const DecorativeCircle = styled.div<{ $position: 'top-left' | 'bottom-right' }>`
  position: absolute;
  background: ${({ theme }) => theme.colors.primaryForeground}1a;
  border-radius: 50%;
  filter: blur(60px);
  
  ${({ $position }) => $position === 'top-left' ? `
    top: 0;
    left: 0;
    width: 16rem;
    height: 16rem;
  ` : `
    bottom: 0;
    right: 0;
    width: 24rem;
    height: 24rem;
  `}
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.primaryForeground}33;
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primaryForeground};
  margin-bottom: 1.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes['5xl']};
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primaryForeground}e6;
  line-height: 1.7;
  margin-bottom: 2.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
  }
`;

const TrustElements = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primaryForeground}cc;
`;

const CheckIcon = styled.span`
  font-size: 1.5rem;
`;

const CTASection = () => {
  return (
    <SectionWrapper>
      <DecorativeCircle $position="top-left" />
      <DecorativeCircle $position="bottom-right" />

      <Container>
        <Content>
          <Badge>📞 התקשרו עכשיו</Badge>
          <Title>מוכנים לחיוך חדש?</Title>
          <Description>
            צוות המומחים שלנו מחכה לכם. קבעו תור עכשיו וקבלו ייעוץ חינם לגבי הטיפול המתאים לכם.
          </Description>

          <ButtonGroup>
            <Button as="a" href="tel:+972-00-000-0000" $variant="hero" $size="xl">
              <Phone size={20} />
              00-000-0000
            </Button>
            <Button as={Link} to="/contact" $variant="heroOutline" $size="xl">
              <Calendar size={20} />
              קביעת תור אונליין
            </Button>
          </ButtonGroup>

          <TrustElements>
            <TrustItem>
              <CheckIcon>✓</CheckIcon>
              <span>ייעוץ ראשוני חינם</span>
            </TrustItem>
            <TrustItem>
              <CheckIcon>✓</CheckIcon>
              <span>תוכניות תשלום גמישות</span>
            </TrustItem>
            <TrustItem>
              <CheckIcon>✓</CheckIcon>
              <span>אחריות מלאה</span>
            </TrustItem>
          </TrustElements>
        </Content>
      </Container>
    </SectionWrapper>
  );
};

export default CTASection;
