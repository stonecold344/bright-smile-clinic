import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Star, Quote, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  text-align: center;
  max-width: 42rem;
  margin: 0 auto ${({ theme }) => theme.spacing[16]};
`;

// Desktop Grid
const TestimonialsGrid = styled.div`
  display: none;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// Mobile Carousel
const CarouselWrapper = styled.div`
  display: block;
  position: relative;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const CarouselViewport = styled.div`
  overflow: hidden;
  margin: 0 -1rem;
  padding: 0 1rem;
`;

const CarouselContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const CarouselSlide = styled.div`
  flex: 0 0 85%;
  min-width: 0;
  padding-left: 0.5rem;
  
  &:first-child {
    padding-left: 0;
  }
`;

const CarouselNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const NavButton = styled.button<{ $disabled?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.primary}dd;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const CarouselDots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  border: none;
  background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}80;
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
  height: 320px;
  cursor: pointer;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-4px);
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  flex-shrink: 0;
  
  svg {
    color: #fbbf24;
    fill: #fbbf24;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Content = styled.p`
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.7;
  font-size: ${({ theme }) => theme.fontSizes.base};
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`;

const ReadMoreButton = styled.button`
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
  flex-shrink: 0;
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

const AuthorInfo = styled.div`
  min-width: 0;
`;

const AuthorName = styled.h4`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`;

const AuthorTitle = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

// Modal animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const scaleOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
`;

const ModalOverlay = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  cursor: pointer;
  animation: ${({ $isClosing }) => $isClosing ? css`${fadeOut} 0.2s ease-out forwards` : css`${fadeIn} 0.2s ease-out forwards`};
`;

const ModalContainer = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: calc(100% - 2rem);
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1001;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: ${({ $isClosing }) => $isClosing ? css`${scaleOut} 0.2s ease-out forwards` : css`${scaleIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards`};
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: hsl(var(--muted));
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  color: hsl(var(--muted-foreground));
  
  &:hover {
    background: hsl(var(--muted-foreground) / 0.2);
    transform: scale(1.1);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ModalAvatar = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ModalAuthorInfo = styled.div``;

const ModalAuthorName = styled.h3`
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  font-size: 1.125rem;
`;

const ModalAuthorTitle = styled.p`
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  margin: 0;
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

const ModalContentText = styled.p`
  color: hsl(var(--foreground));
  line-height: 1.8;
  font-size: 1rem;
  white-space: pre-wrap;
  margin: 0;
`;

const ModalQuoteIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: hsl(var(--primary) / 0.15);
`;

const MAX_CONTENT_LENGTH = 100;

interface TestimonialCardComponentProps {
  testimonial: Testimonial;
  onOpenModal: (testimonial: Testimonial) => void;
  isContentLong: boolean;
}

const TestimonialCardComponent = ({ testimonial, onOpenModal, isContentLong }: TestimonialCardComponentProps) => (
  <TestimonialCard onClick={() => onOpenModal(testimonial)}>
    <CardContent>
      <QuoteIcon>
        <Quote size={32} />
      </QuoteIcon>
      <Stars>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={18} />
        ))}
      </Stars>
      <ContentWrapper>
        <Content>{testimonial.content}</Content>
        {isContentLong && <ReadMoreButton>קרא עוד</ReadMoreButton>}
      </ContentWrapper>
    </CardContent>
    <Author>
      <Avatar>{testimonial.name.charAt(0)}</Avatar>
      <AuthorInfo>
        <AuthorName>{testimonial.name}</AuthorName>
        {testimonial.title && <AuthorTitle>{testimonial.title}</AuthorTitle>}
      </AuthorInfo>
    </Author>
  </TestimonialCard>
);

const TestimonialsSection = () => {
  const { data: testimonials = [], isLoading } = useTestimonials();
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: 'rtl', align: 'start' },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const isContentLong = (content: string) => content.length > MAX_CONTENT_LENGTH;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedTestimonial(null);
      setIsClosing(false);
    }, 200);
  };

  const handleOpenModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsClosing(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedTestimonial) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedTestimonial]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTestimonial) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedTestimonial]);

  const displayedTestimonials = testimonials.slice(0, 4);

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
            <>
              {/* Desktop Grid */}
              <TestimonialsGrid>
                {displayedTestimonials.map((testimonial) => (
                  <TestimonialCardComponent
                    key={testimonial.id}
                    testimonial={testimonial}
                    onOpenModal={handleOpenModal}
                    isContentLong={isContentLong(testimonial.content)}
                  />
                ))}
              </TestimonialsGrid>

              {/* Mobile Carousel */}
              <CarouselWrapper>
                <CarouselViewport ref={emblaRef}>
                  <CarouselContainer>
                    {displayedTestimonials.map((testimonial) => (
                      <CarouselSlide key={testimonial.id}>
                        <TestimonialCardComponent
                          testimonial={testimonial}
                          onOpenModal={handleOpenModal}
                          isContentLong={isContentLong(testimonial.content)}
                        />
                      </CarouselSlide>
                    ))}
                  </CarouselContainer>
                </CarouselViewport>
                
                <CarouselNav>
                  <NavButton onClick={scrollNext} aria-label="הבא">
                    <ChevronRight size={20} />
                  </NavButton>
                  <CarouselDots>
                    {displayedTestimonials.map((_, index) => (
                      <Dot
                        key={index}
                        $active={index === selectedIndex}
                        onClick={() => scrollTo(index)}
                        aria-label={`עבור להמלצה ${index + 1}`}
                      />
                    ))}
                  </CarouselDots>
                  <NavButton onClick={scrollPrev} aria-label="הקודם">
                    <ChevronLeft size={20} />
                  </NavButton>
                </CarouselNav>
              </CarouselWrapper>
            </>
          )}
        </Container>
      </SectionWrapper>

      {selectedTestimonial && (
        <>
          <ModalOverlay $isClosing={isClosing} onClick={handleCloseModal} />
          <ModalContainer $isClosing={isClosing}>
            <ModalCloseButton onClick={handleCloseModal} aria-label="סגור">
              <X size={16} />
            </ModalCloseButton>
            <ModalQuoteIcon>
              <Quote size={48} />
            </ModalQuoteIcon>
            <ModalHeader>
              <ModalAvatar>{selectedTestimonial.name.charAt(0)}</ModalAvatar>
              <ModalAuthorInfo>
                <ModalAuthorName>{selectedTestimonial.name}</ModalAuthorName>
                {selectedTestimonial.title && (
                  <ModalAuthorTitle>{selectedTestimonial.title}</ModalAuthorTitle>
                )}
              </ModalAuthorInfo>
            </ModalHeader>
            <ModalStars>
              {Array.from({ length: selectedTestimonial.rating }).map((_, i) => (
                <Star key={i} size={20} />
              ))}
            </ModalStars>
            <ModalContentText>{selectedTestimonial.content}</ModalContentText>
          </ModalContainer>
        </>
      )}
    </>
  );
};

export default TestimonialsSection;
