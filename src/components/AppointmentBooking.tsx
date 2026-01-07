import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, addDays, isSameDay, startOfToday, getDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar, Clock, User, Phone, Mail, ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  text-align: center;
  max-width: 42rem;
  margin: 0 auto ${({ theme }) => theme.spacing[12]};
`;

const BookingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CalendarSection = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CalendarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CalendarNav = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.foreground};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.mutedForeground};
  padding: 0.5rem 0;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const DayButton = styled.button<{ $isSelected?: boolean; $isToday?: boolean; $isDisabled?: boolean }>`
  width: 100%;
  height: 2.5rem;
  min-width: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  background: ${({ $isSelected, $isToday, theme }) => 
    $isSelected ? theme.gradients.hero : 
    $isToday ? theme.colors.primaryLight : 
    theme.colors.secondary};
  
  color: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primaryForeground : theme.colors.foreground};
  
  opacity: ${({ $isDisabled }) => $isDisabled ? 0.3 : 1};
  cursor: ${({ $isDisabled }) => $isDisabled ? 'not-allowed' : 'pointer'};
  
  &:hover:not(:disabled) {
    background: ${({ $isSelected, theme }) => 
      $isSelected ? theme.gradients.hero : theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
  }
`;

const TimeSection = styled.div`
  margin-top: 2rem;
`;

const TimeTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const TimeSlot = styled.button<{ $isSelected?: boolean; $isBooked?: boolean }>`
  padding: 0.75rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  background: ${({ $isSelected, $isBooked, theme }) => 
    $isBooked ? theme.colors.destructive + '20' :
    $isSelected ? theme.gradients.hero : 
    theme.colors.secondary};
  
  color: ${({ $isSelected, $isBooked, theme }) => 
    $isBooked ? theme.colors.destructive :
    $isSelected ? theme.colors.primaryForeground : 
    theme.colors.foreground};
  
  cursor: ${({ $isBooked }) => $isBooked ? 'not-allowed' : 'pointer'};
  
  &:hover:not(:disabled) {
    ${({ $isBooked, $isSelected, theme }) => !$isBooked && `
      background: ${$isSelected ? theme.gradients.hero : theme.colors.primary};
      color: ${theme.colors.primaryForeground};
    `}
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

const LegendDot = styled.div<{ $variant: 'available' | 'booked' | 'selected' }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $variant, theme }) => 
    $variant === 'available' ? theme.colors.secondary :
    $variant === 'booked' ? theme.colors.destructive + '40' :
    theme.colors.primary};
`;

const FormSection = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  min-height: 80px;
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

const SelectedInfo = styled.div`
  background: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const SelectedInfoTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const SelectedInfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
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

  // Fetch booked appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, appointment_time')
        .eq('status', 'pending')
        .gte('appointment_date', format(weekStart, 'yyyy-MM-dd'));
      
      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }
      
      setBookedSlots(data || []);
    };

    fetchAppointments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
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

    if (!formData.name || !formData.phone) {
      toast.error('יש למלא שם וטלפון');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('appointments').insert({
        client_name: formData.name,
        client_phone: formData.phone,
        client_email: formData.email || null,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime + ':00',
        notes: formData.notes || null
      });

      if (error) throw error;

      // Send WhatsApp notification
      try {
        await supabase.functions.invoke('send-whatsapp', {
          body: {
            phone: formData.phone,
            name: formData.name,
            date: format(selectedDate, 'dd/MM/yyyy'),
            time: selectedTime
          }
        });
      } catch (whatsappError) {
        console.log('WhatsApp notification skipped:', whatsappError);
      }

      toast.success('התור נקבע בהצלחה! תקבל הודעת אישור בוואטסאפ');
      
      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: '', phone: '', email: '', notes: '' });
    } catch (error) {
      console.error('Error booking appointment:', error);
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
            בחרו תאריך ושעה נוחים לכם מתוך התורים הפנויים
          </Text>
        </Header>

        <BookingContainer>
          <CalendarSection>
            <CalendarHeader>
              <CalendarTitle>
                <Calendar size={24} />
                {format(weekStart, 'MMMM yyyy', { locale: he })}
              </CalendarTitle>
              <CalendarNav>
                <NavButton 
                  onClick={() => setWeekStart(addDays(weekStart, -7))}
                  disabled={isSameDay(weekStart, today)}
                >
                  <ChevronRight size={20} />
                </NavButton>
                <NavButton onClick={() => setWeekStart(addDays(weekStart, 7))}>
                  <ChevronLeft size={20} />
                </NavButton>
              </CalendarNav>
            </CalendarHeader>

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

            <DaysGrid style={{ marginTop: '0.5rem' }}>
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

            {selectedDate && (
              <TimeSection>
                <TimeTitle>
                  <Clock size={20} />
                  בחר שעה - {format(selectedDate, 'EEEE, d בMMMM', { locale: he })}
                </TimeTitle>
                <TimeSlotsGrid>
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
                        {isBooked ? <X size={14} /> : null}
                        {time}
                      </TimeSlot>
                    );
                  })}
                </TimeSlotsGrid>
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
              </TimeSection>
            )}
          </CalendarSection>

          <FormSection>
            <FormTitle>פרטי הלקוח</FormTitle>
            
            {selectedDate && selectedTime && (
              <SelectedInfo>
                <SelectedInfoTitle>התור שנבחר:</SelectedInfoTitle>
                <SelectedInfoText>
                  {format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })} בשעה {selectedTime}
                </SelectedInfoText>
              </SelectedInfo>
            )}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <User size={16} />
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
                  <Phone size={16} />
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
                  <Mail size={16} />
                  אימייל (אופציונלי)
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
                <Label>הערות (אופציונלי)</Label>
                <Textarea
                  placeholder="הערות נוספות לתור..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </FormGroup>

              <Button 
                type="submit" 
                $variant="heroPrimary" 
                $size="xl" 
                $fullWidth
                disabled={!selectedDate || !selectedTime || isLoading}
              >
                {isLoading ? 'שולח...' : (
                  <>
                    <Check size={20} />
                    אישור קביעת תור
                  </>
                )}
              </Button>
            </form>
          </FormSection>
        </BookingContainer>
      </Container>
    </SectionWrapper>
  );
};

export default AppointmentBooking;
