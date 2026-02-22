import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Banner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9997;
  background: ${({ theme }) => theme.colors.card};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 -4px 20px hsla(200, 50%, 20%, 0.1);
  animation: ${slideUp} 0.4s ease-out;
`;

const BannerInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.accent};
`;

const TextContent = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.6;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const AcceptButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryForeground};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    opacity: 0.9;
  }
`;

const DeclineButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.foreground};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: background ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.muted};
  }
`;

const COOKIE_KEY = 'cookie-consent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Banner role="alert" aria-label="הודעת עוגיות">
      <BannerInner>
        <IconWrapper>
          <Cookie size={28} />
        </IconWrapper>
        <TextContent>
          אתר זה משתמש בעוגיות (Cookies) לצורך שיפור חווית הגלישה, ניתוח תעבורה ושיפור השירותים שלנו.
          בהמשך הגלישה באתר, הנך מסכים/ה לשימוש בעוגיות בהתאם ל
          <Link to="/privacy">מדיניות הפרטיות</Link> שלנו.
        </TextContent>
        <ButtonGroup>
          <AcceptButton onClick={handleAccept}>אני מסכים/ה</AcceptButton>
          <DeclineButton onClick={handleDecline}>דחייה</DeclineButton>
        </ButtonGroup>
      </BannerInner>
    </Banner>
  );
};

export default CookieConsent;
