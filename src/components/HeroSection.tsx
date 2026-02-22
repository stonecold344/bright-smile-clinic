import styled from 'styled-components';
import { Phone, Calendar, Sparkles, Stethoscope, Building2, Star } from 'lucide-react';
import { Button, ButtonLink, ButtonRouterLink } from '@/components/styled/Button';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text, GradientText } from '@/components/styled/Typography';
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
const HeroVideo = styled.video`
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
  padding-top: 7rem;
  padding-bottom: 2rem;
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 8rem;
  }
`;
const HeroInner = styled.div`
  max-width: 56rem;
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
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primaryForeground};
  line-height: 1.1;
  margin-bottom: 1.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['6xl']};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 4.5rem;
  }
`;
const HeroDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: 1.7;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
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

const CallButtonWrapper = styled.div`
  display: block;
  
  @media (min-width: ${({
  theme
}) => theme.breakpoints.md}) {
    display: none;
  }
`;
const TrustBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2.5rem;
  justify-content: center;
`;
const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;
const TrustIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => theme.colors.primary}4d;
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 3rem;
    height: 3rem;
  }
`;
const ScrollIndicator = styled.button`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
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
        <HeroVideo autoPlay muted loop playsInline>
          <source src="https://cdn.pixabay.com/video/2020/02/10/32112-391539498_large.mp4" type="video/mp4" />
        </HeroVideo>
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
                <CallButtonWrapper>
                  <ButtonLink href="tel:+972-00-000-0000" $variant="hero" $size="xl">
                    <Phone size={20} />
                    התקשרו עכשיו
                  </ButtonLink>
                </CallButtonWrapper>
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

      <ScrollIndicator onClick={() => {
      const heroHeight = document.querySelector('section')?.offsetHeight || window.innerHeight * 0.7;
      window.scrollTo({
        top: heroHeight,
        behavior: 'smooth'
      });
    }} aria-label="גלול למטה">
        
      </ScrollIndicator>
    </HeroWrapper>;
};
export default HeroSection;