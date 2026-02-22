import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Smile } from 'lucide-react';
import { Container } from '@/components/styled/Layout';
import { Text } from '@/components/styled/Typography';

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.primaryForeground};
`;

const FooterContent = styled.div`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LogoSection = styled.div``;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
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

const LogoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
`;

const LogoSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.8;
  margin: 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.8;
  line-height: 1.7;
`;

const FooterTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: 1.5rem;
`;

const FooterNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.8;
  transition: opacity ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    opacity: 1;
  }
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.8;
  transition: opacity ${({ theme }) => theme.transitions.normal};
  margin-bottom: 1rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    opacity: 1;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.8;
  margin-bottom: 1rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 0.125rem;
  }
`;

const HoursText = styled.div`
  p {
    margin: 0;
    line-height: 1.6;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => theme.colors.primary}33;
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}4d;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.primaryForeground}33;
  margin-top: 3rem;
  padding-top: 2rem;
  text-align: center;
`;

const FooterBottomLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.6;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <FooterContent>
          <FooterGrid>
            <LogoSection>
              <Logo>
                <LogoIcon><Smile size={28} color="white" /></LogoIcon>
                <div>
                  <LogoTitle>מרפאת שיניים</LogoTitle>
                  <LogoSubtitle>חיוך בריא לכל החיים</LogoSubtitle>
                </div>
              </Logo>
              <Description>
                מרפאת שיניים מקצועית המספקת טיפול שיניים איכותי בסביבה נעימה ומרגיעה.
                אנו מחויבים לבריאות הפה שלכם.
              </Description>
            </LogoSection>

            <div>
              <FooterTitle>קישורים מהירים</FooterTitle>
              <FooterNav>
                <FooterLink to="/">בית</FooterLink>
                <FooterLink to="/about">אודות</FooterLink>
                <FooterLink to="/services">שירותים</FooterLink>
                <FooterLink to="/gallery">גלריה</FooterLink>
                <FooterLink to="/blog">בלוג</FooterLink>
                <FooterLink to="/faq">שאלות נפוצות</FooterLink>
                <FooterLink to="/contact">צור קשר</FooterLink>
                <FooterLink to="/auth">כניסת מנהל</FooterLink>
              </FooterNav>
            </div>

            <div>
              <FooterTitle>פרטי התקשרות</FooterTitle>
              <ContactItem href="tel:+972-00-000-0000">
                <Phone size={20} />
                <span>00-000-0000</span>
              </ContactItem>
              <ContactItem href="mailto:info@dental-clinic.co.il">
                <Mail size={20} />
                <span>info@dental-clinic.co.il</span>
              </ContactItem>
              <ContactInfo>
                <MapPin size={20} />
                <span>רחוב הרצל 123, תל אביב</span>
              </ContactInfo>
            </div>

            <div>
              <FooterTitle>שעות פעילות</FooterTitle>
              <ContactInfo>
                <Clock size={20} />
                <HoursText>
                  <p>א׳-ה׳: 08:00-20:00</p>
                  <p>ו׳: 08:00-14:00</p>
                  <p>שבת: סגור</p>
                </HoursText>
              </ContactInfo>
              
              <FooterTitle style={{ marginTop: '1.5rem' }}>עקבו אחרינו</FooterTitle>
              <SocialLinks>
                <SocialLink href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </SocialLink>
                <SocialLink href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={20} />
                </SocialLink>
                <SocialLink href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={20} />
                </SocialLink>
                <SocialLink href="#" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </SocialLink>
                <SocialLink href="#" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </SocialLink>
              </SocialLinks>
            </div>
          </FooterGrid>

          <FooterBottom>
            <FooterBottomLinks>
              <FooterLink to="/privacy">מדיניות פרטיות</FooterLink>
              <span style={{ opacity: 0.4 }}>|</span>
              <FooterLink to="/terms">תנאי שימוש</FooterLink>
            </FooterBottomLinks>
            <Copyright>© 2026 מרפאת שיניים. כל הזכויות שמורות.</Copyright>
          </FooterBottom>
        </FooterContent>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
