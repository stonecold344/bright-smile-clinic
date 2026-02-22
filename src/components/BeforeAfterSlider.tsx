import { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  cursor: col-resize;
  user-select: none;
  box-shadow: ${({ theme }) => theme.shadows.elevated};
`;

const ImageLayer = styled.div<{ $src: string }>`
  position: absolute;
  inset: 0;
  background: url(${({ $src }) => $src}) center/cover no-repeat;
`;

const BeforeLayer = styled(ImageLayer)<{ $clipPercent: number }>`
  clip-path: inset(0 ${({ $clipPercent }) => 100 - $clipPercent}% 0 0);
  z-index: 1;
`;

const Divider = styled.div<{ $position: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $position }) => $position}%;
  transform: translateX(-50%);
  width: 3px;
  background: white;
  z-index: 2;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
`;

const Handle = styled.div<{ $position: number }>`
  position: absolute;
  top: 50%;
  left: ${({ $position }) => $position}%;
  transform: translate(-50%, -50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }
  
  &::before {
    border-width: 6px 8px 6px 0;
    border-color: transparent ${({ theme }) => theme.colors.primary} transparent transparent;
    left: 5px;
  }
  
  &::after {
    border-width: 6px 0 6px 8px;
    border-color: transparent transparent transparent ${({ theme }) => theme.colors.primary};
    right: 5px;
  }
`;

const Label = styled.span<{ $side: 'left' | 'right' }>`
  position: absolute;
  bottom: 1rem;
  ${({ $side }) => ($side === 'right' ? 'right: 1rem;' : 'left: 1rem;')}
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
`;

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = 'לפני',
  afterLabel = 'אחרי',
}: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <SliderContainer
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <ImageLayer $src={afterImage} />
      <BeforeLayer $src={beforeImage} $clipPercent={position} />
      <Divider $position={position} />
      <Handle $position={position} />
      <Label $side="right">{beforeLabel}</Label>
      <Label $side="left">{afterLabel}</Label>
    </SliderContainer>
  );
};

export default BeforeAfterSlider;
