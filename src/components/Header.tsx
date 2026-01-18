import { useState } from 'react';
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
`;
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
}) => theme.breakpoints.sm}) {
    display: block;
  }
`;
const LogoTitle = styled.h1`
  font-size: ${({
  theme
}) => theme.fontSizes['2xl']};
  font-weight: ${({
  theme
}) => theme.fontWeights.bold};
  color: ${({
  theme
}) => theme.colors.foreground};
  margin: 0;
`;
const LogoSubtitle = styled.p`
  font-size: ${({
  theme
}) => theme.fontSizes.sm};
  color: ${({
  theme
}) => theme.colors.mutedForeground};
  margin: 0;
`;
const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: ${({
  theme
}) => theme.breakpoints.md}) {
    display: flex;
  }
`;
const NavLink = styled(Link)<{
  $active?: boolean;
}>`
  font-size: ${({
  theme
}) => theme.fontSizes.base};
  font-weight: ${({
  theme
}) => theme.fontWeights.medium};
  color: ${({
  $active,
  theme
}) => $active ? theme.colors.primary : theme.colors.foreground};
  transition: color ${({
  theme
}) => theme.transitions.normal};
  padding-bottom: 0.25rem;
  border-bottom: ${({
  $active,
  theme
}) => $active ? `2px solid ${theme.colors.primary}` : '2px solid transparent'};
  
  &:hover {
    color: ${({
  theme
}) => theme.colors.primary};
  }
`;
const CTAWrapper = styled.div`
  display: none;
  
  @media (min-width: ${({
  theme
}) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;
const MobileMenuButton = styled.button`
  display: flex;
  padding: 0.5rem;
  color: ${({
  theme
}) => theme.colors.foreground};
  
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
  const location = useLocation();
  const {
    data: treatments = []
  } = useTreatments();
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
              <LogoTitle>מרפאת שיניים</LogoTitle>
              <LogoSubtitle>חיוך בריא לכל החיים</LogoSubtitle>
            </LogoText>
          </Logo>

          <Nav>
            <NavLink to="/" $active={isActive('/')}>בית</NavLink>
            <ServicesDropdown />
            
            <NavLink to="/about" $active={isActive('/about')}>אודות</NavLink>
            <NavLink to="/contact" $active={isActive('/contact')}>צור קשר</NavLink>
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
              
              <MobileNavLink to="/appointments" $active={isActive('/appointments')} onClick={() => setIsMenuOpen(false)}>
                קביעת תור
              </MobileNavLink>
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