import { useState } from 'react';
import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/styled/Button';
import { Input, Textarea, Label, FormGroup } from '@/components/styled/Input';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

const contactInfo = [
  { icon: Phone, title: 'טלפון', value: '00-000-0000', link: 'tel:+972-00-000-0000' },
  { icon: Mail, title: 'אימייל', value: 'info@dental-clinic.co.il', link: 'mailto:info@dental-clinic.co.il' },
  { icon: MapPin, title: 'כתובת', value: 'רחוב הרצל 123, תל אביב', link: '#' },
  { icon: Clock, title: 'שעות פעילות', value: 'א׳-ה׳: 08:00-20:00', link: '#' },
];

const HeroSection = styled.section`padding-top: 8rem; padding-bottom: 4rem; background: ${({ theme }) => theme.colors.secondary}4d;`;
const HeroContent = styled.div`text-align: center; max-width: 48rem; margin: 0 auto;`;
const ContactSection = styled.section`padding: ${({ theme }) => theme.spacing[24]} 0; background: ${({ theme }) => theme.colors.background};`;
const ContactGrid = styled.div`display: grid; grid-template-columns: 1fr; gap: 4rem; @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { grid-template-columns: 1fr 1fr; }`;
const FormCard = styled.div`background: ${({ theme }) => theme.colors.card}; border-radius: ${({ theme }) => theme.radii['2xl']}; padding: ${({ theme }) => theme.spacing[8]}; box-shadow: ${({ theme }) => theme.shadows.card};`;
const FormTitle = styled.h2`font-size: ${({ theme }) => theme.fontSizes['2xl']}; font-weight: ${({ theme }) => theme.fontWeights.bold}; color: ${({ theme }) => theme.colors.foreground}; margin-bottom: 1.5rem;`;
const ContactInfoTitle = styled.h2`font-size: ${({ theme }) => theme.fontSizes['2xl']}; font-weight: ${({ theme }) => theme.fontWeights.bold}; color: ${({ theme }) => theme.colors.foreground}; margin-bottom: 2rem;`;
const ContactItems = styled.div`display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 3rem;`;
const ContactItem = styled.a`display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: ${({ theme }) => theme.colors.secondary}80; border-radius: ${({ theme }) => theme.radii.xl}; transition: background ${({ theme }) => theme.transitions.normal}; &:hover { background: ${({ theme }) => theme.colors.secondary}; }`;
const ContactIconWrapper = styled.div`width: 3rem; height: 3rem; background: ${({ theme }) => theme.gradients.hero}; border-radius: ${({ theme }) => theme.radii.xl}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; svg { color: ${({ theme }) => theme.colors.primaryForeground}; }`;
const ContactItemContent = styled.div``;
const ContactItemTitle = styled.h3`font-weight: ${({ theme }) => theme.fontWeights.semibold}; color: ${({ theme }) => theme.colors.foreground}; margin: 0;`;
const ContactItemValue = styled.p`color: ${({ theme }) => theme.colors.mutedForeground}; margin: 0;`;
const QuickCallCTA = styled.div`background: ${({ theme }) => theme.gradients.hero}; border-radius: ${({ theme }) => theme.radii['2xl']}; padding: 2rem; text-align: center;`;
const QuickCallTitle = styled.h3`font-size: ${({ theme }) => theme.fontSizes['2xl']}; font-weight: ${({ theme }) => theme.fontWeights.bold}; color: ${({ theme }) => theme.colors.primaryForeground}; margin-bottom: 1rem;`;
const QuickCallText = styled.p`color: ${({ theme }) => theme.colors.primaryForeground}e6; margin-bottom: 1.5rem;`;
const MapSection = styled.section`height: 24rem; background: ${({ theme }) => theme.colors.muted}; display: flex; align-items: center; justify-content: center;`;
const MapPlaceholder = styled.div`text-align: center;`;
const MapIcon = styled.div`color: ${({ theme }) => theme.colors.mutedForeground}; margin: 0 auto 1rem;`;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { toast.success('ההודעה נשלחה בהצלחה!'); setFormData({ name: '', phone: '', email: '', message: '' }); setIsSubmitting(false); }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div>
      <Header />
      <main>
        <HeroSection><Container><HeroContent><Badge>צור קשר</Badge><Title $size="xl" style={{ marginTop: '1rem' }}>נשמח לשמוע ממכם</Title><Text $color="muted" $size="lg">השאירו פרטים ונחזור אליכם בהקדם</Text></HeroContent></Container></HeroSection>
        <ContactSection>
          <Container>
            <ContactGrid>
              <FormCard>
                <FormTitle>השאירו פרטים</FormTitle>
                <form onSubmit={handleSubmit}>
                  <FormGroup><Label htmlFor="name">שם מלא *</Label><Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="הכניסו את שמכם" /></FormGroup>
                  <FormGroup><Label htmlFor="phone">טלפון *</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="050-000-0000" dir="ltr" /></FormGroup>
                  <FormGroup><Label htmlFor="email">אימייל</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" dir="ltr" /></FormGroup>
                  <FormGroup><Label htmlFor="message">הודעה</Label><Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="ספרו לנו במה נוכל לעזור..." /></FormGroup>
                  <Button type="submit" $variant="heroPrimary" $size="lg" $fullWidth disabled={isSubmitting}>{isSubmitting ? 'שולח...' : 'שליחת הודעה'}<Send size={20} /></Button>
                </form>
              </FormCard>
              <div>
                <ContactInfoTitle>פרטי התקשרות</ContactInfoTitle>
                <ContactItems>{contactInfo.map((item, i) => (<ContactItem key={i} href={item.link}><ContactIconWrapper><item.icon size={24} /></ContactIconWrapper><ContactItemContent><ContactItemTitle>{item.title}</ContactItemTitle><ContactItemValue>{item.value}</ContactItemValue></ContactItemContent></ContactItem>))}</ContactItems>
                <QuickCallCTA><QuickCallTitle>מעדיפים לדבר?</QuickCallTitle><QuickCallText>התקשרו אלינו עכשיו</QuickCallText><Button as="a" href="tel:+972-00-000-0000" $variant="hero" $size="xl"><Phone size={20} />00-000-0000</Button></QuickCallCTA>
              </div>
            </ContactGrid>
          </Container>
        </ContactSection>
        <MapSection><MapPlaceholder><MapIcon><MapPin size={64} /></MapIcon><Text $color="muted" $size="lg">רחוב הרצל 123, תל אביב</Text></MapPlaceholder></MapSection>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
