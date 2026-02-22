import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Badge } from '@/components/styled/Layout';
import { Mail, Phone, User, Clock, Loader2, Trash2, Eye, CheckCircle, Search, X, MessageCircle, Archive, Send } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

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
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
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

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0 1rem;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 0;
  border: none;
  background: transparent;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.foreground};
  &:focus { outline: none; }
  &::placeholder { color: ${({ theme }) => theme.colors.mutedForeground}; }
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

const statusLabels: Record<string, string> = {
  new: 'חדש',
  read: 'נקרא',
  replied: 'הושב',
  archived: 'בארכיון',
};

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

const AdminMessages = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredMessages = useMemo(() => {
    let result = messages;
    if (statusFilter) {
      result = result.filter(m => m.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.message && m.message.toLowerCase().includes(q))
      );
    }
    return result;
  }, [messages, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
  }), [messages]);

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

      <StatsGrid>
        <StatCard $active={statusFilter === null} onClick={() => setStatusFilter(null)}>
          <StatValue $active={statusFilter === null}>{stats.total}</StatValue>
          <StatLabel $active={statusFilter === null}>סה״כ הודעות</StatLabel>
        </StatCard>
        <StatCard $active={statusFilter === 'new'} onClick={() => setStatusFilter(statusFilter === 'new' ? null : 'new')}>
          <StatValue $active={statusFilter === 'new'}>{stats.new}</StatValue>
          <StatLabel $active={statusFilter === 'new'}>הודעות חדשות</StatLabel>
        </StatCard>
        <StatCard $active={statusFilter === 'replied'} onClick={() => setStatusFilter(statusFilter === 'replied' ? null : 'replied')}>
          <StatValue $active={statusFilter === 'replied'}>{stats.replied}</StatValue>
          <StatLabel $active={statusFilter === 'replied'}>נענו</StatLabel>
        </StatCard>
      </StatsGrid>

      <SearchWrapper>
        <Search size={18} style={{ color: 'hsl(174, 62%, 45%)' }} />
        <SearchInput
          placeholder="חיפוש לפי שם, טלפון, אימייל..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ padding: '0.25rem' }}>
            <X size={16} />
          </button>
        )}
      </SearchWrapper>

      {filteredMessages.length === 0 ? (
        <EmptyState>
          <Mail size={48} style={{ color: 'hsl(174, 62%, 45%)', margin: '0 auto 1rem' }} />
          <Title $size="md">אין הודעות</Title>
          <Text $color="muted">לא נמצאו הודעות{statusFilter ? ' בסטטוס זה' : ''}</Text>
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
                <Button $variant="heroPrimary" $size="sm" onClick={() => handleReplyWhatsApp(msg)}>
                  <MessageCircle size={16} />
                  השב ב-WhatsApp
                </Button>
                <Button $variant="ghost" $size="sm" onClick={() => updateMessage.mutate({ id: msg.id, updates: { status: 'archived' } })}>
                  <Archive size={16} />
                  ארכיון
                </Button>
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
