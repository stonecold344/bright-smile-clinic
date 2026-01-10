import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Phone, Menu, X, Smile } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Container, Flex } from '@/components/styled/Layout';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 50;
  background: ${({ theme }) => theme.colors.card}f2;
  backdrop-filter: blur(12px);
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const LogoText = styled.div`
  display: none;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
  }
`;

const LogoTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`;

const LogoSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0;
`;

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.foreground};
  transition: color ${({ theme }) => theme.transitions.normal};
  padding-bottom: 0.25rem;
  border-bottom: ${({ $active, theme }) => $active ? `2px solid ${theme.colors.primary}` : '2px solid transparent'};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CTAWrapper = styled.div`
  display: none;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  padding: 0.5rem;
  color: ${({ theme }) => theme.colors.foreground};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileNav = styled.nav`
  background: ${({ theme }) => theme.colors.card};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: 0.5rem 0;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.foreground};
  transition: color ${({ theme }) => theme.transitions.normal};
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'בית', path: '/' },
    { name: 'אודות', path: '/about' },
    { name: 'שירותים', path: '/services' },
    { name: 'קביעת תור', path: '/appointments' },
    { name: 'צור קשר', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <HeaderWrapper>
      <Container>
        <HeaderInner>
          <Logo to="/">
            <LogoIcon><Smile size={28} color="white" /></LogoIcon>
            <LogoText>
              <LogoTitle>מרפאת שיניים</LogoTitle>
              <LogoSubtitle>חיוך בריא לכל החיים</LogoSubtitle>
            </LogoText>
          </Logo>

          <Nav>
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} $active={isActive(link.path)}>
                {link.name}
              </NavLink>
            ))}
          </Nav>

          <CTAWrapper>
            <Button as="a" href="tel:+972-00-000-0000" $variant="call" $size="lg">
              <Phone size={20} />
              קביעת תור
            </Button>
          </CTAWrapper>

          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </HeaderInner>
      </Container>

      {isMenuOpen && (
        <MobileNav>
          <Container>
            <MobileNavInner>
              {navLinks.map((link) => (
                <MobileNavLink
                  key={link.path}
                  to={link.path}
                  $active={isActive(link.path)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </MobileNavLink>
              ))}
              <Button as="a" href="tel:+972-00-000-0000" $variant="call" $size="lg" $fullWidth style={{ marginTop: '1rem' }}>
                <Phone size={20} />
                קביעת תור
              </Button>
            </MobileNavInner>
          </Container>
        </MobileNav>
      )}
    </HeaderWrapper>
  );
};

export default Header;
