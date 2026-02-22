import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Badge } from '@/components/styled/Layout';
import { Calendar as CalendarIcon, Clock, Search, Filter, User, Phone, Eye, Stethoscope, X, Mail, FileText, ArrowUp, ArrowDown, ImagePlus } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useTreatments } from '@/hooks/useTreatments';
import { Button } from '@/components/styled/Button';
import ImageLightbox from '@/components/ImageLightbox';
import ImageUpload from '@/components/ImageUpload';
import { toast } from '@/components/ui/sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Archived statuses - these don't appear in active appointments
const ARCHIVED_STATUSES = ['cancelled', 'no_show', 'completed'];

// --- Styled Components ---

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
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

const StatCard = styled.button<{ $active?: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.25rem;
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
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
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
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.mutedForeground};
    text-align: center;
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
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }
`;

const DatePickerButton = styled.button<{ $hasValue?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ $hasValue, theme }) => $hasValue ? theme.colors.foreground : theme.colors.mutedForeground};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    opacity: 0.5;
    flex-shrink: 0;
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

const ActionButton = styled.button<{ $variant?: 'success' | 'info' | 'default' }>`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  color: ${({ $variant }) => 
    $variant === 'success' ? '#16a34a' :
    $variant === 'info' ? '#2563eb' :
    'inherit'
  };

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

// --- Types ---

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

const AdminArchive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [hourFilter, setHourFilter] = useState('');
  const [treatmentFilter, setTreatmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sortField, setSortField] = useState<'date' | 'time' | 'status' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const { data: treatments = [] } = useTreatments();
  const queryClient = useQueryClient();
  const [imageModal, setImageModal] = useState<{ id: string; images: string[] } | null>(null);

  // Lock body scroll when any modal is open
  const isAnyModalOpen = !!selectedAppointment || !!imageModal;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isAnyModalOpen]);

  const updateImages = useMutation({
    mutationFn: async ({ id, images }: { id: string; images: string[] }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ images } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-archive'] });
      toast.success('הקבצים עודכנו בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה בעדכון הקבצים');
    },
  });

  const handleImageChange = (images: string[]) => {
    if (!imageModal) return;
    setImageModal({ ...imageModal, images });
    updateImages.mutate({ id: imageModal.id, images });
  };

  const { data: allAppointments = [], isLoading } = useQuery({
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

  // Only show archived appointments
  const archivedAppointments = useMemo(() =>
    allAppointments.filter(a => ARCHIVED_STATUSES.includes(a.status)),
    [allAppointments]
  );

  const stats = useMemo(() => ({
    total: archivedAppointments.length,
    cancelled: archivedAppointments.filter(a => a.status === 'cancelled').length,
    no_show: archivedAppointments.filter(a => a.status === 'no_show').length,
    completed: archivedAppointments.filter(a => a.status === 'completed').length,
  }), [archivedAppointments]);

  const hasActiveFilters = searchQuery || phoneSearch || dateFrom || dateTo || hourFilter || treatmentFilter || statusFilter;

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^0-9-]/g, '');
    setPhoneSearch(cleaned);
    if (cleaned && !ISRAELI_PHONE_REGEX.test(cleaned.replace(/-/g, ''))) {
      setPhoneError('פורמט ישראלי: 05X-XXXXXXX');
    } else {
      setPhoneError('');
    }
  };

  const handleNameChange = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Zא-ת\s\-']/g, '');
    setSearchQuery(cleaned);
  };

  const filteredAppointments = useMemo(() => {
    return archivedAppointments.filter(apt => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!apt.client_name.toLowerCase().includes(query)) return false;
      }
      if (phoneSearch) {
        const cleanPhone = phoneSearch.replace(/-/g, '');
        if (!apt.client_phone.replace(/-/g, '').includes(cleanPhone)) return false;
      }
      if (dateFrom) {
        if (apt.appointment_date < format(dateFrom, 'yyyy-MM-dd')) return false;
      }
      if (dateTo) {
        if (apt.appointment_date > format(dateTo, 'yyyy-MM-dd')) return false;
      }
      if (hourFilter) {
        const aptHour = apt.appointment_time.substring(0, 2);
        if (aptHour !== hourFilter) return false;
      }
      if (treatmentFilter) {
        if (apt.treatment_slug !== treatmentFilter) return false;
      }
      if (statusFilter) {
        if (apt.status !== statusFilter) return false;
      }
      return true;
    });
  }, [archivedAppointments, searchQuery, phoneSearch, dateFrom, dateTo, hourFilter, treatmentFilter, statusFilter]);

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
    setDateFrom(undefined);
    setDateTo(undefined);
    setHourFilter('');
    setTreatmentFilter('');
    setStatusFilter(null);
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => prev === status ? null : status);
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

  const getTreatmentTitle = (slug: string | null) => {
    if (!slug) return '—';
    const treatment = treatments.find(t => t.slug === slug);
    return treatment?.title || slug;
  };

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
          <Text $color="muted">תורים שבוטלו, שלקוח לא הגיע, או שטופלו</Text>
        </div>
        <Badge>{archivedAppointments.length} בארכיון</Badge>
      </PageHeader>

      <StatsGrid>
        <StatCard $active={statusFilter === null} onClick={() => setStatusFilter(null)}>
          <StatValue $active={statusFilter === null}>{stats.total}</StatValue>
          <StatLabel $active={statusFilter === null}>סה"כ</StatLabel>
        </StatCard>
        <StatCard $active={statusFilter === 'completed'} onClick={() => toggleStatusFilter('completed')}>
          <StatValue $active={statusFilter === 'completed'}>{stats.completed}</StatValue>
          <StatLabel $active={statusFilter === 'completed'}>טופלו</StatLabel>
        </StatCard>
        <StatCard $active={statusFilter === 'no_show'} onClick={() => toggleStatusFilter('no_show')}>
          <StatValue $active={statusFilter === 'no_show'}>{stats.no_show}</StatValue>
          <StatLabel $active={statusFilter === 'no_show'}>לא הגיעו</StatLabel>
        </StatCard>
        <StatCard $active={statusFilter === 'cancelled'} onClick={() => toggleStatusFilter('cancelled')}>
          <StatValue $active={statusFilter === 'cancelled'}>{stats.cancelled}</StatValue>
          <StatLabel $active={statusFilter === 'cancelled'}>בוטלו</StatLabel>
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
            <FilterLabel><CalendarIcon size={14} />מתאריך</FilterLabel>
            <Popover>
              <PopoverTrigger asChild>
                <DatePickerButton $hasValue={!!dateFrom}>
                  {dateFrom ? format(dateFrom, 'dd/MM/yyyy', { locale: he }) : 'מתאריך'}
                  <CalendarIcon size={14} />
                </DatePickerButton>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel><CalendarIcon size={14} />עד תאריך</FilterLabel>
            <Popover>
              <PopoverTrigger asChild>
                <DatePickerButton $hasValue={!!dateTo}>
                  {dateTo ? format(dateTo, 'dd/MM/yyyy', { locale: he }) : 'עד תאריך'}
                  <CalendarIcon size={14} />
                </DatePickerButton>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  disabled={(date) => dateFrom ? date < dateFrom : false}
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
          ? `נמצאו ${filteredAppointments.length} תוצאות מתוך ${archivedAppointments.length}`
          : `${archivedAppointments.length} תורים בארכיון`
        }
      </ResultCount>

      {filteredAppointments.length === 0 ? (
        <EmptyState>
          <Search size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">{hasActiveFilters ? 'לא נמצאו תוצאות' : 'הארכיון ריק'}</Title>
          <Text $color="muted">{hasActiveFilters ? 'נסה לשנות את הסינון' : 'תורים שנסגרו יופיעו כאן'}</Text>
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
              <Th>טיפול</Th>
              <Th $sortable onClick={() => toggleSort('status')}>סטטוס <SortIcon field="status" /></Th>
              <Th>פרטים</Th>
            </tr>
          </thead>
          <tbody>
            {sortedAppointments.map((apt) => (
              <tr key={apt.id}>
                <Td>{apt.client_name}</Td>
                <Td dir="ltr">{apt.client_phone}</Td>
                <Td>{formatDate(apt.appointment_date)}</Td>
                <Td>{apt.appointment_time.substring(0, 5)}</Td>
                <Td>{getTreatmentTitle(apt.treatment_slug)}</Td>
                <Td>
                  <StatusBadge $status={apt.status}>
                    {getStatusLabel(apt.status)}
                  </StatusBadge>
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <ActionButton onClick={() => setSelectedAppointment(apt)} title="פרטים">
                      <Eye size={18} />
                    </ActionButton>
                    {apt.status === 'completed' && (
                      <ActionButton $variant={apt.images && apt.images.length > 0 ? 'success' : 'info'} onClick={() => setImageModal({ id: apt.id, images: apt.images || [] })} title="העלאת קבצים">
                        <ImagePlus size={18} />
                      </ActionButton>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table></TableWrapper>


        {/* Mobile card view */}
        <MobileCards>
          {sortedAppointments.map((apt) => (
            <MobileCard key={apt.id}>
              <MobileCardRow>
                <MobileCardLabel>שם</MobileCardLabel>
                <MobileCardValue>{apt.client_name}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>טלפון</MobileCardLabel>
                <MobileCardValue dir="ltr">{apt.client_phone}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>תאריך</MobileCardLabel>
                <MobileCardValue>{formatDate(apt.appointment_date)}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>שעה</MobileCardLabel>
                <MobileCardValue>{apt.appointment_time.substring(0, 5)}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>טיפול</MobileCardLabel>
                <MobileCardValue>{getTreatmentTitle(apt.treatment_slug)}</MobileCardValue>
              </MobileCardRow>
              <MobileCardRow>
                <MobileCardLabel>סטטוס</MobileCardLabel>
                <StatusBadge $status={apt.status}>{getStatusLabel(apt.status)}</StatusBadge>
              </MobileCardRow>
              <MobileCardRow>
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center', paddingTop: '0.5rem' }}>
                  <ActionButton onClick={() => setSelectedAppointment(apt)} title="פרטים">
                    <Eye size={18} />
                  </ActionButton>
                  {apt.status === 'completed' && (
                    <ActionButton $variant={apt.images && apt.images.length > 0 ? 'success' : 'info'} onClick={() => setImageModal({ id: apt.id, images: apt.images || [] })} title="העלאת קבצים">
                      <ImagePlus size={18} />
                    </ActionButton>
                  )}
                </div>
              </MobileCardRow>
            </MobileCard>
          ))}
        </MobileCards>
        </>
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
                <Mail size={20} />
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

            {selectedAppointment.images && selectedAppointment.images.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid var(--border, #e5e7eb)` }}>
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
              </div>
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

      {/* Image/PDF upload modal */}
      {imageModal && (
        <Modal onClick={() => setImageModal(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="sm">תמונות וקבצים</Title>
            </ModalHeader>
            <Text $color="muted" style={{ marginBottom: '1rem' }}>
              העלה תמונות או קבצי PDF הקשורים לתור זה
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
    </div>
  );
};

export default AdminArchive;
