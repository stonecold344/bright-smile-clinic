import { useState } from 'react';
import styled from 'styled-components';
import { Star, Quote, Loader2 } from 'lucide-react';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  display: flex;
  flex-direction: column;
  min-height: 280px;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-4px);
  }
`;

const CardTop = styled.div`
  flex: 1;
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
  margin-bottom: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMore = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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
  flex-shrink: 0;
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

const ModalContent = styled.p`
  color: hsl(var(--foreground));
  line-height: 1.8;
  font-size: 1rem;
  white-space: pre-wrap;
`;

const ModalStars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  
  svg {
    color: #fbbf24;
    fill: #fbbf24;
  }
`;

const ModalAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--border));
`;

const ModalAvatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
`;

const MAX_CONTENT_LENGTH = 120;

const TestimonialsSection = () => {
  const { data: testimonials = [], isLoading } = useTestimonials();
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const isContentLong = (content: string) => content.length > MAX_CONTENT_LENGTH;

  return (
    <>
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
                  <CardTop>
                    <QuoteIcon>
                      <Quote size={32} />
                    </QuoteIcon>
                    <Stars>
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={18} />
                      ))}
                    </Stars>
                    <Content>{testimonial.content}</Content>
                    {isContentLong(testimonial.content) && (
                      <ReadMore onClick={() => setSelectedTestimonial(testimonial)}>
                        קרא עוד...
                      </ReadMore>
                    )}
                  </CardTop>
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

      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>המלצה</DialogTitle>
          </DialogHeader>
          {selectedTestimonial && (
            <>
              <ModalStars>
                {Array.from({ length: selectedTestimonial.rating }).map((_, i) => (
                  <Star key={i} size={18} />
                ))}
              </ModalStars>
              <ModalContent>{selectedTestimonial.content}</ModalContent>
              <ModalAuthor>
                <ModalAvatar>{selectedTestimonial.name.charAt(0)}</ModalAvatar>
                <div>
                  <AuthorName style={{ color: 'hsl(var(--foreground))' }}>{selectedTestimonial.name}</AuthorName>
                  {selectedTestimonial.title && (
                    <AuthorTitle style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {selectedTestimonial.title}
                    </AuthorTitle>
                  )}
                </div>
              </ModalAuthor>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestimonialsSection;
