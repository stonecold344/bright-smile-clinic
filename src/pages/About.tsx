import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Award, Users, Clock, Heart, Shield, Target, Stethoscope, GraduationCap } from 'lucide-react';
import teamImage from '@/assets/dental-team.jpg';
import heroImage from '@/assets/hero-dental.jpg';

const teamMembers = [
  {
    name: 'ד״ר יוסף כהן',
    role: 'רופא שיניים ראשי',
    specialization: 'התמחות באורתודנטיה',
    experience: '15 שנות ניסיון',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'ד״ר מיכל לוי',
    role: 'רופאת שיניים',
    specialization: 'התמחות בהשתלות',
    experience: '12 שנות ניסיון',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'ד״ר דוד ישראלי',
    role: 'רופא שיניים',
    specialization: 'התמחות באנדודונטיה',
    experience: '10 שנות ניסיון',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'ד״ר שרה אברהם',
    role: 'רופאת שיניים',
    specialization: 'התמחות בפריודונטיה',
    experience: '8 שנות ניסיון',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
  },
];

const values = [
  { icon: Heart, title: 'אכפתיות', description: 'אנו מתייחסים לכל מטופל כאל משפחה ומספקים טיפול אישי ואכפתי.' },
  { icon: Shield, title: 'מקצועיות', description: 'צוות מומחים עם הכשרה מתקדמת וניסיון רב בתחום רפואת השיניים.' },
  { icon: Target, title: 'חדשנות', description: 'שימוש בטכנולוגיות המתקדמות ביותר לתוצאות מעולות.' },
];

const stats = [
  { icon: Users, value: '5,000+', label: 'מטופלים מרוצים' },
  { icon: Award, value: '15+', label: 'שנות ניסיון' },
  { icon: Clock, value: '24/7', label: 'זמינות לחירום' },
];

const HeroSection = styled.section`position: relative; padding-top: 8rem; padding-bottom: 6rem; overflow: hidden;`;
const HeroBg = styled.div`position: absolute; inset: 0;`;
const HeroImageStyled = styled.img`width: 100%; height: 100%; object-fit: cover; opacity: 0.2;`;
const HeroOverlay = styled.div`position: absolute; inset: 0; background: linear-gradient(to bottom, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.background}e6, ${({ theme }) => theme.colors.background});`;
const HeroContent = styled.div`position: relative; z-index: 10; text-align: center; max-width: 48rem; margin: 0 auto;`;
const AboutSection = styled.section`padding: ${({ theme }) => theme.spacing[24]} 0; background: ${({ theme }) => theme.colors.secondary}4d;`;
const AboutGrid = styled.div`display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { grid-template-columns: 1fr 1fr; }`;
const ImageContainer = styled.div`border-radius: ${({ theme }) => theme.radii['3xl']}; overflow: hidden; box-shadow: ${({ theme }) => theme.shadows.elevated};`;
const Image = styled.img`width: 100%; height: auto;`;
const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem;`;
const StatCard = styled.div`text-align: center; padding: 1rem; background: ${({ theme }) => theme.colors.card}; border-radius: ${({ theme }) => theme.radii.xl}; box-shadow: ${({ theme }) => theme.shadows.soft};`;
const StatIcon = styled.div`color: ${({ theme }) => theme.colors.primary}; margin: 0 auto 0.5rem;`;
const StatValue = styled.p`font-size: ${({ theme }) => theme.fontSizes['2xl']}; font-weight: ${({ theme }) => theme.fontWeights.bold}; color: ${({ theme }) => theme.colors.foreground}; margin: 0;`;
const StatLabel = styled.p`font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.mutedForeground}; margin: 0;`;
const ValuesSection = styled.section`padding: ${({ theme }) => theme.spacing[24]} 0; background: ${({ theme }) => theme.colors.background};`;
const ValuesHeader = styled.div`text-align: center; max-width: 42rem; margin: 0 auto ${({ theme }) => theme.spacing[16]};`;
const ValuesGrid = styled.div`display: grid; grid-template-columns: 1fr; gap: 2rem; @media (min-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: repeat(3, 1fr); }`;
const ValueCard = styled.div`text-align: center; padding: ${({ theme }) => theme.spacing[8]}; background: ${({ theme }) => theme.colors.card}; border-radius: ${({ theme }) => theme.radii['2xl']}; box-shadow: ${({ theme }) => theme.shadows.soft}; transition: all ${({ theme }) => theme.transitions.normal}; &:hover { box-shadow: ${({ theme }) => theme.shadows.elevated}; }`;
const ValueIcon = styled.div`width: 4rem; height: 4rem; background: ${({ theme }) => theme.gradients.hero}; border-radius: ${({ theme }) => theme.radii['2xl']}; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; svg { color: ${({ theme }) => theme.colors.primaryForeground}; }`;
const ValueTitle = styled.h3`font-size: ${({ theme }) => theme.fontSizes.xl}; font-weight: ${({ theme }) => theme.fontWeights.bold}; color: ${({ theme }) => theme.colors.foreground}; margin-bottom: 0.75rem;`;
const ValueDescription = styled.p`color: ${({ theme }) => theme.colors.mutedForeground}; line-height: 1.7;`;

const TeamSection = styled.section`padding: ${({ theme }) => theme.spacing[24]} 0; background: ${({ theme }) => theme.colors.background};`;
const TeamHeader = styled.div`text-align: center; max-width: 42rem; margin: 0 auto ${({ theme }) => theme.spacing[16]};`;
const TeamGrid = styled.div`display: grid; grid-template-columns: 1fr; gap: 2rem; @media (min-width: ${({ theme }) => theme.breakpoints.sm}) { grid-template-columns: repeat(2, 1fr); } @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { grid-template-columns: repeat(4, 1fr); }`;
const TeamCard = styled.div`text-align: center; padding: ${({ theme }) => theme.spacing[6]}; background: ${({ theme }) => theme.colors.card}; border-radius: ${({ theme }) => theme.radii['2xl']}; box-shadow: ${({ theme }) => theme.shadows.soft}; transition: all ${({ theme }) => theme.transitions.normal}; &:hover { box-shadow: ${({ theme }) => theme.shadows.elevated}; transform: translateY(-4px); }`;
const TeamAvatar = styled.div`width: 5rem; height: 5rem; border-radius: ${({ theme }) => theme.radii.full}; overflow: hidden; margin: 0 auto 1rem; box-shadow: ${({ theme }) => theme.shadows.soft}; img { width: 100%; height: 100%; object-fit: cover; }`;
const TeamName = styled.h3`font-size: ${({ theme }) => theme.fontSizes.lg}; font-weight: ${({ theme }) => theme.fontWeights.bold}; color: ${({ theme }) => theme.colors.foreground}; margin-bottom: 0.25rem;`;
const TeamRole = styled.p`font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.primary}; font-weight: ${({ theme }) => theme.fontWeights.medium}; margin-bottom: 0.75rem;`;
const TeamInfo = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`;
const TeamInfoItem = styled.span`font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.mutedForeground}; display: flex; align-items: center; justify-content: center; gap: 0.5rem;`;

const About = () => (
  <div>
    <Header />
    <main>
      <HeroSection>
        <HeroBg><HeroImageStyled src={heroImage} alt="מרפאת שיניים" /><HeroOverlay /></HeroBg>
        <Container><HeroContent><Badge>אודותינו</Badge><Title $size="xl" style={{ marginTop: '1rem' }}>מכירים את הצוות שלנו</Title><Text $color="muted" $size="lg">מרפאת שיניים מובילה עם צוות מומחים מסור</Text></HeroContent></Container>
      </HeroSection>
      <AboutSection>
        <Container>
          <AboutGrid>
            <ImageContainer><Image src={teamImage} alt="צוות מרפאת השיניים" /></ImageContainer>
            <div>
              <Title $size="lg">הסיפור שלנו</Title>
              <Text $color="muted" $size="lg" style={{ marginBottom: '1.5rem' }}>מרפאת השיניים שלנו נוסדה מתוך חזון לספק טיפולי שיניים איכותיים בסביבה נעימה ומרגיעה.</Text>
              <StatsGrid>{stats.map((stat, i) => (<StatCard key={i}><StatIcon><stat.icon size={32} /></StatIcon><StatValue>{stat.value}</StatValue><StatLabel>{stat.label}</StatLabel></StatCard>))}</StatsGrid>
            </div>
          </AboutGrid>
        </Container>
      </AboutSection>
      <TeamSection>
        <Container>
          <TeamHeader>
            <Badge>הצוות שלנו</Badge>
            <Title $size="lg" style={{ marginTop: '1rem' }}>הכירו את הרופאים</Title>
            <Text $color="muted" style={{ marginTop: '0.5rem' }}>צוות מומחים מנוסה ומסור לבריאות הפה שלכם</Text>
          </TeamHeader>
          <TeamGrid>
            {teamMembers.map((member, i) => (
              <TeamCard key={i}>
                <TeamAvatar><img src={member.image} alt={member.name} /></TeamAvatar>
                <TeamName>{member.name}</TeamName>
                <TeamRole>{member.role}</TeamRole>
                <TeamInfo>
                  <TeamInfoItem><GraduationCap size={14} />{member.specialization}</TeamInfoItem>
                  <TeamInfoItem><Clock size={14} />{member.experience}</TeamInfoItem>
                </TeamInfo>
              </TeamCard>
            ))}
          </TeamGrid>
        </Container>
      </TeamSection>
      <ValuesSection>
        <Container>
          <ValuesHeader><Badge>הערכים שלנו</Badge><Title $size="lg" style={{ marginTop: '1rem' }}>מה מנחה אותנו</Title></ValuesHeader>
          <ValuesGrid>{values.map((v, i) => (<ValueCard key={i}><ValueIcon><v.icon size={32} /></ValueIcon><ValueTitle>{v.title}</ValueTitle><ValueDescription>{v.description}</ValueDescription></ValueCard>))}</ValuesGrid>
        </Container>
      </ValuesSection>
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default About;
