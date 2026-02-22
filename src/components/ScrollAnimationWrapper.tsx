import { ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div<{ $visible: boolean; $delay?: number }>`
  opacity: 0;
  ${({ $visible, $delay = 0 }) =>
    $visible &&
    css`
      animation: ${fadeInUp} 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${$delay}s forwards;
    `}
`;

interface Props {
  children: ReactNode;
  delay?: number;
  threshold?: number;
}

const ScrollAnimationWrapper = ({ children, delay = 0, threshold = 0.15 }: Props) => {
  const { ref, isVisible } = useScrollAnimation(threshold);

  return (
    <Wrapper ref={ref} $visible={isVisible} $delay={delay}>
      {children}
    </Wrapper>
  );
};

export default ScrollAnimationWrapper;
