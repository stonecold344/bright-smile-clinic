import styled from 'styled-components';
import { Play, CheckCircle } from 'lucide-react';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.colors.muted};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  aspect-ratio: 16 / 9;
  background: ${({ theme }) => theme.colors.card};
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ContentWrapper = styled.div`
  text-align: right;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: ${({ theme }) => theme.fontSizes.base};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

const VideoSection = () => {
  // Cinematic nature video
  const youtubeVideoId = 'BHACKCNDMW8';

  const features = [
    'טיפולים מותאמים אישית לכל מטופל',
    'צוות מומחים עם ניסיון של שנים',
    'טכנולוגיה מתקדמת וציוד חדשני',
    'אווירה נעימה ומרגיעה',
  ];

  return (
    <SectionWrapper>
      <Container>
        <ContentGrid>
          <VideoWrapper>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
              title="סרטון הסבר על המרפאה"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoWrapper>
          
          <ContentWrapper>
            <Header>
              <Badge>הכירו אותנו</Badge>
              <Title $size="lg" style={{ marginTop: '1rem' }}>
                למה לבחור בנו?
              </Title>
            </Header>
            
            <Description>
              במרפאה שלנו אנו מאמינים שכל מטופל ראוי לטיפול הטוב ביותר. 
              הצוות המקצועי שלנו מחויב להעניק לכם חוויה נעימה ותוצאות מושלמות 
              בכל טיפול. צפו בסרטון וגלו מה מייחד אותנו.
            </Description>
            
            <FeaturesList>
              {features.map((feature, index) => (
                <FeatureItem key={index}>
                  <CheckCircle size={20} />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeaturesList>
          </ContentWrapper>
        </ContentGrid>
      </Container>
    </SectionWrapper>
  );
};

export default VideoSection;
