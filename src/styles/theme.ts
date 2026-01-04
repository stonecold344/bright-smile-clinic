export const theme = {
  colors: {
    // Main colors
    background: 'hsl(200, 20%, 99%)',
    foreground: 'hsl(200, 50%, 15%)',
    
    // Card
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(200, 50%, 15%)',
    
    // Primary - Calming Teal
    primary: 'hsl(174, 62%, 45%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    primaryLight: 'hsl(174, 50%, 92%)',
    
    // Secondary
    secondary: 'hsl(200, 40%, 96%)',
    secondaryForeground: 'hsl(200, 50%, 25%)',
    
    // Muted
    muted: 'hsl(200, 20%, 96%)',
    mutedForeground: 'hsl(200, 15%, 45%)',
    
    // Accent - Warm Gold
    accent: 'hsl(38, 90%, 55%)',
    accentForeground: 'hsl(0, 0%, 100%)',
    
    // Destructive
    destructive: 'hsl(0, 84%, 60%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
    
    // Border & Input
    border: 'hsl(200, 20%, 90%)',
    input: 'hsl(200, 20%, 90%)',
    ring: 'hsl(174, 62%, 45%)',
    
    // Dental specific
    dentalTeal: 'hsl(174, 62%, 45%)',
    dentalTealLight: 'hsl(174, 50%, 92%)',
    dentalNavy: 'hsl(200, 50%, 20%)',
    dentalGold: 'hsl(38, 90%, 55%)',
    dentalMint: 'hsl(160, 40%, 95%)',
  },
  
  gradients: {
    hero: 'linear-gradient(135deg, hsl(174, 62%, 45%) 0%, hsl(190, 60%, 50%) 100%)',
    cta: 'linear-gradient(135deg, hsl(38, 90%, 55%) 0%, hsl(28, 90%, 50%) 100%)',
    heroOverlay: 'linear-gradient(to left, hsla(200, 50%, 15%, 0.8), hsla(200, 50%, 15%, 0.6), hsla(200, 50%, 15%, 0.4))',
  },
  
  shadows: {
    soft: '0 4px 20px -4px hsla(200, 50%, 20%, 0.08)',
    card: '0 8px 30px -8px hsla(200, 50%, 20%, 0.12)',
    elevated: '0 20px 50px -15px hsla(200, 50%, 20%, 0.15)',
  },
  
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  
  fonts: {
    main: "'Heebo', sans-serif",
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export type Theme = typeof theme;
