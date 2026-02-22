import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Badge } from '@/components/styled/Layout';
import { Mail, Phone, User, Clock, Loader2, Trash2, Eye, CheckCircle, Search, X, MessageCircle, Archive, Send, Filter, ArrowUp, ArrowDown, Undo2 } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

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
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  text-align: right;
  &:hover { box-shadow: ${({ theme }) => theme.shadows.elevated}; transform: translateY(-2px); }
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

  &:hover {
    opacity: 0.7;
  }
`;

const TabsRow = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.mutedForeground};
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  background: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

const TabBadge = styled.span<{ $active?: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.secondary};
  color: ${({ $active, theme }) => $active ? theme.colors.primaryForeground : theme.colors.mutedForeground};
  padding: 0.125rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const CardsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageCard = styled.div<{ $isNew?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  border-right: 4px solid ${({ $isNew, theme }) => $isNew ? theme.colors.primary : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.normal};
  &:hover { box-shadow: ${({ theme }) => theme.shadows.elevated}; }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CardInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  svg { color: ${({ theme }) => theme.colors.primary}; flex-shrink: 0; }
`;

const MessageText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.6;
  background: ${({ theme }) => theme.colors.secondary}80;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: 0.75rem;
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
    $status === 'new' ? '#dbeafe' :
    $status === 'read' ? '#fef3c7' :
    $status === 'replied' ? '#dcfce7' :
    $status === 'archived' ? '#f3f4f6' : '#fef3c7'};
  color: ${({ $status }) =>
    $status === 'new' ? '#1e40af' :
    $status === 'read' ? '#92400e' :
    $status === 'replied' ? '#166534' :
    $status === 'archived' ? '#374151' : '#92400e'};
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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

const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  resize: vertical;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`;

const ResultCount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-bottom: 1rem;
`;

// --- Types & Constants ---

const statusLabels: Record<string, string> = {
  new: 'חדש',
  read: 'נקרא',
  replied: 'הושב',
  archived: 'בארכיון',
};

const ISRAELI_PHONE_REGEX = /^0[2-9]\d{0,8}$/;

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// --- Component ---

const AdminMessages = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedMessage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedMessage]);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ContactMessage[];
    },
  });

  const updateMessage = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from('contact_messages' as any)
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
      toast.success('ההודעה עודכנה');
    },
    onError: () => toast.error('שגיאה בעדכון'),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
      toast.success('ההודעה נמחקה');
      setSelectedMessage(null);
    },
    onError: () => toast.error('שגיאה במחיקה'),
  });

  // Split messages into active and archived
  const activeMessages = useMemo(() => messages.filter(m => m.status !== 'archived'), [messages]);
  const archivedMessages = useMemo(() => messages.filter(m => m.status === 'archived'), [messages]);

  const currentMessages = activeTab === 'active' ? activeMessages : archivedMessages;

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

  const hasActiveFilters = searchQuery || phoneSearch || dateFrom || dateTo || statusFilter;

  const clearAllFilters = () => {
    setSearchQuery('');
    setPhoneSearch('');
    setPhoneError('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setStatusFilter(null);
  };

  const filteredMessages = useMemo(() => {
    let result = currentMessages;
    if (statusFilter) {
      result = result.filter(m => m.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(q));
    }
    if (phoneSearch) {
      const cleanPhone = phoneSearch.replace(/-/g, '');
      result = result.filter(m => m.phone.replace(/-/g, '').includes(cleanPhone));
    }
    if (dateFrom) {
      const fromStr = format(dateFrom, 'yyyy-MM-dd');
      result = result.filter(m => m.created_at.substring(0, 10) >= fromStr);
    }
    if (dateTo) {
      const toStr = format(dateTo, 'yyyy-MM-dd');
      result = result.filter(m => m.created_at.substring(0, 10) <= toStr);
    }
    return result;
  }, [currentMessages, statusFilter, searchQuery, phoneSearch, dateFrom, dateTo]);

  const stats = useMemo(() => ({
    total: activeMessages.length,
    new: activeMessages.filter(m => m.status === 'new').length,
    read: activeMessages.filter(m => m.status === 'read').length,
    replied: activeMessages.filter(m => m.status === 'replied').length,
    archived: archivedMessages.length,
  }), [activeMessages, archivedMessages]);

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => prev === status ? null : status);
  };

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.admin_notes || '');
    if (msg.status === 'new') {
      updateMessage.mutate({ id: msg.id, updates: { status: 'read' } });
    }
  };

  const handleReplyWhatsApp = (msg: ContactMessage) => {
    let phone = msg.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '972' + phone.slice(1);
    const text = encodeURIComponent(`שלום ${msg.name}, תודה שפנית אלינו! `);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    updateMessage.mutate({ id: msg.id, updates: { status: 'replied' } });
  };

  const saveNotes = () => {
    if (!selectedMessage) return;
    updateMessage.mutate({ id: selectedMessage.id, updates: { admin_notes: adminNotes } });
  };

  if (isLoading) {
    return <LoadingWrapper><Loader2 size={48} className="animate-spin" style={{ color: 'hsl(174, 62%, 45%)' }} /></LoadingWrapper>;
  }

  return (
    <div>
      <PageHeader>
        <div>
          <Title $size="lg">הודעות מלקוחות</Title>
          <Text $color="muted">ניהול הודעות שהתקבלו מטופס יצירת קשר</Text>
        </div>
      </PageHeader>

      {/* Tabs */}
      <TabsRow>
        <Tab $active={activeTab === 'active'} onClick={() => { setActiveTab('active'); clearAllFilters(); }}>
          <Mail size={18} />
          הודעות פעילות
          <TabBadge $active={activeTab === 'active'}>{activeMessages.length}</TabBadge>
        </Tab>
        <Tab $active={activeTab === 'archived'} onClick={() => { setActiveTab('archived'); clearAllFilters(); }}>
          <Archive size={18} />
          ארכיון
          <TabBadge $active={activeTab === 'archived'}>{archivedMessages.length}</TabBadge>
        </Tab>
      </TabsRow>

      {/* Stats - only for active tab */}
      {activeTab === 'active' && (
        <StatsGrid>
          <StatCard $active={statusFilter === null} onClick={() => setStatusFilter(null)}>
            <StatValue $active={statusFilter === null}>{stats.total}</StatValue>
            <StatLabel $active={statusFilter === null}>סה״כ פעילות</StatLabel>
          </StatCard>
          <StatCard $active={statusFilter === 'new'} onClick={() => toggleStatusFilter('new')}>
            <StatValue $active={statusFilter === 'new'}>{stats.new}</StatValue>
            <StatLabel $active={statusFilter === 'new'}>חדשות</StatLabel>
          </StatCard>
          <StatCard $active={statusFilter === 'read'} onClick={() => toggleStatusFilter('read')}>
            <StatValue $active={statusFilter === 'read'}>{stats.read}</StatValue>
            <StatLabel $active={statusFilter === 'read'}>נקראו</StatLabel>
          </StatCard>
          <StatCard $active={statusFilter === 'replied'} onClick={() => toggleStatusFilter('replied')}>
            <StatValue $active={statusFilter === 'replied'}>{stats.replied}</StatValue>
            <StatLabel $active={statusFilter === 'replied'}>נענו</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      {/* Filters */}
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
            {phoneError && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', textAlign: 'center' }}>{phoneError}</span>}
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
          ? `נמצאו ${filteredMessages.length} תוצאות מתוך ${currentMessages.length}`
          : `${currentMessages.length} הודעות ${activeTab === 'active' ? 'פעילות' : 'בארכיון'}`
        }
      </ResultCount>

      {filteredMessages.length === 0 ? (
        <EmptyState>
          <Mail size={48} style={{ color: 'hsl(174, 62%, 45%)', margin: '0 auto 1rem' }} />
          <Title $size="md">{activeTab === 'archived' ? 'הארכיון ריק' : 'אין הודעות'}</Title>
          <Text $color="muted">
            {hasActiveFilters ? 'לא נמצאו תוצאות - נסה לשנות את הסינון' :
              activeTab === 'archived' ? 'הודעות שתעביר לארכיון יופיעו כאן' : 'לא נמצאו הודעות'}
          </Text>
        </EmptyState>
      ) : (
        <CardsGrid>
          {filteredMessages.map(msg => (
            <MessageCard key={msg.id} $isNew={msg.status === 'new'}>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Text style={{ fontWeight: 600, margin: 0 }}>{msg.name}</Text>
                  <StatusBadge $status={msg.status}>{statusLabels[msg.status] || msg.status}</StatusBadge>
                </div>
                <Text $color="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                  {format(new Date(msg.created_at), 'd בMMMM yyyy, HH:mm', { locale: he })}
                </Text>
              </CardHeader>

              <CardInfo>
                <InfoItem><Phone size={14} />{msg.phone}</InfoItem>
                {msg.email && <InfoItem><Mail size={14} />{msg.email}</InfoItem>}
              </CardInfo>

              {msg.message && <MessageText>{msg.message}</MessageText>}

              <ActionsRow>
                <Button $variant="outline" $size="sm" onClick={() => openMessage(msg)}>
                  <Eye size={16} />
                  צפייה
                </Button>
                {activeTab === 'active' && (
                  <>
                    <Button $variant="heroPrimary" $size="sm" onClick={() => handleReplyWhatsApp(msg)}>
                      <MessageCircle size={16} />
                      השב ב-WhatsApp
                    </Button>
                    <Button $variant="ghost" $size="sm" onClick={() => updateMessage.mutate({ id: msg.id, updates: { status: 'archived' } })}>
                      <Archive size={16} />
                      ארכיון
                    </Button>
                  </>
                )}
                {activeTab === 'archived' && (
                  <Button $variant="ghost" $size="sm" onClick={() => updateMessage.mutate({ id: msg.id, updates: { status: 'read' } })}>
                    <Undo2 size={16} />
                    שחזר
                  </Button>
                )}
                <Button $variant="ghost" $size="sm" onClick={() => { if (confirm('למחוק את ההודעה?')) deleteMessage.mutate(msg.id); }}>
                  <Trash2 size={16} />
                </Button>
              </ActionsRow>
            </MessageCard>
          ))}
        </CardsGrid>
      )}

      {/* Detail Modal */}
      {selectedMessage && (
        <Modal onClick={() => setSelectedMessage(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="md" style={{ margin: 0 }}>פרטי ההודעה</Title>
              <button onClick={() => setSelectedMessage(null)}><X size={20} /></button>
            </ModalHeader>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <InfoItem><User size={16} /><strong>שם:</strong> {selectedMessage.name}</InfoItem>
              <InfoItem><Phone size={16} /><strong>טלפון:</strong> {selectedMessage.phone}</InfoItem>
              {selectedMessage.email && <InfoItem><Mail size={16} /><strong>אימייל:</strong> {selectedMessage.email}</InfoItem>}
              <InfoItem><Clock size={16} /><strong>נשלח:</strong> {format(new Date(selectedMessage.created_at), 'd בMMMM yyyy, HH:mm', { locale: he })}</InfoItem>
            </div>

            {selectedMessage.message && (
              <div style={{ marginTop: '1rem' }}>
                <Text style={{ fontWeight: 600, marginBottom: '0.5rem' }}>הודעה:</Text>
                <MessageText>{selectedMessage.message}</MessageText>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <Text style={{ fontWeight: 600, marginBottom: '0.5rem' }}>הערות מנהל:</Text>
              <NotesTextarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="הוסף הערות..."
              />
              <Button $variant="outline" $size="sm" onClick={saveNotes} style={{ marginTop: '0.5rem' }}>
                שמור הערות
              </Button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button $variant="heroPrimary" $size="sm" $fullWidth onClick={() => handleReplyWhatsApp(selectedMessage)}>
                <MessageCircle size={16} />
                השב ב-WhatsApp
              </Button>
              {selectedMessage.email && (
                <Button as="a" href={`mailto:${selectedMessage.email}`} $variant="outline" $size="sm" $fullWidth>
                  <Send size={16} />
                  שלח אימייל
                </Button>
              )}
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default AdminMessages;
