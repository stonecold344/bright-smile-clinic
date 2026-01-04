import styled from 'styled-components';

export const Title = styled.h1<{ $size?: 'sm' | 'md' | 'lg' | 'xl'; $color?: 'default' | 'primary' | 'light' }>`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `font-size: ${theme.fontSizes['2xl']};`;
      case 'md':
        return `font-size: ${theme.fontSizes['3xl']};`;
      case 'lg':
        return `
          font-size: ${theme.fontSizes['3xl']};
          @media (min-width: ${theme.breakpoints.md}) {
            font-size: ${theme.fontSizes['4xl']};
          }
        `;
      case 'xl':
      default:
        return `
          font-size: ${theme.fontSizes['4xl']};
          @media (min-width: ${theme.breakpoints.md}) {
            font-size: ${theme.fontSizes['5xl']};
          }
          @media (min-width: ${theme.breakpoints.lg}) {
            font-size: ${theme.fontSizes['6xl']};
          }
        `;
    }
  }}
  
  ${({ $color, theme }) => {
    switch ($color) {
      case 'primary':
        return `color: ${theme.colors.primary};`;
      case 'light':
        return `color: ${theme.colors.primaryForeground};`;
      default:
        return `color: ${theme.colors.foreground};`;
    }
  }}
`;

export const Subtitle = styled.h2<{ $color?: 'default' | 'muted' | 'light' }>`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.6;
  margin-bottom: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
  
  ${({ $color, theme }) => {
    switch ($color) {
      case 'muted':
        return `color: ${theme.colors.mutedForeground};`;
      case 'light':
        return `color: ${theme.colors.primaryForeground}e6;`;
      default:
        return `color: ${theme.colors.foreground};`;
    }
  }}
`;

export const Text = styled.p<{ $color?: 'default' | 'muted' | 'light'; $size?: 'sm' | 'base' | 'lg' }>`
  line-height: 1.7;
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `font-size: ${theme.fontSizes.sm};`;
      case 'lg':
        return `font-size: ${theme.fontSizes.lg};`;
      default:
        return `font-size: ${theme.fontSizes.base};`;
    }
  }}
  
  ${({ $color, theme }) => {
    switch ($color) {
      case 'muted':
        return `color: ${theme.colors.mutedForeground};`;
      case 'light':
        return `color: ${theme.colors.primaryForeground}e6;`;
      default:
        return `color: ${theme.colors.foreground};`;
    }
  }}
`;

export const GradientText = styled.span`
  background: ${({ theme }) => theme.gradients.hero};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
