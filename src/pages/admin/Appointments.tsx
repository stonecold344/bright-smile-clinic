import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Badge } from '@/components/styled/Layout';
import { Calendar as CalendarIcon, Phone, Mail, Clock, Loader2, Trash2, CheckCircle, XCircle, Eye, UserCheck, UserX, Stethoscope, Search, Filter, X, ImagePlus, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useTreatments } from '@/hooks/useTreatments';
import ImageUpload from '@/components/ImageUpload';
import ImageLightbox from '@/components/ImageLightbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

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
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
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

  &:hover {
    opacity: 0.7;
  }
`;

const TableWrapper = styled.div`
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
`;

const MobileCards = styled.div`
  display: none;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const MobileCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1rem 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0;
  text-align: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const MobileCardLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

const MobileCardValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Th = styled.th<{ $sortable?: boolean }>`
  text-align: center;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.secondary}80;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
  cursor: ${({ $sortable }) => $sortable ? 'pointer' : 'default'};
  user-select: ${({ $sortable }) => $sortable ? 'none' : 'auto'};
  transition: background 0.15s;

  &:hover {
    background: ${({ $sortable, theme }) => $sortable ? `${theme.colors.secondary}` : `${theme.colors.secondary}80`};
  }
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.foreground};
  text-align: center;
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
  justify-content: center;
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

const ImageSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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
  images: string[];
}

// --- Component ---

const ISRAELI_PHONE_REGEX = /^0[2-9]\d{0,8}$/;

const AdminAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'time' | 'status' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [hourFilter, setHourFilter] = useState('');
  const [treatmentModal, setTreatmentModal] = useState<{ id: string; slug: string } | null>(null);
  const [imageModal, setImageModal] = useState<{ id: string; images: string[] } | null>(null);
  const queryClient = useQueryClient();
  const { data: treatments = [] } = useTreatments();

  // Lock body scroll when any modal is open
  const isAnyModalOpen = !!selectedAppointment || !!treatmentModal || !!imageModal;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isAnyModalOpen]);

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

  const updateImages = useMutation({
    mutationFn: async ({ id, images }: { id: string; images: string[] }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ images } as any)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-archive'] });
      toast.success('התמונות עודכנו בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה בעדכון התמונות');
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

  const hasActiveFilters = searchQuery || phoneSearch || dateFilter || hourFilter || statusFilter;

  const handlePhoneChange = (value: string) => {
    // Allow only digits and dashes
    const cleaned = value.replace(/[^0-9-]/g, '');
    setPhoneSearch(cleaned);
    if (cleaned && !ISRAELI_PHONE_REGEX.test(cleaned.replace(/-/g, ''))) {
      setPhoneError('פורמט ישראלי: 05X-XXXXXXX');
    } else {
      setPhoneError('');
    }
  };

  const handleNameChange = (value: string) => {
    // Allow only letters, spaces, and hyphens (Hebrew + English)
    const cleaned = value.replace(/[^a-zA-Zא-ת\s\-']/g, '');
    setSearchQuery(cleaned);
  };

  const availableHours = useMemo(() => {
    const hours: string[] = [];
    for (let h = 9; h < 17; h++) {
      hours.push(h.toString().padStart(2, '0'));
    }
    return hours;
  }, []);

  const filteredAppointments = useMemo(() => {
    let result = appointments;
    if (statusFilter) {
      result = result.filter(a => a.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => a.client_name.toLowerCase().includes(query));
    }
    if (phoneSearch) {
      const cleanPhone = phoneSearch.replace(/-/g, '');
      result = result.filter(a => a.client_phone.replace(/-/g, '').includes(cleanPhone));
    }
    if (dateFilter) {
      result = result.filter(a => a.appointment_date === dateFilter);
    }
    if (hourFilter) {
      result = result.filter(a => a.appointment_time.substring(0, 2) === hourFilter);
    }
    return result;
  }, [appointments, statusFilter, searchQuery, phoneSearch, dateFilter, hourFilter]);

  const sortedAppointments = useMemo(() => {
    if (!sortField) return filteredAppointments;
    return [...filteredAppointments].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = a.appointment_date.localeCompare(b.appointment_date);
      } else if (sortField === 'time') {
        cmp = a.appointment_time.localeCompare(b.appointment_time);
      } else if (sortField === 'status') {
        cmp = a.status.localeCompare(b.status);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredAppointments, sortField, sortDir]);

  const toggleSort = (field: 'date' | 'time' | 'status') => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'date' | 'time' | 'status' }) => {
    if (sortField !== field) return null;
    return (
      <span style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline-flex' }}>
        {sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
      </span>
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPhoneSearch('');
    setPhoneError('');
    setDateFilter('');
    setHourFilter('');
    setStatusFilter(null);
  };

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

  const handleImageChange = (images: string[]) => {
    if (!imageModal) return;
    setImageModal({ ...imageModal, images });
    updateImages.mutate({ id: imageModal.id, images });
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
              onChange={(e) => handleNameChange(e.target.value)}
              maxLength={50}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel><Phone size={14} />חיפוש לפי טלפון</FilterLabel>
            <FilterInput
              type="tel"
              dir="ltr"
              placeholder="05X-XXXXXXX"
              value={phoneSearch}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={11}
            />
            {phoneError && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{phoneError}</span>}
          </FilterGroup>
          <FilterGroup>
            <FilterLabel><CalendarIcon size={14} />תאריך</FilterLabel>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border rounded-lg bg-background text-foreground transition-all",
                    "hover:border-primary focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15",
                    !dateFilter && "text-muted-foreground"
                  )}
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  {dateFilter ? format(new Date(dateFilter), 'dd/MM/yyyy', { locale: he }) : 'בחר תאריך'}
                  <CalendarIcon size={14} className="opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter ? new Date(dateFilter) : undefined}
                  onSelect={(date) => setDateFilter(date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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
        </FiltersGrid>
        {hasActiveFilters && (
          <ClearFilters onClick={clearAllFilters}>
            <X size={14} />
            נקה סינון
          </ClearFilters>
        )}
      </FiltersWrapper>

      {filteredAppointments.length === 0 ? (
        <EmptyState>
          <CalendarIcon size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">{hasActiveFilters ? 'לא נמצאו תוצאות' : 'אין תורים פעילים'}</Title>
          <Text $color="muted">{hasActiveFilters ? 'נסה לשנות את הסינון' : 'תורים חדשים יופיעו כאן'}</Text>
        </EmptyState>
      ) : (
        <>
        <TableWrapper><Table>
          <thead>
            <tr>
              <Th>שם הלקוח</Th>
              <Th>טלפון</Th>
              <Th $sortable onClick={() => toggleSort('date')}>תאריך <SortIcon field="date" /></Th>
              <Th $sortable onClick={() => toggleSort('time')}>שעה <SortIcon field="time" /></Th>
              <Th $sortable onClick={() => toggleSort('status')}>סטטוס <SortIcon field="status" /></Th>
              <Th>פעולות</Th>
            </tr>
          </thead>
          <tbody>
            {sortedAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <Td>{appointment.client_name}</Td>
                <Td dir="ltr">{appointment.client_phone}</Td>
                <Td>{formatDate(appointment.appointment_date)}</Td>
                <Td>{appointment.appointment_time.substring(0, 5)}</Td>
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
                    {appointment.status === 'arrived' && (
                      <ActionButton 
                        $variant={appointment.images && appointment.images.length > 0 ? 'success' : 'info'}
                        onClick={() => setImageModal({ id: appointment.id, images: appointment.images || [] })}
                        title="העלאת תמונות"
                      >
                        <ImagePlus size={18} />
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
        </Table></TableWrapper>


        {/* Mobile card view */}
        <MobileCards>
          {sortedAppointments.map((appointment) => (
            <MobileCard key={appointment.id}>
              <MobileCardRow>
                <MobileCardLabel>שם</MobileCardLabel>
                <MobileCardValue>{appointment.client_name}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>טלפון</MobileCardLabel>
                <MobileCardValue dir="ltr">{appointment.client_phone}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>תאריך</MobileCardLabel>
                <MobileCardValue>{formatDate(appointment.appointment_date)}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>שעה</MobileCardLabel>
                <MobileCardValue>{appointment.appointment_time.substring(0, 5)}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>סטטוס</MobileCardLabel>
                <StatusBadge $status={appointment.status}>{getStatusLabel(appointment.status)}</StatusBadge>
              </MobileCardRow>
              <MobileCardRow>
                <Actions style={{ width: '100%', justifyContent: 'center', paddingTop: '0.5rem' }}>
                  <ActionButton onClick={() => setSelectedAppointment(appointment)} title="פרטים">
                    <Eye size={18} />
                  </ActionButton>
                  {appointment.status === 'pending' && (
                    <ActionButton $variant="success" onClick={() => updateStatus.mutate({ id: appointment.id, status: 'confirmed' })} title="אשר תור">
                      <CheckCircle size={18} />
                    </ActionButton>
                  )}
                  {(appointment.status === 'confirmed' || appointment.status === 'arrived') && (
                    <ActionButton $variant="info" onClick={() => updateStatus.mutate({ id: appointment.id, status: 'arrived' })} title="לקוח הגיע">
                      <UserCheck size={18} />
                    </ActionButton>
                  )}
                  {appointment.status === 'arrived' && (
                    <ActionButton $variant={appointment.images && appointment.images.length > 0 ? 'success' : 'info'} onClick={() => setImageModal({ id: appointment.id, images: appointment.images || [] })} title="העלאת תמונות">
                      <ImagePlus size={18} />
                    </ActionButton>
                  )}
                  {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                    <ActionButton $variant="danger" onClick={() => updateStatus.mutate({ id: appointment.id, status: 'no_show' })} title="לא הגיע">
                      <UserX size={18} />
                    </ActionButton>
                  )}
                  {(appointment.status === 'arrived' || appointment.status === 'confirmed') && (
                    <ActionButton $variant="success" onClick={() => setTreatmentModal({ id: appointment.id, slug: appointment.treatment_slug || '' })} title="סמן כטופל">
                      <Stethoscope size={18} />
                    </ActionButton>
                  )}
                  {appointment.status !== 'cancelled' && (
                    <ActionButton $variant="danger" onClick={() => updateStatus.mutate({ id: appointment.id, status: 'cancelled' })} title="בטל תור">
                      <XCircle size={18} />
                    </ActionButton>
                  )}
                  <ActionButton $variant="danger" onClick={() => { if (confirm('האם אתה בטוח שברצונך למחוק את התור?')) deleteAppointment.mutate(appointment.id); }} title="מחק">
                    <Trash2 size={18} />
                  </ActionButton>
                </Actions>
              </MobileCardRow>
            </MobileCard>
          ))}
        </MobileCards>
        </>
      )}

      {/* Image upload modal */}
      {imageModal && (
        <Modal onClick={() => setImageModal(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="sm">תמונות לקוח</Title>
            </ModalHeader>
            <Text $color="muted" style={{ marginBottom: '1rem' }}>
              העלה תמונות הקשורות לתור זה
            </Text>
            <ImageUpload
              images={imageModal.images}
              onChange={handleImageChange}
              multiple
              folder="appointments"
            />
            <Button 
              $variant="outline" 
              $fullWidth 
              onClick={() => setImageModal(null)}
              style={{ marginTop: '1.5rem' }}
            >
              סגור
            </Button>
          </ModalContent>
        </Modal>
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
              <CalendarIcon size={20} />
              <div>
                <Text $size="sm" $color="muted">תאריך ושעה</Text>
                <Text>{formatDate(selectedAppointment.appointment_date)} בשעה {selectedAppointment.appointment_time.substring(0, 5)}</Text>
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

            {selectedAppointment.images && selectedAppointment.images.length > 0 && (
              <ImageSection>
                <Text $size="sm" $color="muted" style={{ marginBottom: '0.5rem' }}>תמונות וקבצים</Text>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
                  {selectedAppointment.images.map((url, i) => (
                    url.toLowerCase().endsWith('.pdf') ? (
                      <div key={i} onClick={() => setLightboxIndex(i)} style={{ width: '100%', aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '8px', cursor: 'pointer', gap: '0.25rem' }}>
                        <FileText size={28} color="#6b7280" />
                        <span style={{ fontSize: '0.6rem', color: '#6b7280' }}>PDF</span>
                      </div>
                    ) : (
                      <img key={i} src={url} alt={`תמונה ${i + 1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setLightboxIndex(i)} />
                    )
                  ))}
                </div>
              </ImageSection>
            )}
            {lightboxIndex !== null && selectedAppointment.images && (
              <ImageLightbox images={selectedAppointment.images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
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

export default AdminAppointments;
