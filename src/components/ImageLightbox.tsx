import { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';

const MOBILE_BREAKPOINT = '768px';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 2;
  &:hover { background: rgba(255,255,255,0.3); }
`;

const NavBtn = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: 1rem;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  &:hover { background: rgba(255,255,255,0.3); }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const Counter = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.875rem;
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

const OpenLink = styled.a`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  text-decoration: none;
  z-index: 2;
  &:hover { background: rgba(255,255,255,0.3); }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  user-select: none;
`;

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const isPdf = (url: string) => url.toLowerCase().endsWith('.pdf');

const SWIPE_THRESHOLD = 50;

const ImageLightbox = ({ images, initialIndex, onClose }: ImageLightboxProps) => {
  const [index, setIndex] = useState(initialIndex);
  const [translateX, setTranslateX] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);

  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') next();
      if (e.key === 'ArrowRight') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    if (!isSwiping.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwiping.current = true;
    }

    if (isSwiping.current && images.length > 1) {
      setTranslateX(dx);
    }
  }, [images.length]);

  const handleTouchEnd = useCallback(() => {
    if (isSwiping.current && images.length > 1) {
      if (translateX > SWIPE_THRESHOLD) {
        prev();
      } else if (translateX < -SWIPE_THRESHOLD) {
        next();
      }
    }
    setTranslateX(0);
    touchStartRef.current = null;
    isSwiping.current = false;
  }, [translateX, prev, next, images.length]);

  const currentUrl = images[index];

  return (
    <Overlay onClick={onClose}>
      <ContentWrapper
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={e => e.stopPropagation()}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: translateX === 0 ? 'transform 0.25s ease' : 'none',
        }}
      >
        {isPdf(currentUrl) ? (
          <iframe
            src={currentUrl}
            title={`PDF ${index + 1}`}
            style={{ width: '85vw', height: '85vh', border: 'none', borderRadius: '8px', background: 'white', pointerEvents: 'auto' }}
          />
        ) : (
          <img
            src={currentUrl}
            alt={`תמונה ${index + 1}`}
            draggable={false}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }}
          />
        )}
      </ContentWrapper>
      <CloseBtn onClick={onClose}><X size={20} /></CloseBtn>
      <OpenLink href={currentUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
        <ExternalLink size={18} />
      </OpenLink>
      {images.length > 1 && (
        <>
          <NavBtn $side="right" onClick={e => { e.stopPropagation(); prev(); }}><ChevronRight size={24} /></NavBtn>
          <NavBtn $side="left" onClick={e => { e.stopPropagation(); next(); }}><ChevronLeft size={24} /></NavBtn>
          <DesktopCounter>{index + 1} / {images.length}</DesktopCounter>
          <Dots>
            {images.map((_, i) => (
              <Dot key={i} $active={i === index} />
            ))}
          </Dots>
        </>
      )}
    </Overlay>
  );
};

export default ImageLightbox;
