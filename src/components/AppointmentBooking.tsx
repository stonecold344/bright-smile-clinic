import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, addDays, isSameDay, startOfToday, getDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar, Clock, User, Phone, Mail, ChevronRight, ChevronLeft, Check, X, CalendarDays } from 'lucide-react';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

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
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
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

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
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
  const [weekStart, setWeekStart] = useState(startOfToday());
  const [bookedSlots, setBookedSlots] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Fetch booked appointments using security definer function (no PII exposed)
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .rpc('get_booked_slots', { check_date: format(weekStart, 'yyyy-MM-dd') });
      
      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }
      
      setBookedSlots(data || []);
    };

    fetchAppointments();

    // Subscribe to realtime updates - will trigger refetch
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weekStart]);

  // Generate days for current week view
  const getDaysInWeek = () => {
    const days: Date[] = [];
    for (let i = 0; i < 14; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  };

  // Check if a date is a working day (Sunday to Thursday)
  const isWorkingDay = (date: Date) => {
    const day = getDay(date);
    return day >= 0 && day <= 4; // Sunday = 0, Thursday = 4
  };

  // Check if a time slot is booked
  const isTimeBooked = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookedSlots.some(
      slot => slot.appointment_date === dateStr && slot.appointment_time === time + ':00'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('יש לבחור תאריך ושעה');
      return;
    }

    // Validate form data with Zod schema
    const validationResult = appointmentSchema.safeParse({
      client_name: formData.name.trim(),
      client_phone: formData.phone.trim(),
      client_email: formData.email.trim() || undefined,
      notes: formData.notes.trim() || undefined
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    const validatedData = validationResult.data;
    setIsLoading(true);

    try {
      const { error } = await supabase.from('appointments').insert({
        client_name: validatedData.client_name,
        client_phone: validatedData.client_phone,
        client_email: validatedData.client_email || null,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime + ':00',
        notes: validatedData.notes || null
      });

      if (error) {
        if (error.message.includes('rate_limit')) {
          toast.error('יותר מדי בקשות. נסה שוב מאוחר יותר');
        } else {
          throw error;
        }
        return;
      }

      // Send WhatsApp notification (fire and forget, don't block on errors)
      supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: validatedData.client_phone,
          name: validatedData.client_name,
          date: format(selectedDate, 'dd/MM/yyyy'),
          time: selectedTime
        }
      }).catch(() => {
        // Silently ignore WhatsApp errors - appointment was already created
      });

      toast.success('התור נקבע בהצלחה!');
      
      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: '', phone: '', email: '', notes: '' });
    } catch (error) {
      toast.error('אירעה שגיאה בקביעת התור');
    } finally {
      setIsLoading(false);
    }
  };

  const today = startOfToday();
  const days = getDaysInWeek();

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
                <ColumnIcon>
                  <Calendar size={20} />
                </ColumnIcon>
                <div>
                  <ColumnTitle>בחר תאריך</ColumnTitle>
                  <ColumnSubtitle>א׳ - ה׳</ColumnSubtitle>
                </div>
              </ColumnHeader>
              
              <CalendarNav>
                <MonthLabel>{format(weekStart, 'MMMM yyyy', { locale: he })}</MonthLabel>
                <NavButtons>
                  <NavButton 
                    onClick={() => setWeekStart(addDays(weekStart, -7))}
                    disabled={isSameDay(weekStart, today)}
                  >
                    <ChevronRight size={16} />
                  </NavButton>
                  <NavButton onClick={() => setWeekStart(addDays(weekStart, 7))}>
                    <ChevronLeft size={16} />
                  </NavButton>
                </NavButtons>
              </CalendarNav>

              <WeekDays>
                {hebrewDays.map(day => (
                  <WeekDay key={day}>{day}</WeekDay>
                ))}
              </WeekDays>

              <DaysGrid>
                {days.slice(0, 7).map((date) => {
                  const isWorking = isWorkingDay(date);
                  const isPast = date < today;
                  return (
                    <DayButton
                      key={date.toISOString()}
                      $isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
                      $isToday={isSameDay(date, today)}
                      $isDisabled={!isWorking || isPast}
                      disabled={!isWorking || isPast}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                    >
                      {format(date, 'd')}
                    </DayButton>
                  );
                })}
              </DaysGrid>

              <DaysGrid style={{ marginTop: '0.125rem' }}>
                {days.slice(7, 14).map((date) => {
                  const isWorking = isWorkingDay(date);
                  const isPast = date < today;
                  return (
                    <DayButton
                      key={date.toISOString()}
                      $isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
                      $isToday={isSameDay(date, today)}
                      $isDisabled={!isWorking || isPast}
                      disabled={!isWorking || isPast}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
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
                <ColumnIcon>
                  <Clock size={20} />
                </ColumnIcon>
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
                    {timeSlots.map(time => {
                      const isBooked = isTimeBooked(selectedDate, time);
                      return (
                        <TimeSlot
                          key={time}
                          $isSelected={selectedTime === time}
                          $isBooked={isBooked}
                          disabled={isBooked}
                          onClick={() => !isBooked && setSelectedTime(time)}
                        >
                          {time}
                        </TimeSlot>
                      );
                    })}
                  </TimeSlotsContainer>
                  <Legend>
                    <LegendItem>
                      <LegendDot $variant="available" />
                      <span>פנוי</span>
                    </LegendItem>
                    <LegendItem>
                      <LegendDot $variant="booked" />
                      <span>תפוס</span>
                    </LegendItem>
                    <LegendItem>
                      <LegendDot $variant="selected" />
                      <span>נבחר</span>
                    </LegendItem>
                  </Legend>
                </>
              ) : (
                <EmptyState>
                  <EmptyStateIcon>
                    <CalendarDays size={24} />
                  </EmptyStateIcon>
                  <EmptyStateText>
                    בחרו תאריך מהלוח כדי לראות<br />את השעות הפנויות
                  </EmptyStateText>
                </EmptyState>
              )}
            </BookingColumn>

            {/* Form Column */}
            <BookingColumn $withBorder>
              <ColumnHeader>
                <ColumnIcon>
                  <User size={20} />
                </ColumnIcon>
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

              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>
                    <User size={14} />
                    שם מלא *
                  </Label>
                  <Input
                    type="text"
                    placeholder="הכנס שם מלא"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <Phone size={14} />
                    טלפון *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="05X-XXX-XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    dir="ltr"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <Mail size={14} />
                    אימייל
                  </Label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    dir="ltr"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>הערות</Label>
                  <Textarea
                    placeholder="הערות נוספות..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </FormGroup>

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
