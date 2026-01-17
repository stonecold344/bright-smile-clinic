import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 2rem;
  }
`;

export const Section = styled.section<{ $bg?: 'default' | 'secondary' | 'primary' }>`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  
  ${({ $bg, theme }) => {
    switch ($bg) {
      case 'secondary':
        return `background: ${theme.colors.secondary}4d;`;
      case 'primary':
        return `background: ${theme.gradients.hero};`;
      default:
        return `background: ${theme.colors.background};`;
    }
  }}
`;

export const Grid = styled.div<{ $cols?: number; $gap?: string }>`
  display: grid;
  gap: ${({ $gap }) => $gap || '2rem'};
  grid-template-columns: 1fr;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(${({ $cols }) => Math.min($cols || 2, 2)}, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(${({ $cols }) => $cols || 3}, 1fr);
  }
`;

export const Flex = styled.div<{ 
  $direction?: 'row' | 'column';
  $align?: string;
  $justify?: string;
  $gap?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'row'};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  gap: ${({ $gap }) => $gap || '0'};
  ${({ $wrap }) => $wrap && 'flex-wrap: wrap;'}
`;

export const Card = styled.div<{ $hover?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  ${({ $hover, theme }) => $hover && `
    &:hover {
      box-shadow: ${theme.shadows.elevated};
      transform: translateY(-0.5rem);
    }
  `}
`;

export const Badge = styled.span<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-block;
  padding: 0.625rem 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.025em;
  border-radius: ${({ theme }) => theme.radii.full};
  text-transform: uppercase;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background: ${theme.colors.primaryForeground}33;
          color: ${theme.colors.primaryForeground};
          border: 1px solid ${theme.colors.primaryForeground}44;
        `;
      default:
        return `
          background: linear-gradient(135deg, ${theme.colors.primary}22, ${theme.colors.secondary}33);
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary}33;
          box-shadow: 0 2px 8px ${theme.colors.primary}15;
        `;
    }
  }}
`;
