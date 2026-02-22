import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Badge } from '@/components/styled/Layout';
import { Calendar, Phone, Mail, Clock, Loader2, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

const Table = styled.table`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Th = styled.th`
  text-align: right;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.secondary}80;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.foreground};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ $status }) => 
    $status === 'confirmed' ? '#dcfce7' :
    $status === 'cancelled' ? '#fee2e2' :
    '#fef3c7'
  };
  color: ${({ $status }) => 
    $status === 'confirmed' ? '#166534' :
    $status === 'cancelled' ? '#991b1b' :
    '#92400e'
  };
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: 'success' | 'danger' | 'default' }>`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  color: ${({ $variant }) => 
    $variant === 'success' ? '#16a34a' :
    $variant === 'danger' ? '#dc2626' :
    'inherit'
  };
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const AdminAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });
      
      if (error) throw error;
      return data as Appointment[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      toast.success('סטטוס התור עודכן בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה בעדכון הסטטוס');
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      toast.success('התור נמחק בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה במחיקת התור');
    },
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: he });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'מאושר';
      case 'cancelled': return 'בוטל';
      default: return 'ממתין';
    }
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
      </LoadingWrapper>
    );
  }

  return (
    <div>
      <PageHeader>
        <div>
          <Title $size="md">ניהול תורים</Title>
          <Text $color="muted">צפה ונהל את כל התורים במערכת</Text>
        </div>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>סה"כ תורים</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>ממתינים</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.confirmed}</StatValue>
          <StatLabel>מאושרים</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.cancelled}</StatValue>
          <StatLabel>בוטלו</StatLabel>
        </StatCard>
      </StatsGrid>

      {appointments.length === 0 ? (
        <EmptyState>
          <Calendar size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">אין תורים במערכת</Title>
          <Text $color="muted">תורים חדשים יופיעו כאן</Text>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>שם הלקוח</Th>
              <Th>טלפון</Th>
              <Th>תאריך</Th>
              <Th>שעה</Th>
              <Th>סטטוס</Th>
              <Th>פעולות</Th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <Td>{appointment.client_name}</Td>
                <Td dir="ltr">{appointment.client_phone}</Td>
                <Td>{formatDate(appointment.appointment_date)}</Td>
                <Td>{appointment.appointment_time}</Td>
                <Td>
                  <StatusBadge $status={appointment.status}>
                    {getStatusLabel(appointment.status)}
                  </StatusBadge>
                </Td>
                <Td>
                  <Actions>
                    <ActionButton onClick={() => setSelectedAppointment(appointment)} title="פרטים">
                      <Eye size={18} />
                    </ActionButton>
                    {appointment.status !== 'confirmed' && (
                      <ActionButton 
                        $variant="success" 
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: 'confirmed' })}
                        title="אשר"
                      >
                        <CheckCircle size={18} />
                      </ActionButton>
                    )}
                    {appointment.status !== 'cancelled' && (
                      <ActionButton 
                        $variant="danger" 
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: 'cancelled' })}
                        title="בטל"
                      >
                        <XCircle size={18} />
                      </ActionButton>
                    )}
                    <ActionButton 
                      $variant="danger" 
                      onClick={() => {
                        if (confirm('האם אתה בטוח שברצונך למחוק את התור?')) {
                          deleteAppointment.mutate(appointment.id);
                        }
                      }}
                      title="מחק"
                    >
                      <Trash2 size={18} />
                    </ActionButton>
                  </Actions>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedAppointment && (
        <Modal onClick={() => setSelectedAppointment(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="sm">פרטי תור</Title>
              <StatusBadge $status={selectedAppointment.status}>
                {getStatusLabel(selectedAppointment.status)}
              </StatusBadge>
            </ModalHeader>
            
            <DetailRow>
              <Calendar size={20} />
              <div>
                <Text $size="sm" $color="muted">תאריך ושעה</Text>
                <Text>{formatDate(selectedAppointment.appointment_date)} בשעה {selectedAppointment.appointment_time}</Text>
              </div>
            </DetailRow>
            
            <DetailRow>
              <Phone size={20} />
              <div>
                <Text $size="sm" $color="muted">טלפון</Text>
                <Text dir="ltr">{selectedAppointment.client_phone}</Text>
              </div>
            </DetailRow>
            
            {selectedAppointment.client_email && (
              <DetailRow>
                <Mail size={20} />
                <div>
                  <Text $size="sm" $color="muted">אימייל</Text>
                  <Text dir="ltr">{selectedAppointment.client_email}</Text>
                </div>
              </DetailRow>
            )}
            
            {selectedAppointment.notes && (
              <DetailRow>
                <Text $size="sm" $color="muted">הערות</Text>
                <Text>{selectedAppointment.notes}</Text>
              </DetailRow>
            )}
            
            <DetailRow>
              <Clock size={20} />
              <div>
                <Text $size="sm" $color="muted">נוצר בתאריך</Text>
                <Text>{format(new Date(selectedAppointment.created_at), 'dd/MM/yyyy HH:mm', { locale: he })}</Text>
              </div>
            </DetailRow>

            <Button 
              $variant="outline" 
              $fullWidth 
              onClick={() => setSelectedAppointment(null)}
              style={{ marginTop: '1.5rem' }}
            >
              סגור
            </Button>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default AdminAppointments;
