import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Badge } from '@/components/styled/Layout';
import { Calendar, Clock, Search, Filter, User, Phone, Eye, Stethoscope, X } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useTreatments } from '@/hooks/useTreatments';
import { Button } from '@/components/styled/Button';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FiltersWrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  margin-bottom: 2rem;
`;

const FiltersTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 1rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const FilterGroup = styled.div``;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-bottom: 0.375rem;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
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

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }
`;

const ClearFilters = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 1rem;
  background: none;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.7;
  }
`;

const ResultCount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-bottom: 1rem;
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
    '#fef3c7'
  };
  color: ${({ $status }) =>
    $status === 'confirmed' ? '#166534' :
    $status === 'cancelled' ? '#991b1b' :
    '#92400e'
  };
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

const ActionButton = styled.button`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
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
  treatment_slug: string | null;
}

const AdminArchive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [hourFilter, setHourFilter] = useState('');
  const [treatmentFilter, setTreatmentFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const { data: treatments = [] } = useTreatments();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['admin-archive'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false });

      if (error) throw error;
      return (data as Appointment[]) || [];
    },
  });

  const hasActiveFilters = searchQuery || dateFilter || hourFilter || treatmentFilter;

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Search by client name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = apt.client_name.toLowerCase().includes(query);
        if (!nameMatch) return false;
      }

      // Filter by date
      if (dateFilter) {
        if (apt.appointment_date !== dateFilter) return false;
      }

      // Filter by hour
      if (hourFilter) {
        const aptHour = apt.appointment_time.substring(0, 2);
        if (aptHour !== hourFilter) return false;
      }

      // Filter by treatment
      if (treatmentFilter) {
        if (apt.treatment_slug !== treatmentFilter) return false;
      }

      return true;
    });
  }, [appointments, searchQuery, dateFilter, hourFilter, treatmentFilter]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setDateFilter('');
    setHourFilter('');
    setTreatmentFilter('');
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

  const getTreatmentTitle = (slug: string | null) => {
    if (!slug) return '—';
    const treatment = treatments.find(t => t.slug === slug);
    return treatment?.title || slug;
  };

  // Generate unique hours from appointments
  const availableHours = useMemo(() => {
    const hours = new Set<string>();
    for (let h = 9; h < 17; h++) {
      hours.add(h.toString().padStart(2, '0'));
    }
    return Array.from(hours).sort();
  }, []);

  if (isLoading) {
    return (
      <EmptyState>
        <div className="animate-spin" style={{ margin: '0 auto', width: 48, height: 48, border: '3px solid hsl(var(--primary) / 0.2)', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%' }} />
      </EmptyState>
    );
  }

  return (
    <div>
      <PageHeader>
        <div>
          <Title $size="md">ארכיון תורים</Title>
          <Text $color="muted">חיפוש וסינון של כל התורים במערכת</Text>
        </div>
        <Badge>{appointments.length} תורים</Badge>
      </PageHeader>

      <FiltersWrapper>
        <FiltersTitle>
          <Filter size={18} />
          סינון וחיפוש
        </FiltersTitle>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel><Search size={14} />חיפוש לפי שם</FilterLabel>
            <FilterInput
              type="text"
              placeholder="שם פרטי או משפחה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel><Calendar size={14} />תאריך</FilterLabel>
            <FilterInput
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel><Clock size={14} />שעה</FilterLabel>
            <FilterSelect value={hourFilter} onChange={(e) => setHourFilter(e.target.value)}>
              <option value="">כל השעות</option>
              {availableHours.map(h => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel><Stethoscope size={14} />טיפול</FilterLabel>
            <FilterSelect value={treatmentFilter} onChange={(e) => setTreatmentFilter(e.target.value)}>
              <option value="">כל הטיפולים</option>
              {treatments.map(t => (
                <option key={t.slug} value={t.slug}>{t.title}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FiltersGrid>
        {hasActiveFilters && (
          <ClearFilters onClick={clearAllFilters}>
            <X size={14} />
            נקה סינון
          </ClearFilters>
        )}
      </FiltersWrapper>

      <ResultCount>
        {hasActiveFilters 
          ? `נמצאו ${filteredAppointments.length} תוצאות מתוך ${appointments.length}`
          : `${appointments.length} תורים סה"כ`
        }
      </ResultCount>

      {filteredAppointments.length === 0 ? (
        <EmptyState>
          <Search size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">{hasActiveFilters ? 'לא נמצאו תוצאות' : 'אין תורים במערכת'}</Title>
          <Text $color="muted">{hasActiveFilters ? 'נסה לשנות את הסינון' : 'תורים חדשים יופיעו כאן'}</Text>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>שם הלקוח</Th>
              <Th>טלפון</Th>
              <Th>תאריך</Th>
              <Th>שעה</Th>
              <Th>טיפול</Th>
              <Th>סטטוס</Th>
              <Th>פרטים</Th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((apt) => (
              <tr key={apt.id}>
                <Td>{apt.client_name}</Td>
                <Td dir="ltr">{apt.client_phone}</Td>
                <Td>{formatDate(apt.appointment_date)}</Td>
                <Td>{apt.appointment_time}</Td>
                <Td>{getTreatmentTitle(apt.treatment_slug)}</Td>
                <Td>
                  <StatusBadge $status={apt.status}>
                    {getStatusLabel(apt.status)}
                  </StatusBadge>
                </Td>
                <Td>
                  <ActionButton onClick={() => setSelectedAppointment(apt)} title="פרטים">
                    <Eye size={18} />
                  </ActionButton>
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
              <User size={20} />
              <div>
                <Text $size="sm" $color="muted">שם הלקוח</Text>
                <Text>{selectedAppointment.client_name}</Text>
              </div>
            </DetailRow>

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

            {selectedAppointment.treatment_slug && (
              <DetailRow>
                <Stethoscope size={20} />
                <div>
                  <Text $size="sm" $color="muted">טיפול</Text>
                  <Text>{getTreatmentTitle(selectedAppointment.treatment_slug)}</Text>
                </div>
              </DetailRow>
            )}

            {selectedAppointment.client_email && (
              <DetailRow>
                <div>
                  <Text $size="sm" $color="muted">אימייל</Text>
                  <Text dir="ltr">{selectedAppointment.client_email}</Text>
                </div>
              </DetailRow>
            )}

            {selectedAppointment.notes && (
              <DetailRow>
                <div>
                  <Text $size="sm" $color="muted">הערות</Text>
                  <Text>{selectedAppointment.notes}</Text>
                </div>
              </DetailRow>
            )}

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

export default AdminArchive;
