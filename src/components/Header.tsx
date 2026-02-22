import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Menu, X, Smile, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Button, ButtonRouterLink } from '@/components/styled/Button';
import { Container } from '@/components/styled/Layout';
import ServicesDropdown from '@/components/ServicesDropdown';
import { useTreatments } from '@/hooks/useTreatments';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

const HeaderWrapper = styled.header<{ $scrolled?: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 50;
  background: ${({ $scrolled, theme }) => $scrolled ? `${theme.colors.card}f2` : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => $scrolled ? 'blur(12px)' : 'none'};
  box-shadow: ${({ $scrolled, theme }) => $scrolled ? theme.shadows.soft : 'none'};
  transition: background 0.4s ease, box-shadow 0.4s ease;
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
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
  }
`;

const MobileCenterTitle = styled.div`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    
    h1 {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      font-weight: ${({ theme }) => theme.fontWeights.bold};
      color: ${({ theme }) => theme.colors.primary};
      margin: 0;
      white-space: nowrap;
    }
  }
`;

const LogoIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
`;

const LogoText = styled.div`
  display: none;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const LogoTitle = styled.h1<{ $scrolled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $scrolled, theme }) => $scrolled ? theme.colors.primary : 'white'};
  margin: 0;
  transition: color 0.4s ease, text-shadow 0.4s ease;
  text-shadow: ${({ $scrolled }) => $scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.5)'};
`;

const LogoSubtitle = styled.p<{ $scrolled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $scrolled }) => $scrolled ? 'hsl(200, 15%, 45%)' : 'hsla(0, 0%, 100%, 0.9)'};
  margin: 0;
  display: none;
  transition: color 0.4s ease, text-shadow 0.4s ease;
  text-shadow: ${({ $scrolled }) => $scrolled ? 'none' : '0 1px 3px rgba(0,0,0,0.4)'};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
    font-size: ${({ theme }) => theme.fontSizes.sm};
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
  transition: color 0.4s ease, text-shadow 0.4s ease;
  text-shadow: ${({ $scrolled }) => $scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.5)'};
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
  color: ${({ theme }) => theme.colors.primary};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileNav = styled.nav<{ $closing?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  max-height: calc(100vh - 5.5rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  animation: ${({ $closing }) => $closing ? 'mobileSlideUp 0.25s ease-in forwards' : 'mobileSlideDown 0.3s ease-out forwards'};
  transform-origin: top;
  
  @keyframes mobileSlideDown {
    from { 
      opacity: 0; 
      transform: translateY(-8px) scaleY(0.96);
      clip-path: inset(0 0 100% 0);
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scaleY(1);
      clip-path: inset(0 0 0 0);
    }
  }
  
  @keyframes mobileSlideUp {
    from { 
      opacity: 1; 
      transform: translateY(0) scaleY(1);
      clip-path: inset(0 0 0 0);
    }
    to { 
      opacity: 0; 
      transform: translateY(-8px) scaleY(0.96);
      clip-path: inset(0 0 100% 0);
    }
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
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
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: 0.5rem 0;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.foreground};
  transition: color ${({ theme }) => theme.transitions.normal};
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
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.mutedForeground};
  padding: 0.5rem 0;
  transition: color ${({ theme }) => theme.transitions.normal};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileDropdownTrigger = styled.button<{
  $active?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: 0.5rem 0;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.foreground};
  background: transparent;
  width: 100%;
  text-align: right;

  svg {
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  &[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { data: treatments = [] } = useTreatments();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success('התנתקת בהצלחה');
      navigate('/');
    }
  };

  const closeMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
      setIsMobileServicesOpen(false);
    }, 250);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
    }
  };

  // Pages that always have a light background (no dark hero)
  const alwaysLightPages = ['/about', '/contact', '/services', '/appointments', '/blog', '/gallery', '/privacy', '/terms', '/auth', '/admin'];
  const isAlwaysLight = alwaysLightPages.some(page => location.pathname.startsWith(page));

  // Simple, reliable scroll-based detection for the home page hero
  useEffect(() => {
    if (isAlwaysLight) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      // The hero section is ~70vh. Switch to light mode when scrolled past 60% of viewport height.
      const threshold = window.innerHeight * 0.55;
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > threshold);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAlwaysLight, location.pathname]);

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

  const navLinks = [
    { name: 'בית', path: '/' },
    { name: 'אודות', path: '/about' },
    { name: 'קביעת תור', path: '/appointments' },
    { name: 'צור קשר', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isServicesActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/treatment');

  return (
    <HeaderWrapper $scrolled={isScrolled}>
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
            <h1>מרפאת שיניים</h1>
          </MobileCenterTitle>

          <Nav>
            <NavLink to="/" $active={isActive('/')} $scrolled={isScrolled}>בית</NavLink>
            <ServicesDropdown scrolled={isScrolled} />
            <NavLink to="/gallery" $active={isActive('/gallery')} $scrolled={isScrolled}>גלריה</NavLink>
            <NavLink to="/blog" $active={location.pathname.startsWith('/blog')} $scrolled={isScrolled}>בלוג</NavLink>
            <NavLink to="/about" $active={isActive('/about')} $scrolled={isScrolled}>אודות</NavLink>
            <NavLink to="/contact" $active={isActive('/contact')} $scrolled={isScrolled}>צור קשר</NavLink>
          </Nav>

          <CTAWrapper>
            {user && isAdmin && (
              <ButtonRouterLink to="/admin" $variant="ghost" $size="sm">
                <Settings size={18} />
                ניהול
              </ButtonRouterLink>
            )}
            {user && (
              <Button onClick={handleSignOut} $variant="ghost" $size="sm">
                <LogOut size={18} />
                התנתקות
              </Button>
            )}
            <ButtonRouterLink to="/appointments" $variant="call" $size="lg">
              <Calendar size={20} />
              קביעת תור
            </ButtonRouterLink>
          </CTAWrapper>

          <MobileMenuButton onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </HeaderInner>
      </Container>

      {isMenuOpen && (
        <MobileNav $closing={isMenuClosing}>
          <Container>
            <MobileNavInner>
              <MobileNavLink to="/" $active={isActive('/')} onClick={closeMenu}>
                בית
              </MobileNavLink>
              
              <div>
                <MobileDropdownTrigger
                  $active={isServicesActive}
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  aria-expanded={isMobileServicesOpen}
                >
                  שירותים
                  <ChevronDown size={18} />
                </MobileDropdownTrigger>
                {isMobileServicesOpen && (
                  <MobileSubMenu>
                    {treatments.map(treatment => (
                      <MobileSubMenuItem key={treatment.id} to={`/treatment/${treatment.slug}`} onClick={closeMenu}>
                        {treatment.title}
                      </MobileSubMenuItem>
                    ))}
                    <MobileSubMenuItem to="/services" onClick={closeMenu}>
                      לכל השירותים ←
                    </MobileSubMenuItem>
                  </MobileSubMenu>
                )}
              </div>
              
              <MobileNavLink to="/gallery" $active={isActive('/gallery')} onClick={closeMenu}>
                גלריה
              </MobileNavLink>
              <MobileNavLink to="/blog" $active={location.pathname.startsWith('/blog')} onClick={closeMenu}>
                בלוג
              </MobileNavLink>
              <MobileNavLink to="/about" $active={isActive('/about')} onClick={closeMenu}>
                אודות
              </MobileNavLink>
              <MobileNavLink to="/contact" $active={isActive('/contact')} onClick={closeMenu}>
                צור קשר
              </MobileNavLink>
              
              <ButtonRouterLink
                to="/appointments"
                $variant="call"
                $size="lg"
                $fullWidth
                style={{ marginTop: '1rem' }}
                onClick={closeMenu}
              >
                <Calendar size={20} />
                קביעת תור
              </ButtonRouterLink>

              {user && isAdmin && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                  <ButtonRouterLink to="/admin" $variant="outline" $size="sm" $fullWidth onClick={closeMenu}>
                    <Settings size={18} />
                    ניהול מערכת
                  </ButtonRouterLink>
                </div>
              )}
              {user && (
                <Button onClick={() => { handleSignOut(); closeMenu(); }} $variant="outline" $size="sm" $fullWidth style={{ marginTop: '0.25rem' }}>
                  <LogOut size={18} />
                  התנתקות
                </Button>
              )}
            </MobileNavInner>
          </Container>
        </MobileNav>
      )}
    </HeaderWrapper>
  );
};

export default Header;
