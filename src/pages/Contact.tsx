import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/styled/Button';
import { Input, Textarea, Label, FormGroup } from '@/components/styled/Input';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  phone: z.string().regex(/^0[0-9]{8,9}$/, 'מספר טלפון לא תקין (לדוגמה: 0501234567)'),
  email: z.string().email('כתובת אימייל לא תקינה').optional().or(z.literal('')),
  message: z.string().max(1000, 'ההודעה ארוכה מדי').optional(),
});

const contactInfo = [
  { icon: MessageCircle, title: 'WhatsApp', value: 'שלחו לנו הודעה', link: 'https://wa.me/972507334482' },
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
const MapSection = styled.section`height: 24rem; background: ${({ theme }) => theme.colors.muted}; iframe { width: 100%; height: 100%; border: 0; }`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FieldError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  animation: ${slideDown} 0.2s ease-out;
  svg { flex-shrink: 0; color: ${({ theme }) => theme.colors.destructive}; }
  span { font-size: ${({ theme }) => theme.fontSizes.xs}; color: ${({ theme }) => theme.colors.destructive}; }
`;

const FormError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.colors.destructive}12;
  border: 1px solid ${({ theme }) => theme.colors.destructive}40;
  border-radius: ${({ theme }) => theme.radii.lg};
  animation: ${slideDown} 0.3s ease-out;
  svg { flex-shrink: 0; color: ${({ theme }) => theme.colors.destructive}; }
  span { font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.destructive}; line-height: 1.4; }
`;

const StyledInput = styled(Input)<{ $hasError?: boolean }>`
  border-color: ${({ $hasError, theme }) => $hasError ? theme.colors.destructive : ''};
  &:focus {
    border-color: ${({ $hasError, theme }) => $hasError ? theme.colors.destructive : ''};
    box-shadow: ${({ $hasError, theme }) => $hasError ? `0 0 0 3px ${theme.colors.destructive}25` : ''};
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError('');

    const result = contactSchema.safeParse({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      message: formData.message.trim() || undefined,
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        if (!errs[field]) errs[field] = err.message;
      });
      setFieldErrors(errs);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-whatsapp', {
        body: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          message: formData.message.trim() || undefined,
        }
      });

      if (error) {
        setFormError('אירעה שגיאה, נסו שוב');
        return;
      }

      if (data?.success && data?.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
        toast.success('ההודעה נשלחה בהצלחה!');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else if (data?.error) {
        setFormError(data.error);
      } else {
        setFormError('אירעה שגיאה, נסו שוב');
      }
    } catch {
      setFormError('אירעה שגיאה, נסו שוב');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearFieldError(e.target.name);
  };

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
                  {formError && (
                    <FormError>
                      <AlertTriangle size={18} />
                      <span>{formError}</span>
                    </FormError>
                  )}

                  <FormGroup>
                    <Label htmlFor="name">שם מלא *</Label>
                    <StyledInput id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="הכניסו את שמכם" $hasError={!!fieldErrors.name} />
                    {fieldErrors.name && <FieldError><AlertTriangle size={13} /><span>{fieldErrors.name}</span></FieldError>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="phone">טלפון *</Label>
                    <StyledInput id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="050-000-0000" dir="ltr" $hasError={!!fieldErrors.phone} />
                    {fieldErrors.phone && <FieldError><AlertTriangle size={13} /><span>{fieldErrors.phone}</span></FieldError>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="email">אימייל</Label>
                    <StyledInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" dir="ltr" $hasError={!!fieldErrors.email} />
                    {fieldErrors.email && <FieldError><AlertTriangle size={13} /><span>{fieldErrors.email}</span></FieldError>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="message">הודעה</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="ספרו לנו במה נוכל לעזור..." />
                  </FormGroup>

                  <Button type="submit" $variant="heroPrimary" $size="lg" $fullWidth disabled={isSubmitting}>
                    {isSubmitting ? 'שולח...' : 'שליחת הודעה'}<Send size={20} />
                  </Button>
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
        <MapSection>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.7891849856787!2d34.77086681517441!3d32.0853999810127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b7cfe79f833%3A0x9c42e6b30eab68c5!2sHerzl%20St%2C%20Tel%20Aviv-Yafo!5e0!3m2!1sen!2sil!4v1647872000000!5m2!1sen!2sil"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="מיקום המרפאה"
          />
        </MapSection>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
