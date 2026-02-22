import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Mail, Lock, Loader2, Smile, AlertTriangle, ShieldX } from 'lucide-react';
import { Button } from '@/components/styled/Button';
import { Input, Label, FormGroup } from '@/components/styled/Input';
import { Title, Text } from '@/components/styled/Typography';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import { toast } from 'sonner';

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

const InputWrapper = styled.div<{ $hasError?: boolean }>`
  position: relative;
  
  svg.input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ $hasError }) => $hasError ? 'hsla(0, 84%, 60%, 0.8)' : 'hsla(174, 62%, 45%, 0.6)'};
    transition: color 0.3s ease;
  }
  
  input {
    padding-left: 3rem;
    background: hsla(200, 30%, 15%, 0.5);
    border: 1px solid ${({ $hasError }) => $hasError ? 'hsla(0, 84%, 60%, 0.5)' : 'hsla(174, 62%, 45%, 0.15)'};
    color: hsl(0, 0%, 95%);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    
    &::placeholder {
      color: hsla(200, 15%, 60%, 0.5);
    }
    
    &:focus {
      border-color: ${({ $hasError }) => $hasError ? 'hsla(0, 84%, 60%, 0.7)' : 'hsla(174, 62%, 45%, 0.5)'};
      box-shadow: 0 0 20px -5px ${({ $hasError }) => $hasError ? 'hsla(0, 84%, 60%, 0.15)' : 'hsla(174, 62%, 45%, 0.2)'};
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

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FieldError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.375rem;
  animation: ${slideDown} 0.2s ease-out;
  
  svg {
    flex-shrink: 0;
    color: hsl(0, 84%, 65%);
  }
  
  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: hsl(0, 84%, 65%);
  }
`;

const GeneralError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  margin-bottom: 1.25rem;
  background: hsla(0, 84%, 60%, 0.12);
  border: 1px solid hsla(0, 84%, 60%, 0.3);
  border-radius: ${({ theme }) => theme.radii.lg};
  animation: ${slideDown} 0.3s ease-out;
  
  svg {
    flex-shrink: 0;
    color: hsl(0, 84%, 65%);
  }
  
  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: hsl(0, 80%, 75%);
    line-height: 1.4;
  }
`;

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const clearFieldError = (field: 'email' | 'password') => {
    setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
  };

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
    setErrors({});
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'אימייל או סיסמה שגויים. אנא בדוק את הפרטים ונסה שוב.' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'כתובת האימייל טרם אומתה. בדוק את תיבת הדואר שלך.' });
        } else if (error.message.includes('Too many requests')) {
          setErrors({ general: 'יותר מדי ניסיונות. נסה שוב בעוד מספר דקות.' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        toast.success('התחברת בהצלחה! 👋');
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

        {errors.general && (
          <GeneralError>
            <ShieldX size={20} />
            <span>{errors.general}</span>
          </GeneralError>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormGroup>
            <StyledLabel htmlFor="email">אימייל</StyledLabel>
            <InputWrapper $hasError={!!errors.email}>
              <Mail size={18} className="input-icon" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                placeholder="your@email.com"
                dir="ltr"
              />
            </InputWrapper>
            {errors.email && (
              <FieldError>
                <AlertTriangle size={14} />
                <span>{errors.email}</span>
              </FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <StyledLabel htmlFor="password">סיסמה</StyledLabel>
            <InputWrapper $hasError={!!errors.password}>
              <Lock size={18} className="input-icon" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                placeholder="••••••••"
                dir="ltr"
              />
            </InputWrapper>
            {errors.password && (
              <FieldError>
                <AlertTriangle size={14} />
                <span>{errors.password}</span>
              </FieldError>
            )}
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
