import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Loader2, X } from 'lucide-react';
import { useGallery } from '@/hooks/useGallery';

const MOBILE_BREAKPOINT = '768px';

const HeroSection = styled.section`
  padding-top: 8rem;
  padding-bottom: 4rem;
  background: ${({ theme }) => theme.colors.secondary}4d;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
`;

const GallerySection = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.625rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ $active, theme }) => $active ? theme.gradients.hero : theme.colors.secondary};
  color: ${({ $active, theme }) => $active ? theme.colors.primaryForeground : theme.colors.foreground};

  &:hover {
    background: ${({ $active, theme }) => $active ? theme.gradients.hero : theme.colors.primary + '20'};
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const GalleryCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-4px);
  }
`;

const CardImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  height: 220px;
  cursor: pointer;
`;

const CardImageSingle = styled.div<{ $src: string }>`
  height: 220px;
  background: url(${({ $src }) => $src}) center/cover;
  cursor: pointer;
`;

const GridImage = styled.div<{ $src: string }>`
  background: url(${({ $src }) => $src}) center/cover;
`;

const MoreImages = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

const CardBody = styled.div`
  padding: 1.25rem;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.25rem;
`;

const CardCategory = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 0.5rem;
  line-height: 1.6;
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  touch-action: none;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const LightboxContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  user-select: none;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const DesktopCounter = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.875rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const Dots = styled.div`
  display: none;
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  gap: 0.5rem;
  align-items: center;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
  }
`;

const Dot = styled.div<{ $active: boolean }>`
  width: ${({ $active }) => $active ? '10px' : '7px'};
  height: ${({ $active }) => $active ? '10px' : '7px'};
  border-radius: 50%;
  background: ${({ $active }) => $active ? 'white' : 'rgba(255,255,255,0.4)'};
  transition: all 0.2s ease;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const SWIPE_THRESHOLD = 50;

const Gallery = () => {
  const { data: items = [], isLoading } = useGallery();
  const [activeCategory, setActiveCategory] = useState<string>('הכל');
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);

  const categories = ['הכל', ...Array.from(new Set(items.map(item => item.category)))];
  const filtered = activeCategory === 'הכל' ? items : items.filter(item => item.category === activeCategory);

  const openLightbox = (images: string[], index = 0) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);

  const navigateLightbox = useCallback((dir: number) => {
    setLightbox(prev => {
      if (!prev) return null;
      const newIndex = (prev.index + dir + prev.images.length) % prev.images.length;
      return { ...prev, index: newIndex };
    });
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(1);
      if (e.key === 'ArrowRight') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, navigateLightbox]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    isSwipingRef.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !lightbox) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    if (!isSwipingRef.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwipingRef.current = true;
    }

    if (isSwipingRef.current && lightbox.images.length > 1) {
      setTranslateX(dx);
    }
  }, [lightbox]);

  const handleTouchEnd = useCallback(() => {
    if (isSwipingRef.current && lightbox && lightbox.images.length > 1) {
      if (translateX > SWIPE_THRESHOLD) {
        navigateLightbox(-1);
      } else if (translateX < -SWIPE_THRESHOLD) {
        navigateLightbox(1);
      }
    }
    setTranslateX(0);
    touchStartRef.current = null;
    isSwipingRef.current = false;
  }, [translateX, navigateLightbox, lightbox]);

  return (
    <div>
      <Header />
      <main>
        <HeroSection>
          <Container>
            <HeroContent>
              <Badge>הגלריה שלנו</Badge>
              <Title $size="xl" style={{ marginTop: '1rem' }}>תמונות מהמרפאה</Title>
              <Text $color="muted" $size="lg">הצצה למרפאה, לצוות ולתוצאות הטיפולים שלנו</Text>
            </HeroContent>
          </Container>
        </HeroSection>

        <GallerySection>
          <Container>
            {isLoading ? (
              <LoadingWrapper>
                <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
              </LoadingWrapper>
            ) : items.length === 0 ? (
              <EmptyState>
                <Title $size="sm">אין תמונות עדיין</Title>
                <Text $color="muted">תמונות חדשות יופיעו כאן בקרוב</Text>
              </EmptyState>
            ) : (
              <>
                <FilterBar>
                  {categories.map((cat) => (
                    <FilterButton
                      key={cat}
                      $active={activeCategory === cat}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </FilterButton>
                  ))}
                </FilterBar>

                <GalleryGrid>
                  {filtered.map((item) => (
                    <GalleryCard key={item.id}>
                      {item.images.length === 1 ? (
                        <CardImageSingle $src={item.images[0]} onClick={() => openLightbox(item.images, 0)} />
                      ) : (
                        <CardImageGrid onClick={() => openLightbox(item.images, 0)}>
                          {item.images.slice(0, 3).map((img, i) => (
                            <GridImage key={i} $src={img} />
                          ))}
                          {item.images.length > 3 ? (
                            <MoreImages>+{item.images.length - 3}</MoreImages>
                          ) : null}
                        </CardImageGrid>
                      )}
                      <CardBody>
                        <CardCategory>{item.category}</CardCategory>
                        <CardTitle>{item.title}</CardTitle>
                        {item.description && <CardDescription>{item.description}</CardDescription>}
                      </CardBody>
                    </GalleryCard>
                  ))}
                </GalleryGrid>
              </>
            )}
          </Container>
        </GallerySection>
      </main>
      <Footer />

      {lightbox && (
        <Lightbox onClick={closeLightbox}>
          <LightboxClose onClick={closeLightbox}>
            <X size={20} />
          </LightboxClose>
          {lightbox.images.length > 1 && (
            <>
              <LightboxNav style={{ right: '1.5rem' }} onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}>
                ›
              </LightboxNav>
              <LightboxNav style={{ left: '1.5rem' }} onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}>
                ‹
              </LightboxNav>
            </>
          )}
          <LightboxContent
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={e => e.stopPropagation()}
            style={{
              transform: `translateX(${translateX}px)`,
              transition: translateX === 0 ? 'transform 0.25s ease' : 'none',
            }}
          >
            <LightboxImage
              src={lightbox.images[lightbox.index]}
              alt="תמונה"
              draggable={false}
            />
          </LightboxContent>
          {lightbox.images.length > 1 && (
            <>
              <DesktopCounter>{lightbox.index + 1} / {lightbox.images.length}</DesktopCounter>
              <Dots>
                {lightbox.images.map((_, i) => (
                  <Dot key={i} $active={i === lightbox.index} />
                ))}
              </Dots>
            </>
          )}
        </Lightbox>
      )}
    </div>
  );
};

export default Gallery;
