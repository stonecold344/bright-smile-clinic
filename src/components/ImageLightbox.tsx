import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
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
`;

const Counter = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.875rem;
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
  &:hover { background: rgba(255,255,255,0.3); }
`;

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const isPdf = (url: string) => url.toLowerCase().endsWith('.pdf');

const ImageLightbox = ({ images, initialIndex, onClose }: ImageLightboxProps) => {
  const [index, setIndex] = useState(initialIndex);

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

  const currentUrl = images[index];

  return (
    <Overlay onClick={onClose}>
      {isPdf(currentUrl) ? (
        <iframe
          src={currentUrl}
          title={`PDF ${index + 1}`}
          onClick={e => e.stopPropagation()}
          style={{ width: '85vw', height: '85vh', border: 'none', borderRadius: '8px', background: 'white' }}
        />
      ) : (
        <img
          src={currentUrl}
          alt={`תמונה ${index + 1}`}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }}
        />
      )}
      <CloseBtn onClick={onClose}><X size={20} /></CloseBtn>
      <OpenLink href={currentUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
        <ExternalLink size={18} />
      </OpenLink>
      {images.length > 1 && (
        <>
          <NavBtn $side="right" onClick={e => { e.stopPropagation(); prev(); }}><ChevronRight size={24} /></NavBtn>
          <NavBtn $side="left" onClick={e => { e.stopPropagation(); next(); }}><ChevronLeft size={24} /></NavBtn>
          <Counter>{index + 1} / {images.length}</Counter>
        </>
      )}
    </Overlay>
  );
};

export default ImageLightbox;
