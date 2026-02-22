import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Calendar, Stethoscope, MessageSquare, LogOut, Home, Smile, Loader2, FileText, Image, ShieldX } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Container } from '@/components/styled/Layout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const DashboardWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 0;
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.foreground};
  background: ${({ $active, theme }) => $active ? theme.colors.secondary : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[8]} 0;
  background: ${({ theme }) => theme.colors.secondary}4d;
`;

const LoadingWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const AccessDeniedWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, hsl(0, 30%, 8%) 0%, hsl(0, 20%, 15%) 100%);
  padding: 2rem;
`;

const AccessDeniedCard = styled.div`
  background: hsla(0, 20%, 12%, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid hsla(0, 84%, 60%, 0.3);
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: 3rem;
  max-width: 440px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.4s ease-out;
  box-shadow: 0 0 60px -15px hsla(0, 84%, 60%, 0.2);
`;

const DeniedIconWrapper = styled.div`
  width: 5rem;
  height: 5rem;
  background: hsla(0, 84%, 60%, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  svg {
    color: hsl(0, 84%, 65%);
  }
`;

const DeniedTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: hsl(0, 0%, 92%);
  margin: 0 0 0.75rem;
`;

const DeniedText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: hsla(0, 0%, 70%, 0.9);
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const Dashboard = () => {
  const { user, loading, adminLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && !adminLoading && user && !isAdmin) {
      setShowAccessDenied(true);
    }
  }, [isAdmin, adminLoading, loading, user]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('שגיאה בהתנתקות');
    } else {
      toast.success('התנתקת בהצלחה');
      navigate('/');
    }
  };

  if (loading || adminLoading) {
    return (
      <LoadingWrapper>
        <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(174, 62%, 45%)' }} />
      </LoadingWrapper>
    );
  }

  if (showAccessDenied || (!user && !loading)) {
    return (
      <AccessDeniedWrapper>
        <AccessDeniedCard>
          <DeniedIconWrapper>
            <ShieldX size={40} />
          </DeniedIconWrapper>
          <DeniedTitle>גישה נדחתה</DeniedTitle>
          <DeniedText>
            אין לך הרשאות מנהל לגשת לאזור זה.
            <br />
            אם אתה חושב שזו שגיאה, פנה למנהל המערכת.
          </DeniedText>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Button onClick={() => navigate('/')} $variant="outline" $size="sm">
              <Home size={18} />
              חזרה לאתר
            </Button>
            <Button onClick={handleSignOut} $variant="heroPrimary" $size="sm">
              <LogOut size={18} />
              התנתקות
            </Button>
          </div>
        </AccessDeniedCard>
      </AccessDeniedWrapper>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <DashboardWrapper>
      <Header>
        <Container>
          <HeaderInner>
            <Logo to="/admin">
              <LogoIcon>
                <Smile size={20} color="white" />
              </LogoIcon>
              <LogoText>ניהול מרפאה</LogoText>
            </Logo>

            <Nav>
              <NavLink to="/admin/appointments" $active={isActive('/admin/appointments')}>
                <Calendar size={18} />
                תורים
              </NavLink>
              <NavLink to="/admin/treatments" $active={isActive('/admin/treatments')}>
                <Stethoscope size={18} />
                טיפולים
              </NavLink>
              <NavLink to="/admin/blog" $active={isActive('/admin/blog')}>
                <FileText size={18} />
                בלוג
              </NavLink>
              <NavLink to="/admin/gallery" $active={isActive('/admin/gallery')}>
                <Image size={18} />
                גלריה
              </NavLink>
              <NavLink to="/admin/testimonials" $active={isActive('/admin/testimonials')}>
                <MessageSquare size={18} />
                המלצות
              </NavLink>
            </Nav>

            <Actions>
              <Button as={Link} to="/" $variant="ghost" $size="sm">
                <Home size={18} />
                לאתר
              </Button>
              <Button onClick={handleSignOut} $variant="outline" $size="sm">
                <LogOut size={18} />
                התנתקות
              </Button>
            </Actions>
          </HeaderInner>
        </Container>
      </Header>

      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </DashboardWrapper>
  );
};

export default Dashboard;
