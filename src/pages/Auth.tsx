import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Mail, Lock, Loader2, Smile } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Input, Label, FormGroup } from '@/components/styled/Input';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.secondary}4d;
  padding: 2rem;
`;

const AuthCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[10]};
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  width: 100%;
  max-width: 420px;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const TabsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.colors.secondary}80;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0.25rem;
`;

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.normal};
  background: ${({ $active, theme }) => $active ? theme.colors.card : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.mutedForeground};
  box-shadow: ${({ $active, theme }) => $active ? theme.shadows.soft : 'none'};
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
  
  input {
    padding-left: 3rem;
  }
`;

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('פרטי התחברות שגויים');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('התחברת בהצלחה!');
          navigate('/admin');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('כתובת האימייל כבר רשומה במערכת');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('נרשמת בהצלחה! בדוק את האימייל שלך לאישור.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <AuthCard>
          <LogoWrapper>
            <LogoIcon>
              <Smile size={32} color="white" />
            </LogoIcon>
            <Title $size="md" style={{ textAlign: 'center' }}>מרפאת שיניים</Title>
            <Text $color="muted">ניהול מערכת</Text>
          </LogoWrapper>

          <TabsWrapper>
            <Tab $active={isLogin} onClick={() => setIsLogin(true)}>
              התחברות
            </Tab>
            <Tab $active={!isLogin} onClick={() => setIsLogin(false)}>
              הרשמה
            </Tab>
          </TabsWrapper>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">אימייל</Label>
              <InputWrapper>
                <Mail size={18} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  dir="ltr"
                  required
                />
              </InputWrapper>
              {errors.email && <Text $color="muted" $size="sm" style={{ color: 'red', marginTop: '0.25rem' }}>{errors.email}</Text>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">סיסמה</Label>
              <InputWrapper>
                <Lock size={18} />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  required
                />
              </InputWrapper>
              {errors.password && <Text $color="muted" $size="sm" style={{ color: 'red', marginTop: '0.25rem' }}>{errors.password}</Text>}
            </FormGroup>

            <Button type="submit" $variant="heroPrimary" $size="lg" $fullWidth disabled={loading}>
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isLogin ? 'התחברות' : 'הרשמה'}
            </Button>
          </form>
        </AuthCard>
      </Container>
    </PageWrapper>
  );
};

export default Auth;
