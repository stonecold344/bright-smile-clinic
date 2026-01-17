import styled from 'styled-components';
import { Phone, Calendar, ChevronDown, Sparkles, Stethoscope, Building2, Star } from 'lucide-react';
import { Button, ButtonLink, ButtonRouterLink } from '@/components/styled/Button';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text, GradientText } from '@/components/styled/Typography';
import heroImage from '@/assets/hero-dental.jpg';
const HeroWrapper = styled.section`
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
`;
const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({
  theme
}) => theme.gradients.heroOverlay};
`;
const HeroContent = styled.div`
  position: relative;
  padding-top: 6rem;
  padding-bottom: 2rem;
  width: 100%;
`;
const HeroInner = styled.div`
  max-width: 42rem;
  margin: 0 auto;
  text-align: center;
`;
const AnimatedDiv = styled.div<{
  $delay?: string;
}>`
  animation: fadeUp 0.6s ease-out forwards;
  animation-delay: ${({
  $delay
}) => $delay || '0s'};
  opacity: 0;
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
const HeroBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${({
  theme
}) => theme.colors.primary}33;
  backdrop-filter: blur(4px);
  border-radius: ${({
  theme
}) => theme.radii.full};
  color: ${({
  theme
}) => theme.colors.primaryForeground};
  font-size: ${({
  theme
}) => theme.fontSizes.sm};
  font-weight: ${({
  theme
}) => theme.fontWeights.medium};
  margin-bottom: 1.5rem;
`;
const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primaryForeground};
  line-height: 1.2;
  margin-bottom: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes['5xl']};
  }
`;
const HeroDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primaryForeground}e6;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  
  @media (min-width: ${({
  theme
}) => theme.breakpoints.sm}) {
    flex-direction: row;
  }
`;
const TrustBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
`;
const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({
  theme
}) => theme.colors.primaryForeground}cc;
`;
const TrustIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({
  theme
}) => theme.colors.primary}4d;
  border-radius: ${({
  theme
}) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
`;
const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0) translateX(-50%);
    }
    50% {
      transform: translateY(-10px) translateX(-50%);
    }
  }
`;
const HeroSection = () => {
  return <HeroWrapper>
      <HeroBackground>
        <HeroImage src={heroImage} alt="מרפאת שיניים מודרנית" />
        <HeroOverlay />
      </HeroBackground>

      <HeroContent>
        <Container>
          <HeroInner>
            <AnimatedDiv>
              
            </AnimatedDiv>

            <AnimatedDiv $delay="0.1s">
              <HeroTitle>
                חיוך בריא
                <br />
                <GradientText>לכל החיים</GradientText>
              </HeroTitle>
            </AnimatedDiv>

            <AnimatedDiv $delay="0.2s">
              <HeroDescription>
                מרפאת שיניים מקצועית המספקת טיפולי שיניים מתקדמים בסביבה נעימה ומרגיעה.
                צוות המומחים שלנו מחויב לבריאות הפה ולחיוך המושלם שלכם.
              </HeroDescription>
            </AnimatedDiv>

            <AnimatedDiv $delay="0.3s">
              <ButtonGroup>
                <ButtonLink href="tel:+972-00-000-0000" $variant="hero" $size="xl">
                  <Phone size={20} />
                  התקשרו עכשיו
                </ButtonLink>
                <ButtonRouterLink to="/appointments" $variant="heroOutline" $size="xl">
                  <Calendar size={20} />
                  קביעת תור
                </ButtonRouterLink>
              </ButtonGroup>
            </AnimatedDiv>

            <AnimatedDiv $delay="0.4s">
              <TrustBadges>
                <TrustBadge>
                  <TrustIcon><Stethoscope size={18} color="white" /></TrustIcon>
                  <span>צוות מומחים</span>
                </TrustBadge>
                <TrustBadge>
                  <TrustIcon><Building2 size={18} color="white" /></TrustIcon>
                  <span>ציוד מתקדם</span>
                </TrustBadge>
                <TrustBadge>
                  <TrustIcon><Star size={18} color="white" /></TrustIcon>
                  <span>5 כוכבים בגוגל</span>
                </TrustBadge>
              </TrustBadges>
            </AnimatedDiv>
          </HeroInner>
        </Container>
      </HeroContent>

      <ScrollIndicator>
        <ChevronDown size={32} color="rgba(255,255,255,0.6)" />
      </ScrollIndicator>
    </HeroWrapper>;
};
export default HeroSection;