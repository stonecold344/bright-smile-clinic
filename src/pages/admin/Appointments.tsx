import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Badge } from '@/components/styled/Layout';
import { Calendar, Phone, Mail, Clock, Loader2, Trash2, CheckCircle, XCircle, Eye, UserCheck, UserX, Stethoscope } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useTreatments } from '@/hooks/useTreatments';

// --- Styled Components ---

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.button<{ $active?: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  text-align: right;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $active, theme }) => $active ? theme.colors.primaryForeground : theme.colors.foreground};
`;

const StatLabel = styled.div<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $active }) => $active ? 'hsla(0, 0%, 100%, 0.8)' : undefined};
  ${({ $active, theme }) => !$active && `color: ${theme.colors.mutedForeground};`}
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
  white-space: nowrap;
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
    $status === 'arrived' ? '#dbeafe' :
    $status === 'no_show' ? '#fce4ec' :
    $status === 'completed' ? '#e8f5e9' :
    '#fef3c7'
  };
  color: ${({ $status }) => 
    $status === 'confirmed' ? '#166534' :
    $status === 'cancelled' ? '#991b1b' :
    $status === 'arrived' ? '#1e40af' :
    $status === 'no_show' ? '#880e4f' :
    $status === 'completed' ? '#1b5e20' :
    '#92400e'
  };
`;

const Actions = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'success' | 'danger' | 'info' | 'default' }>`
  padding: 0.4rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  color: ${({ $variant }) => 
    $variant === 'success' ? '#16a34a' :
    $variant === 'danger' ? '#dc2626' :
    $variant === 'info' ? '#2563eb' :
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
    flex-shrink: 0;
  }
`;

const TreatmentSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  cursor: pointer;
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ModalActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

// --- Types ---

const ACTIVE_STATUSES = ['pending', 'confirmed', 'arrived'];

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
  treatment_slug: string | null;
}

// --- Component ---

const AdminAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [treatmentModal, setTreatmentModal] = useState<{ id: string; slug: string } | null>(null);
  const queryClient = useQueryClient();
  const { data: treatments = [] } = useTreatments();

  const { data: allAppointments = [], isLoading } = useQuery({
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

  // Only show active appointments (not archived)
  const appointments = useMemo(() => 
    allAppointments.filter(a => ACTIVE_STATUSES.includes(a.status)),
    [allAppointments]
  );

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, treatment_slug }: { id: string; status: string; treatment_slug?: string | null }) => {
      const updateData: Record<string, any> = { status };
      if (treatment_slug !== undefined) updateData.treatment_slug = treatment_slug;
      
      const { error } = await supabase
        .from('appointments')
        .update(updateData as any)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-archive'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin-archive'] });
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
  };

  const filteredAppointments = useMemo(() => {
    if (!statusFilter) return appointments;
    return appointments.filter(a => a.status === statusFilter);
  }, [appointments, statusFilter]);

  const toggleFilter = (filter: string) => {
    setStatusFilter(prev => prev === filter ? null : filter);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: he });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'מאושר';
      case 'cancelled': return 'בוטל';
      case 'arrived': return 'הגיע';
      case 'no_show': return 'לא הגיע';
      case 'completed': return 'טופל';
      default: return 'ממתין';
    }
  };

  const handleCompleteWithTreatment = () => {
    if (!treatmentModal) return;
    updateStatus.mutate({
      id: treatmentModal.id,
      status: 'completed',
      treatment_slug: treatmentModal.slug || null,
    });
    setTreatmentModal(null);
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
          <Text $color="muted">צפה ונהל את התורים הפעילים</Text>
        </div>
      </PageHeader>

      <StatsGrid>
        <StatCard $active={statusFilter === null} onClick={() => setStatusFilter(null)}>
          <StatValue $active={statusFilter === null}>{stats.total}</StatValue>
          <StatLabel $active={statusFilter === null}>סה"כ פעילים</StatLabel>
        </StatCard>
        <StatCard $active={statusFilter === 'pending'} onClick={() => toggleFilter('pending')}>
          <StatValue $active={statusFilter === 'pending'}>{stats.pending}</StatValue>
          <StatLabel $active={statusFilter === 'pending'}>ממתינים</StatLabel>
        </StatCard>
        <StatCard $active={statusFilter === 'confirmed'} onClick={() => toggleFilter('confirmed')}>
          <StatValue $active={statusFilter === 'confirmed'}>{stats.confirmed}</StatValue>
          <StatLabel $active={statusFilter === 'confirmed'}>מאושרים</StatLabel>
        </StatCard>
      </StatsGrid>

      {filteredAppointments.length === 0 ? (
        <EmptyState>
          <Calendar size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">{statusFilter ? 'אין תורים בסטטוס זה' : 'אין תורים פעילים'}</Title>
          <Text $color="muted">{statusFilter ? 'נסה לבחור סטטוס אחר' : 'תורים חדשים יופיעו כאן'}</Text>
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
            {filteredAppointments.map((appointment) => (
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
                    {appointment.status === 'pending' && (
                      <ActionButton 
                        $variant="success" 
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: 'confirmed' })}
                        title="אשר תור"
                      >
                        <CheckCircle size={18} />
                      </ActionButton>
                    )}
                    {(appointment.status === 'confirmed' || appointment.status === 'arrived') && (
                      <ActionButton 
                        $variant="info"
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: 'arrived' })}
                        title="לקוח הגיע"
                      >
                        <UserCheck size={18} />
                      </ActionButton>
                    )}
                    {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                      <ActionButton 
                        $variant="danger"
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: 'no_show' })}
                        title="לקוח לא הגיע (העבר לארכיון)"
                      >
                        <UserX size={18} />
                      </ActionButton>
                    )}
                    {(appointment.status === 'arrived' || appointment.status === 'confirmed') && (
                      <ActionButton 
                        $variant="success"
                        onClick={() => setTreatmentModal({ id: appointment.id, slug: appointment.treatment_slug || '' })}
                        title="סמן כטופל (בחר טיפול והעבר לארכיון)"
                      >
                        <Stethoscope size={18} />
                      </ActionButton>
                    )}
                    {appointment.status !== 'cancelled' && (
                      <ActionButton 
                        $variant="danger" 
                        onClick={() => updateStatus.mutate({ id: appointment.id, status: 'cancelled' })}
                        title="בטל תור (העבר לארכיון)"
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

      {/* Treatment completion modal */}
      {treatmentModal && (
        <Modal onClick={() => setTreatmentModal(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="sm">סיום טיפול</Title>
            </ModalHeader>
            <Text $color="muted" style={{ marginBottom: '1.5rem' }}>
              בחר את הטיפול שבוצע ולחץ אישור. התור יועבר לארכיון.
            </Text>
            <TreatmentSelect
              value={treatmentModal.slug}
              onChange={(e) => setTreatmentModal({ ...treatmentModal, slug: e.target.value })}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              <option value="">ללא טיפול ספציפי</option>
              {treatments.map(t => (
                <option key={t.slug} value={t.slug}>{t.title}</option>
              ))}
            </TreatmentSelect>
            <ModalActionsRow>
              <Button $variant="heroPrimary" $fullWidth onClick={handleCompleteWithTreatment}>
                <CheckCircle size={18} />
                אשר וסיים
              </Button>
              <Button $variant="outline" $fullWidth onClick={() => setTreatmentModal(null)}>
                ביטול
              </Button>
            </ModalActionsRow>
          </ModalContent>
        </Modal>
      )}

      {/* Appointment details modal */}
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
