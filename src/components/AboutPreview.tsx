import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Award, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import teamImage from '@/assets/dental-team.jpg';

const stats = [
  { icon: Users, value: '5,000+', label: 'מטופלים מרוצים' },
  { icon: Award, value: '15+', label: 'שנות ניסיון' },
  { icon: Clock, value: '24/7', label: 'זמינות לחירום' },
];

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.colors.background};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii['3xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.elevated};
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, ${({ theme }) => theme.colors.foreground}33, transparent);
`;

const FloatingCard = styled.div`
  position: absolute;
  bottom: -2rem;
  left: -2rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  animation: float 6s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const FloatingCardInner = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FloatingCardIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const FloatingCardValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`;

const FloatingCardLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0;
`;

const ContentWrapper = styled.div``;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`;

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0;
`;

const AboutPreview = () => {
  return (
    <SectionWrapper>
      <Container>
        <Badge style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>אודותינו</Badge>
        <Grid>
          <ImageWrapper>
            <ImageContainer>
              <Image src={teamImage} alt="צוות מרפאת השיניים" />
              <ImageOverlay />
            </ImageContainer>
            
            <FloatingCard>
              <FloatingCardInner>
                <FloatingCardIcon><Star size={24} color="white" /></FloatingCardIcon>
                <div>
                  <FloatingCardValue>4.9/5</FloatingCardValue>
                  <FloatingCardLabel>דירוג גוגל</FloatingCardLabel>
                </div>
              </FloatingCardInner>
            </FloatingCard>
          </ImageWrapper>

          <ContentWrapper>
            <Title $size="lg" style={{ marginTop: '0' }}>
              מרפאת שיניים מובילה
              <br />
              <span style={{ color: 'hsl(174, 62%, 45%)' }}>עם צוות מומחים</span>
            </Title>
            <Text $color="muted" $size="lg" style={{ marginBottom: '1.5rem' }}>
              אנו מרפאת שיניים מתקדמת המספקת טיפולי שיניים איכותיים לכל המשפחה.
              הצוות המקצועי שלנו מחויב לספק לכם את הטיפול הטוב ביותר בסביבה נעימה ומרגיעה.
            </Text>
            <Text $color="muted" style={{ marginBottom: '2rem' }}>
              אנו משתמשים בטכנולוגיות המתקדמות ביותר ובציוד חדיש כדי להבטיח
              תוצאות מעולות ונוחות מקסימלית למטופלים שלנו.
            </Text>

            <StatsGrid>
              {stats.map((stat, index) => (
                <StatItem key={index}>
                  <StatIcon>
                    <stat.icon size={32} />
                  </StatIcon>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              ))}
            </StatsGrid>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button as={Link} to="/about" $variant="heroPrimary" $size="lg">
                קראו על הצוות שלנו
                <ArrowLeft size={20} />
              </Button>
            </div>
          </ContentWrapper>
        </Grid>
      </Container>
    </SectionWrapper>
  );
};

export default AboutPreview;
