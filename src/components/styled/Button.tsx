import styled, { css } from 'styled-components';

type ButtonVariant = 'default' | 'hero' | 'heroPrimary' | 'heroOutline' | 'call' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'default' | 'lg' | 'xl';

interface ButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}

const sizeStyles = {
  sm: css`
    height: 2.25rem;
    padding: 0 0.75rem;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    border-radius: ${({ theme }) => theme.radii.md};
  `,
  default: css`
    height: 2.5rem;
    padding: 0 1rem;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    border-radius: ${({ theme }) => theme.radii.lg};
  `,
  lg: css`
    height: 3rem;
    padding: 0 2rem;
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: ${({ theme }) => theme.radii.lg};
  `,
  xl: css`
    height: 3.5rem;
    padding: 0 2.5rem;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    border-radius: ${({ theme }) => theme.radii.xl};
  `,
};

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
    box-shadow: ${({ theme }) => theme.shadows.soft};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary}e6;
      box-shadow: ${({ theme }) => theme.shadows.card};
    }
  `,
  hero: css`
    background: ${({ theme }) => theme.gradients.cta};
    color: ${({ theme }) => theme.colors.primaryForeground};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    
    &:hover {
      transform: scale(1.05);
      box-shadow: ${({ theme }) => theme.shadows.card};
    }
  `,
  heroPrimary: css`
    background: ${({ theme }) => theme.gradients.hero};
    color: ${({ theme }) => theme.colors.primaryForeground};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    box-shadow: ${({ theme }) => theme.shadows.card};
    
    &:hover {
      transform: scale(1.05);
      box-shadow: ${({ theme }) => theme.shadows.elevated};
    }
  `,
  heroOutline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primaryForeground};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    border: 2px solid ${({ theme }) => theme.colors.primaryForeground};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primaryForeground}1a;
    }
  `,
  call: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    box-shadow: ${({ theme }) => theme.shadows.card};
    
    &:hover {
      transform: scale(1.05);
      box-shadow: ${({ theme }) => theme.shadows.elevated};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.foreground};
    
    &:hover {
      background: ${({ theme }) => theme.colors.accent}1a;
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.foreground};
    border: 1px solid ${({ theme }) => theme.colors.border};
    
    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  border: none;
  
  ${({ $size = 'default' }) => sizeStyles[$size]}
  ${({ $variant = 'default' }) => variantStyles[$variant]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const ButtonLink = styled.a<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  border: none;
  text-decoration: none;
  
  ${({ $size = 'default' }) => sizeStyles[$size]}
  ${({ $variant = 'default' }) => variantStyles[$variant]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;
