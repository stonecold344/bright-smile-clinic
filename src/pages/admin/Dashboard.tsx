import { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Stethoscope, MessageSquare, LogOut, Home, Smile, Loader2 } from 'lucide-react';
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

const Dashboard = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast.error('אין לך הרשאות גישה לאזור הניהול');
      navigate('/');
    }
  }, [isAdmin, loading, user, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('שגיאה בהתנתקות');
    } else {
      toast.success('התנתקת בהצלחה');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
      </LoadingWrapper>
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
