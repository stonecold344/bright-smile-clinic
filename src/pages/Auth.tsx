import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Mail, Lock, Loader2, Smile } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Input, Label, FormGroup } from '@/components/styled/Input';
import { Title, Text } from '@/components/styled/Typography';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, hsl(200, 50%, 10%) 0%, hsl(200, 50%, 18%) 40%, hsl(174, 50%, 20%) 100%);

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -15%;
    width: 50vw;
    height: 50vw;
    border-radius: 50%;
    background: radial-gradient(circle, hsla(174, 62%, 45%, 0.25) 0%, transparent 70%);
    filter: blur(60px);
    animation: floatOrb1 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -25%;
    left: -10%;
    width: 45vw;
    height: 45vw;
    border-radius: 50%;
    background: radial-gradient(circle, hsla(38, 90%, 55%, 0.15) 0%, transparent 70%);
    filter: blur(50px);
    animation: floatOrb2 10s ease-in-out infinite;
  }

  @keyframes floatOrb1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-30px, 20px) scale(1.05); }
  }

  @keyframes floatOrb2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -30px) scale(1.08); }
  }
`;

const AuthCard = styled.div`
  background: hsla(200, 30%, 15%, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid hsla(174, 62%, 45%, 0.2);
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[10]};
  box-shadow: 
    0 0 40px -10px hsla(174, 62%, 45%, 0.2),
    0 20px 60px -20px hsla(0, 0%, 0%, 0.5),
    inset 0 1px 0 hsla(0, 0%, 100%, 0.05);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 0 30px -5px hsla(174, 62%, 45%, 0.4);
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: hsla(174, 62%, 45%, 0.6);
  }
  
  input {
    padding-left: 3rem;
    background: hsla(200, 30%, 15%, 0.5);
    border: 1px solid hsla(174, 62%, 45%, 0.15);
    color: hsl(0, 0%, 95%);
    
    &::placeholder {
      color: hsla(200, 15%, 60%, 0.5);
    }
    
    &:focus {
      border-color: hsla(174, 62%, 45%, 0.5);
      box-shadow: 0 0 20px -5px hsla(174, 62%, 45%, 0.2);
    }
  }
`;

const StyledTitle = styled(Title)`
  text-align: center;
  color: hsl(0, 0%, 95%);
`;

const StyledLabel = styled(Label)`
  color: hsla(200, 15%, 75%, 0.9);
`;

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, user } = useAuth();
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <AuthCard>
        <LogoWrapper>
          <LogoIcon>
            <Smile size={36} color="white" />
          </LogoIcon>
          <StyledTitle $size="md">כניסת מנהל</StyledTitle>
          <Text $color="muted" style={{ color: 'hsla(200, 15%, 65%, 0.8)' }}>ניהול מערכת המרפאה</Text>
        </LogoWrapper>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <StyledLabel htmlFor="email">אימייל</StyledLabel>
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
            {errors.email && <Text $color="muted" $size="sm" style={{ color: 'hsl(0, 84%, 65%)', marginTop: '0.25rem' }}>{errors.email}</Text>}
          </FormGroup>

          <FormGroup>
            <StyledLabel htmlFor="password">סיסמה</StyledLabel>
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
            {errors.password && <Text $color="muted" $size="sm" style={{ color: 'hsl(0, 84%, 65%)', marginTop: '0.25rem' }}>{errors.password}</Text>}
          </FormGroup>

          <Button type="submit" $variant="heroPrimary" $size="lg" $fullWidth disabled={loading}>
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : 'התחברות'}
          </Button>
        </form>
      </AuthCard>
    </PageWrapper>
  );
};

export default Auth;
