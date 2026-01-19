import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Menu, X, Smile, ChevronDown } from 'lucide-react';
import { Button, ButtonRouterLink } from '@/components/styled/Button';
import { Container } from '@/components/styled/Layout';
import ServicesDropdown from '@/components/ServicesDropdown';
import { useTreatments } from '@/hooks/useTreatments';
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 50;
  background: ${({
  theme
}) => theme.colors.card}f2;
  backdrop-filter: blur(12px);
  box-shadow: ${({
  theme
}) => theme.shadows.soft};
`;
const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5.5rem;
  position: relative;
  gap: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 0.5rem;
  }
`;
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: ${({
  theme
}) => theme.breakpoints.md}) {
    position: static;
  }
`;
const MobileCenterTitle = styled.div`
  display: none;
  
  @media (max-width: ${({
  theme
}) => theme.breakpoints.md}) {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    
    h1 {
      font-size: ${({
  theme
}) => theme.fontSizes.lg};
      font-weight: ${({
  theme
}) => theme.fontWeights.bold};
      color: ${({
  theme
}) => theme.colors.primary};
      margin: 0;
      white-space: nowrap;
    }
  }
`;
const LogoIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: ${({
  theme
}) => theme.gradients.hero};
  border-radius: ${({
  theme
}) => theme.radii.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
`;
const LogoText = styled.div`
  display: none;
  
  @media (min-width: ${({
  theme
}) => theme.breakpoints.md}) {
    display: block;
  }
`;
const LogoTitle = styled.h1<{
  $scrolled?: boolean;
}>`
  font-size: ${({
  theme
}) => theme.fontSizes['2xl']};
  font-weight: ${({
  theme
}) => theme.fontWeights.bold};
  color: ${({
  $scrolled,
  theme
}) => $scrolled ? theme.colors.primary : 'white'};
  margin: 0;
  transition: color 0.3s ease;
`;
const LogoSubtitle = styled.p<{
  $scrolled?: boolean;
}>`
  font-size: ${({
  theme
}) => theme.fontSizes.xs};
  color: ${({
  $scrolled
}) => $scrolled ? 'hsl(var(--muted-foreground))' : 'white'};
  margin: 0;
  display: none;
  transition: color 0.3s ease;
  
  @media (min-width: ${({
  theme
}) => theme.breakpoints.sm}) {
    display: block;
    font-size: ${({
  theme
}) => theme.fontSizes.sm};
  }
`;
const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 1rem;
  }
`;
const NavLink = styled(Link)<{
  $active?: boolean;
  $scrolled?: boolean;
}>`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, $scrolled, theme }) => 
    $active ? theme.colors.primary : $scrolled ? theme.colors.foreground : 'white'};
  transition: color 0.3s ease;
  padding-bottom: 0.25rem;
  border-bottom: ${({ $active, theme }) => 
    $active ? `2px solid ${theme.colors.primary}` : '2px solid transparent'};
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;
const CTAWrapper = styled.div`
  display: none;
  flex-shrink: 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 0.5rem;
  }
`;
const MobileMenuButton = styled.button`
  display: flex;
  padding: 0.5rem;
  color: ${({
  theme
}) => theme.colors.primary};
  
  @media (min-width: ${({
  theme
}) => theme.breakpoints.md}) {
    display: none;
  }
`;
const MobileNav = styled.nav`
  background: ${({
  theme
}) => theme.colors.card};
  border-top: 1px solid ${({
  theme
}) => theme.colors.border};
  animation: fadeIn 0.3s ease-out;
  max-height: calc(100vh - 5.5rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @media (min-width: ${({
  theme
}) => theme.breakpoints.md}) {
    display: none;
  }
`;
const MobileNavInner = styled.div`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const MobileNavLink = styled(Link)<{
  $active?: boolean;
}>`
  font-size: ${({
  theme
}) => theme.fontSizes.lg};
  font-weight: ${({
  theme
}) => theme.fontWeights.medium};
  padding: 0.5rem 0;
  color: ${({
  $active,
  theme
}) => $active ? theme.colors.primary : theme.colors.foreground};
  transition: color ${({
  theme
}) => theme.transitions.normal};
`;
const MobileSubMenu = styled.div`
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const MobileSubMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({
  theme
}) => theme.fontSizes.base};
  color: ${({
  theme
}) => theme.colors.mutedForeground};
  padding: 0.5rem 0;
  transition: color ${({
  theme
}) => theme.transitions.normal};

  &:hover {
    color: ${({
  theme
}) => theme.colors.primary};
  }
`;
const MobileDropdownTrigger = styled.button<{
  $active?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({
  theme
}) => theme.fontSizes.lg};
  font-weight: ${({
  theme
}) => theme.fontWeights.medium};
  padding: 0.5rem 0;
  color: ${({
  $active,
  theme
}) => $active ? theme.colors.primary : theme.colors.foreground};
  background: transparent;
  width: 100%;
  text-align: right;

  svg {
    transition: transform ${({
  theme
}) => theme.transitions.normal};
  }

  &[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }
`;
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const {
    data: treatments = []
  } = useTreatments();

  // Stabilize background detection to prevent flicker
  const lastBgIsLightRef = useRef<boolean | null>(null);
  const pendingBgIsLightRef = useRef<{
    value: boolean;
    since: number;
  } | null>(null);

  // Detect if header is over a light/dark background
  useEffect(() => {
    let rafId = 0;
    const parseRgb = (rgb: string) => {
      const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3])
      };
    };
    const luminanceFromRgb = ({
      r,
      g,
      b
    }: {
      r: number;
      g: number;
      b: number;
    }) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const getIsLightFromElement = (element: Element, fallback: boolean): boolean | null => {
      // If we're over an actual image/video/canvas, assume "dark" for readability.
      if (element instanceof HTMLImageElement || element instanceof HTMLVideoElement || element instanceof HTMLCanvasElement) {
        return false;
      }
      let current: Element | null = element;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);

        // Gradients / background images: treat as dark to keep header stable
        const bgImage = style.backgroundImage;
        if (bgImage && bgImage !== 'none') return false;
        const bg = style.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          const parsed = parseRgb(bg);
          if (!parsed) return null;
          const l = luminanceFromRgb(parsed);
          if (l >= 0.58) return true;
          if (l <= 0.42) return false;
          return fallback;
        }
        current = current.parentElement;
      }

      // No decisive background found on this element chain.
      return null;
    };
    const isLightAtPoint = (x: number, y: number, headerEl: HTMLElement | null, fallback: boolean) => {
      const stack = document.elementsFromPoint(x, y);
      const candidates = headerEl ? stack.filter(el => !headerEl.contains(el)) : stack;
      for (const el of candidates) {
        const v = getIsLightFromElement(el as Element, fallback);
        if (v !== null) return v;
      }

      // Final fallback: use body background
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const parsed = parseRgb(bodyBg);
      if (!parsed) return fallback;
      const l = luminanceFromRgb(parsed);
      if (l >= 0.58) return true;
      if (l <= 0.42) return false;
      return fallback;
    };
    const computeIsLightBehindHeader = () => {
      const headerEl = document.querySelector('header') as HTMLElement | null;
      const rect = headerEl?.getBoundingClientRect();
      const sampleYRaw = rect ? rect.top + rect.height * 0.5 : 24;
      const sampleY = Math.min(Math.max(Math.floor(sampleYRaw), 0), window.innerHeight - 1);
      const xs = [Math.floor(window.innerWidth * 0.25), Math.floor(window.innerWidth * 0.5), Math.floor(window.innerWidth * 0.75)];
      const fallback = lastBgIsLightRef.current ?? true;
      const votes = xs.map(x => isLightAtPoint(x, sampleY, headerEl, fallback));
      const lightCount = votes.filter(Boolean).length;
      return lightCount >= Math.ceil(votes.length / 2);
    };
    const applyDebounced = (isLight: boolean) => {
      const now = performance.now();
      const last = lastBgIsLightRef.current;
      if (last === null) {
        lastBgIsLightRef.current = isLight;
        setIsScrolled(isLight);
        return;
      }
      if (isLight === last) {
        pendingBgIsLightRef.current = null;
        return;
      }
      const pending = pendingBgIsLightRef.current;
      if (!pending || pending.value !== isLight) {
        pendingBgIsLightRef.current = {
          value: isLight,
          since: now
        };
        return;
      }
      if (now - pending.since >= 180) {
        pendingBgIsLightRef.current = null;
        lastBgIsLightRef.current = isLight;
        setIsScrolled(isLight);
      }
    };
    const checkBackground = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const isLight = computeIsLightBehindHeader();
        applyDebounced(isLight);
      });
    };
    const initialTimeout = setTimeout(checkBackground, 150);
    window.addEventListener('scroll', checkBackground, {
      passive: true
    });
    window.addEventListener('resize', checkBackground);
    return () => {
      clearTimeout(initialTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', checkBackground);
      window.removeEventListener('resize', checkBackground);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  const navLinks = [{
    name: 'בית',
    path: '/'
  }, {
    name: 'אודות',
    path: '/about'
  }, {
    name: 'קביעת תור',
    path: '/appointments'
  }, {
    name: 'צור קשר',
    path: '/contact'
  }];
  const isActive = (path: string) => location.pathname === path;
  const isServicesActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/treatment');
  return <HeaderWrapper>
      <Container>
        <HeaderInner>
          <Logo to="/">
            <LogoIcon><Smile size={32} color="white" /></LogoIcon>
            <LogoText>
              <LogoTitle $scrolled={isScrolled}>מרפאת שיניים</LogoTitle>
              <LogoSubtitle $scrolled={isScrolled}>חיוך בריא לכל החיים</LogoSubtitle>
            </LogoText>
          </Logo>
          
          <MobileCenterTitle>
            
          </MobileCenterTitle>

          <Nav>
            <NavLink to="/" $active={isActive('/')} $scrolled={isScrolled}>בית</NavLink>
            <ServicesDropdown scrolled={isScrolled} />
            
            <NavLink to="/about" $active={isActive('/about')} $scrolled={isScrolled}>אודות</NavLink>
            <NavLink to="/contact" $active={isActive('/contact')} $scrolled={isScrolled}>צור קשר</NavLink>
          </Nav>

          <CTAWrapper>
            <ButtonRouterLink to="/appointments" $variant="call" $size="lg">
              <Calendar size={20} />
              קביעת תור
            </ButtonRouterLink>
          </CTAWrapper>

          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </HeaderInner>
      </Container>

      {isMenuOpen && <MobileNav>
          <Container>
            <MobileNavInner>
              <MobileNavLink to="/" $active={isActive('/')} onClick={() => setIsMenuOpen(false)}>
                בית
              </MobileNavLink>
              
              {/* Services dropdown for mobile */}
              <div>
                <MobileDropdownTrigger $active={isServicesActive} onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)} aria-expanded={isMobileServicesOpen}>
                  שירותים
                  <ChevronDown size={18} />
                </MobileDropdownTrigger>
                {isMobileServicesOpen && <MobileSubMenu>
                    {treatments.map(treatment => <MobileSubMenuItem key={treatment.id} to={`/treatment/${treatment.slug}`} onClick={() => setIsMenuOpen(false)}>
                        {treatment.title}
                      </MobileSubMenuItem>)}
                    <MobileSubMenuItem to="/services" onClick={() => setIsMenuOpen(false)}>
                      לכל השירותים ←
                    </MobileSubMenuItem>
                  </MobileSubMenu>}
              </div>
              
              <MobileNavLink to="/about" $active={isActive('/about')} onClick={() => setIsMenuOpen(false)}>
                אודות
              </MobileNavLink>
              <MobileNavLink to="/contact" $active={isActive('/contact')} onClick={() => setIsMenuOpen(false)}>
                צור קשר
              </MobileNavLink>
              
              <ButtonRouterLink to="/appointments" $variant="call" $size="lg" $fullWidth style={{
            marginTop: '1rem'
          }} onClick={() => setIsMenuOpen(false)}>
                <Calendar size={20} />
                קביעת תור
              </ButtonRouterLink>
            </MobileNavInner>
          </Container>
        </MobileNav>}
    </HeaderWrapper>;
};
export default Header;