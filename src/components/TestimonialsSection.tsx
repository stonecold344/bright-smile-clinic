import styled from 'styled-components';
import { Star, Quote, Loader2 } from 'lucide-react';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { useTestimonials } from '@/hooks/useTestimonials';

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  text-align: center;
  max-width: 42rem;
  margin: 0 auto ${({ theme }) => theme.spacing[16]};
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TestimonialCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-4px);
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  color: ${({ theme }) => theme.colors.primary}33;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  
  svg {
    color: #fbbf24;
    fill: #fbbf24;
  }
`;

const Content = styled.p`
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.gradients.hero};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.h4`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`;

const AuthorTitle = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const TestimonialsSection = () => {
  const { data: testimonials = [], isLoading } = useTestimonials();

  return (
    <SectionWrapper>
      <Container>
        <Header>
          <Badge>המלצות</Badge>
          <Title $size="lg" style={{ marginTop: '1rem' }}>
            מה הלקוחות שלנו אומרים
          </Title>
          <Text $color="muted" $size="lg">
            הצטרפו לאלפי הלקוחות המרוצים שלנו
          </Text>
        </Header>

        {isLoading ? (
          <LoadingWrapper>
            <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
          </LoadingWrapper>
        ) : (
          <TestimonialsGrid>
            {testimonials.slice(0, 4).map((testimonial) => (
              <TestimonialCard key={testimonial.id}>
                <QuoteIcon>
                  <Quote size={32} />
                </QuoteIcon>
                <Stars>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={18} />
                  ))}
                </Stars>
                <Content>{testimonial.content}</Content>
                <Author>
                  <Avatar>{testimonial.name.charAt(0)}</Avatar>
                  <AuthorInfo>
                    <AuthorName>{testimonial.name}</AuthorName>
                    {testimonial.title && <AuthorTitle>{testimonial.title}</AuthorTitle>}
                  </AuthorInfo>
                </Author>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
        )}
      </Container>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
