import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { Container, Flex, Grid } from '@/components/styled/Layout';
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
                <LogoIcon>🦷</LogoIcon>
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
                <FooterLink to="/contact">צור קשר</FooterLink>
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
                <SocialLink href="#" aria-label="Facebook">
                  <Facebook size={20} />
                </SocialLink>
                <SocialLink href="#" aria-label="Instagram">
                  <Instagram size={20} />
                </SocialLink>
              </SocialLinks>
            </div>
          </FooterGrid>

          <FooterBottom>
            <Copyright>© 2026 מרפאת שיניים. כל הזכויות שמורות.</Copyright>
          </FooterBottom>
        </FooterContent>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
