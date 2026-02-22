import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { format, addDays, isSameDay, startOfToday, getDay, startOfMonth, endOfMonth, addMonths, isSameMonth } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar, Clock, User, Phone, Mail, ChevronRight, ChevronLeft, Check, X, CalendarDays, AlertTriangle, Stethoscope } from 'lucide-react';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { z } from 'zod';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { useTreatments } from '@/hooks/useTreatments';

// Validation schema for appointment form
const appointmentSchema = z.object({
  client_name: z.string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(100, 'שם ארוך מדי')
    .regex(/^[\p{L}\s'-]+$/u, 'שם יכול להכיל רק אותיות ורווחים'),
  client_phone: z.string()
    .regex(/^0[0-9]{8,9}$/, 'מספר טלפון לא תקין (לדוגמה: 0501234567)'),
  client_email: z.string()
    .email('כתובת אימייל לא תקינה')
    .max(255, 'אימייל ארוך מדי')
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .max(500, 'ההערות ארוכות מדי (מקסימום 500 תווים)')
    .optional()
});

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  text-align: center;
  max-width: 42rem;
  margin: 0 auto ${({ theme }) => theme.spacing[12]};
`;

const BookingCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 300px 1fr 320px;
  }
`;

const BookingColumn = styled.div<{ $withBorder?: boolean }>`
  padding: ${({ theme }) => theme.spacing[6]};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    border-left: ${({ $withBorder, theme }) => $withBorder ? `1px solid ${theme.colors.border}` : 'none'};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    border-top: ${({ $withBorder, theme }) => $withBorder ? `1px solid ${theme.colors.border}` : 'none'};
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ColumnIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ColumnTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const ColumnSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-top: 0.125rem;
`;

const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MonthLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const NavButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const NavButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.foreground};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.125rem;
  margin-bottom: 0.375rem;
  direction: rtl;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.mutedForeground};
  padding: 0.25rem 0;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.125rem;
  direction: rtl;
`;

const DayButton = styled.button<{ $isSelected?: boolean; $isToday?: boolean; $isDisabled?: boolean }>`
  aspect-ratio: 1;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  background: ${({ $isSelected, $isToday, theme }) => 
    $isSelected ? theme.gradients.hero : 
    $isToday ? theme.colors.primaryLight : 
    'transparent'};
  
  color: ${({ $isSelected, $isDisabled, theme }) => 
    $isSelected ? theme.colors.primaryForeground : 
    $isDisabled ? theme.colors.mutedForeground :
    theme.colors.foreground};
  
  opacity: ${({ $isDisabled }) => $isDisabled ? 0.4 : 1};
  cursor: ${({ $isDisabled }) => $isDisabled ? 'not-allowed' : 'pointer'};
  
  &:hover:not(:disabled) {
    background: ${({ $isSelected, theme }) => 
      $isSelected ? theme.gradients.hero : theme.colors.secondary};
  }
`;

const TimeSlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  max-height: 320px;
  overflow-y: auto;
  padding-left: 0.5rem;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.secondary}; border-radius: 2px; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.primary}; border-radius: 2px; }
`;

const TimeSlot = styled.button<{ $isSelected?: boolean; $isBooked?: boolean }>`
  padding: 0.625rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  
  background: ${({ $isSelected, $isBooked, theme }) => 
    $isBooked ? theme.colors.destructive + '15' :
    $isSelected ? theme.gradients.hero : 
    theme.colors.secondary};
  
  color: ${({ $isSelected, $isBooked, theme }) => 
    $isBooked ? theme.colors.destructive :
    $isSelected ? theme.colors.primaryForeground : 
    theme.colors.foreground};
  
  cursor: ${({ $isBooked }) => $isBooked ? 'not-allowed' : 'pointer'};
  text-decoration: ${({ $isBooked }) => $isBooked ? 'line-through' : 'none'};
  
  &:hover:not(:disabled) {
    ${({ $isBooked, $isSelected, theme }) => !$isBooked && `
      background: ${$isSelected ? theme.gradients.hero : theme.colors.primary};
      color: ${theme.colors.primaryForeground};
    `}
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedForeground};
  padding: 1.5rem;
`;

const EmptyStateIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.mutedForeground};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
`;

const Legend = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

const LegendDot = styled.div<{ $variant: 'available' | 'booked' | 'selected' }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $variant, theme }) => 
    $variant === 'available' ? theme.colors.secondary :
    $variant === 'booked' ? theme.colors.destructive + '60' :
    theme.colors.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.375rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1px solid ${({ $hasError, theme }) => $hasError ? theme.colors.destructive : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => $hasError ? theme.colors.destructive : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ $hasError, theme }) => $hasError ? theme.colors.destructive + '25' : theme.colors.primary + '25'};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  min-height: 60px;
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }
`;

const SelectedAppointment = styled.div`
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0.875rem;
  margin-bottom: 1.25rem;
  color: ${({ theme }) => theme.colors.primaryForeground};
`;

const SelectedLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  opacity: 0.9;
  margin-bottom: 0.25rem;
`;

const SelectedValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

/* Inline error styles */
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

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.destructive};
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.destructive};
  }
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

// Generate time slots from 9:00 to 17:00 every 15 minutes
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Hebrew day names (Sunday to Saturday)
const hebrewDays = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

interface Appointment {
  appointment_date: string;
  appointment_time: string;
}

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(startOfToday()));
  const [bookedSlots, setBookedSlots] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const { verify: verifyRecaptcha, hasToken: hasRecaptchaToken } = useRecaptcha('recaptcha-appointment');
  const { data: treatments = [] } = useTreatments();

  // Fetch booked appointments using security definer function (no PII exposed)
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .rpc('get_booked_slots', { check_date: format(currentMonth, 'yyyy-MM-dd') });
      
      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching appointments:', error);
        }
        return;
      }
      
      setBookedSlots(data || []);
    };

    fetchAppointments();

    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        () => { fetchAppointments(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentMonth]);

  const getMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDay = getDay(monthStart);
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) { days.push(null); }
    let currentDate = monthStart;
    while (currentDate <= monthEnd) { days.push(currentDate); currentDate = addDays(currentDate, 1); }
    return days.slice(0, 28);
  };

  const isWorkingDay = (date: Date) => {
    const day = getDay(date);
    return day >= 0 && day <= 4;
  };

  const isTimeBooked = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookedSlots.some(
      slot => slot.appointment_date === dateStr && slot.appointment_time === time + ':00'
    );
  };

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError('');
    
    if (!selectedDate || !selectedTime) {
      setFormError('יש לבחור תאריך ושעה לפני שליחת הטופס');
      return;
    }

    const validationResult = appointmentSchema.safeParse({
      client_name: formData.name.trim(),
      client_phone: formData.phone.trim(),
      client_email: formData.email.trim() || undefined,
      notes: formData.notes.trim() || undefined
    });

    if (!validationResult.success) {
      const errs: Record<string, string> = {};
      validationResult.error.errors.forEach(err => {
        const field = err.path[0] as string;
        if (!errs[field]) errs[field] = err.message;
      });
      setFieldErrors(errs);
      return;
    }

    const validatedData = validationResult.data;
    
    if (!hasRecaptchaToken()) {
      setFormError('יש לאמת את reCAPTCHA');
      return;
    }

    const isHuman = await verifyRecaptcha();
    if (!isHuman) {
      setFormError('אימות reCAPTCHA נכשל, נסו שוב');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        client_name: validatedData.client_name,
        client_phone: validatedData.client_phone,
        client_email: validatedData.client_email || null,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime + ':00',
        notes: validatedData.notes || null,
        treatment_slug: selectedTreatment || null
      } as any);

      if (error) {
        if (error.message.includes('rate_limit')) {
          setFormError('יותר מדי בקשות. נסה שוב מאוחר יותר');
        } else {
          setFormError('אירעה שגיאה בקביעת התור. נסה שוב.');
        }
        return;
      }

      try {
        const { data: whatsappData } = await supabase.functions.invoke('send-appointment-confirmation', {
          body: {
            clientName: validatedData.client_name,
            clientPhone: validatedData.client_phone,
            appointmentDate: format(selectedDate, 'dd/MM/yyyy'),
            appointmentTime: selectedTime
          }
        });
        if (whatsappData?.success && whatsappData?.whatsappUrl) {
          window.open(whatsappData.whatsappUrl, '_blank');
        }
      } catch { /* silent */ }

      toast.success('התור נקבע בהצלחה!');
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedTreatment('');
      setFormData({ name: '', phone: '', email: '', notes: '' });
    } catch {
      setFormError('אירעה שגיאה בקביעת התור');
    } finally {
      setIsLoading(false);
    }
  };

  const today = startOfToday();
  const monthDays = getMonthDays();
  const thisMonth = startOfMonth(today);

  return (
    <SectionWrapper id="booking">
      <Container>
        <Header>
          <Badge>
            <Calendar size={16} style={{ marginLeft: '0.5rem' }} />
            קביעת תור
          </Badge>
          <Title $size="lg" style={{ marginTop: '1rem' }}>
            קבעו תור עכשיו
          </Title>
          <Text $color="muted" $size="lg">
            בחרו תאריך ושעה נוחים לכם
          </Text>
        </Header>

        <BookingCard>
          <BookingGrid>
            {/* Calendar Column */}
            <BookingColumn>
              <ColumnHeader>
                <ColumnIcon><Calendar size={20} /></ColumnIcon>
                <div>
                  <ColumnTitle>בחר תאריך</ColumnTitle>
                  <ColumnSubtitle>א׳ - ה׳</ColumnSubtitle>
                </div>
              </ColumnHeader>
              
              <CalendarNav>
                <MonthLabel>{format(currentMonth, 'MMMM yyyy', { locale: he })}</MonthLabel>
                <NavButtons>
                  <NavButton 
                    onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                    disabled={isSameMonth(currentMonth, thisMonth)}
                  >
                    <ChevronRight size={16} />
                  </NavButton>
                  <NavButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronLeft size={16} />
                  </NavButton>
                </NavButtons>
              </CalendarNav>

              <WeekDays>
                {hebrewDays.map(day => (<WeekDay key={day}>{day}</WeekDay>))}
              </WeekDays>

              <DaysGrid>
                {monthDays.map((date, index) => {
                  if (!date) return <DayButton key={`empty-${index}`} $isDisabled disabled style={{ visibility: 'hidden' }} />;
                  const isWorking = isWorkingDay(date);
                  const isPast = date < today;
                  return (
                    <DayButton
                      key={date.toISOString()}
                      $isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
                      $isToday={isSameDay(date, today)}
                      $isDisabled={!isWorking || isPast}
                      disabled={!isWorking || isPast}
                      onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                    >
                      {format(date, 'd')}
                    </DayButton>
                  );
                })}
              </DaysGrid>
            </BookingColumn>

            {/* Time Slots Column */}
            <BookingColumn $withBorder>
              <ColumnHeader>
                <ColumnIcon><Clock size={20} /></ColumnIcon>
                <div>
                  <ColumnTitle>בחר שעה</ColumnTitle>
                  <ColumnSubtitle>
                    {selectedDate ? format(selectedDate, 'd בMMMM', { locale: he }) : '09:00 - 17:00'}
                  </ColumnSubtitle>
                </div>
              </ColumnHeader>

              {selectedDate ? (
                <>
                  <TimeSlotsContainer>
                    {timeSlots
                      .filter(time => !isTimeBooked(selectedDate, time))
                      .map(time => (
                        <TimeSlot
                          key={time}
                          $isSelected={selectedTime === time}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </TimeSlot>
                      ))}
                    {timeSlots.filter(time => !isTimeBooked(selectedDate, time)).length === 0 && (
                      <EmptyState style={{ gridColumn: '1 / -1' }}>
                        <EmptyStateIcon><X size={24} /></EmptyStateIcon>
                        <EmptyStateText>אין שעות פנויות ביום זה<br />נסו לבחור תאריך אחר</EmptyStateText>
                      </EmptyState>
                    )}
                  </TimeSlotsContainer>
                  <Legend>
                    <LegendItem><LegendDot $variant="available" /><span>פנוי</span></LegendItem>
                    <LegendItem><LegendDot $variant="selected" /><span>נבחר</span></LegendItem>
                  </Legend>
                </>
              ) : (
                <EmptyState>
                  <EmptyStateIcon><CalendarDays size={24} /></EmptyStateIcon>
                  <EmptyStateText>בחרו תאריך מהלוח כדי לראות<br />את השעות הפנויות</EmptyStateText>
                </EmptyState>
              )}
            </BookingColumn>

            {/* Form Column */}
            <BookingColumn $withBorder>
              <ColumnHeader>
                <ColumnIcon><User size={20} /></ColumnIcon>
                <div>
                  <ColumnTitle>פרטים אישיים</ColumnTitle>
                  <ColumnSubtitle>מלאו את הפרטים</ColumnSubtitle>
                </div>
              </ColumnHeader>

              {selectedDate && selectedTime && (
                <SelectedAppointment>
                  <SelectedLabel>התור שנבחר:</SelectedLabel>
                  <SelectedValue>
                    {format(selectedDate, 'EEEE, d בMMMM', { locale: he })} | {selectedTime}
                  </SelectedValue>
                </SelectedAppointment>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {formError && (
                  <FormError>
                    <AlertTriangle size={18} />
                    <span>{formError}</span>
                  </FormError>
                )}

                <FormGroup>
                  <Label><User size={14} />שם מלא *</Label>
                  <Input
                    type="text"
                    placeholder="הכנס שם מלא"
                    value={formData.name}
                    $hasError={!!fieldErrors.client_name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearFieldError('client_name'); }}
                  />
                  {fieldErrors.client_name && (
                    <FieldError><AlertTriangle size={13} /><span>{fieldErrors.client_name}</span></FieldError>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label><Phone size={14} />טלפון *</Label>
                  <Input
                    type="tel"
                    placeholder="05X-XXX-XXXX"
                    value={formData.phone}
                    $hasError={!!fieldErrors.client_phone}
                    onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); clearFieldError('client_phone'); }}
                    dir="ltr"
                  />
                  {fieldErrors.client_phone && (
                    <FieldError><AlertTriangle size={13} /><span>{fieldErrors.client_phone}</span></FieldError>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label><Mail size={14} />אימייל</Label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    $hasError={!!fieldErrors.client_email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearFieldError('client_email'); }}
                    dir="ltr"
                  />
                  {fieldErrors.client_email && (
                    <FieldError><AlertTriangle size={13} /><span>{fieldErrors.client_email}</span></FieldError>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label><Stethoscope size={14} />סוג טיפול</Label>
                  <Select
                    value={selectedTreatment}
                    onChange={(e) => setSelectedTreatment(e.target.value)}
                  >
                    <option value="">בחר טיפול (אופציונלי)</option>
                    {treatments.map(t => (
                      <option key={t.slug} value={t.slug}>{t.title}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>הערות</Label>
                  <Textarea
                    placeholder="הערות נוספות..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </FormGroup>

                <div id="recaptcha-appointment" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', transform: 'scale(0.9)', transformOrigin: 'center' }} />

                <Button 
                  type="submit" 
                  $variant="heroPrimary" 
                  $size="lg" 
                  $fullWidth
                  disabled={!selectedDate || !selectedTime || isLoading}
                >
                  {isLoading ? 'שולח...' : (
                    <>
                      <Check size={18} />
                      אישור קביעת תור
                    </>
                  )}
                </Button>
              </form>
            </BookingColumn>
          </BookingGrid>
        </BookingCard>
      </Container>
    </SectionWrapper>
  );
};

export default AppointmentBooking;
