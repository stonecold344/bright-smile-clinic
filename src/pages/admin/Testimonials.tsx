import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Input, Textarea, Label, FormGroup } from '@/components/styled/Input';
import { MessageSquare, Loader2, Plus, Pencil, Trash2, X, Star, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div<{ $visible?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  opacity: ${({ $visible }) => $visible ? 1 : 0.6};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`;

const AuthorTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ActionButton = styled.button<{ $variant?: 'danger' | 'success' }>`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  color: ${({ $variant }) => 
    $variant === 'danger' ? '#dc2626' : 
    $variant === 'success' ? '#16a34a' : 
    'inherit'
  };
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  
  svg {
    color: #fbbf24;
    fill: #fbbf24;
  }
`;

const Content = styled.p`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.6;
  margin: 0;
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

const CloseButton = styled.button`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.mutedForeground};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const RatingInput = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const RatingStar = styled.button<{ $active?: boolean }>`
  padding: 0.25rem;
  color: ${({ $active }) => $active ? '#fbbf24' : '#d1d5db'};
  
  svg {
    fill: ${({ $active }) => $active ? '#fbbf24' : 'transparent'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_visible: boolean;
}

const AdminTestimonials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    rating: 5,
    is_visible: true,
  });
  
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const createTestimonial = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('testimonials').insert({
        name: data.name,
        title: data.title || null,
        content: data.content,
        rating: data.rating,
        is_visible: data.is_visible,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('ההמלצה נוצרה בהצלחה');
      closeModal();
    },
    onError: () => {
      toast.error('שגיאה ביצירת ההמלצה');
    },
  });

  const updateTestimonial = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('testimonials').update({
        name: data.name,
        title: data.title || null,
        content: data.content,
        rating: data.rating,
        is_visible: data.is_visible,
      }).eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('ההמלצה עודכנה בהצלחה');
      closeModal();
    },
    onError: () => {
      toast.error('שגיאה בעדכון ההמלצה');
    },
  });

  const deleteTestimonial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('ההמלצה נמחקה בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה במחיקת ההמלצה');
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from('testimonials').update({ is_visible }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('הנראות עודכנה בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה בעדכון הנראות');
    },
  });

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      title: '',
      content: '',
      rating: 5,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title || '',
      content: testimonial.content,
      rating: testimonial.rating,
      is_visible: testimonial.is_visible,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('יש למלא שם לקוח'); return; }
    if (formData.name.trim().length < 2) { toast.error('שם חייב להכיל לפחות 2 תווים'); return; }
    if (formData.name.trim().length > 100) { toast.error('שם ארוך מדי (מקסימום 100 תווים)'); return; }
    if (!formData.content.trim()) { toast.error('יש למלא תוכן המלצה'); return; }
    if (formData.content.trim().length < 10) { toast.error('תוכן המלצה חייב להכיל לפחות 10 תווים'); return; }
    if (formData.content.trim().length > 2000) { toast.error('תוכן המלצה ארוך מדי (מקסימום 2000 תווים)'); return; }
    if (formData.rating < 1 || formData.rating > 5) { toast.error('יש לבחור דירוג בין 1 ל-5'); return; }
    if (formData.title && formData.title.length > 100) { toast.error('תפקיד/כותרת ארוך מדי (מקסימום 100 תווים)'); return; }
    if (editingTestimonial) {
      updateTestimonial.mutate({ id: editingTestimonial.id, data: formData });
    } else {
      createTestimonial.mutate(formData);
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
          <Title $size="md">ניהול המלצות</Title>
          <Text $color="muted">הוסף, ערוך ומחק המלצות לקוחות</Text>
        </div>
        <Button onClick={openCreateModal} $variant="heroPrimary">
          <Plus size={18} />
          המלצה חדשה
        </Button>
      </PageHeader>

      {testimonials.length === 0 ? (
        <EmptyState>
          <MessageSquare size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">אין המלצות במערכת</Title>
          <Text $color="muted">הוסף המלצה חדשה כדי להתחיל</Text>
        </EmptyState>
      ) : (
        <Grid>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} $visible={testimonial.is_visible}>
              <CardHeader>
                <AuthorInfo>
                  <AuthorName>{testimonial.name}</AuthorName>
                  {testimonial.title && <AuthorTitle>{testimonial.title}</AuthorTitle>}
                </AuthorInfo>
                <CardActions>
                  <ActionButton 
                    $variant={testimonial.is_visible ? 'success' : undefined}
                    onClick={() => toggleVisibility.mutate({ id: testimonial.id, is_visible: !testimonial.is_visible })}
                    title={testimonial.is_visible ? 'הסתר' : 'הצג'}
                  >
                    {testimonial.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </ActionButton>
                  <ActionButton onClick={() => openEditModal(testimonial)} title="ערוך">
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton 
                    $variant="danger" 
                    onClick={() => {
                      if (confirm('האם אתה בטוח שברצונך למחוק את ההמלצה?')) {
                        deleteTestimonial.mutate(testimonial.id);
                      }
                    }}
                    title="מחק"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </CardActions>
              </CardHeader>
              <Stars>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </Stars>
              <Content>{testimonial.content}</Content>
            </Card>
          ))}
        </Grid>
      )}

      {isModalOpen && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="sm">{editingTestimonial ? 'עריכת המלצה' : 'המלצה חדשה'}</Title>
              <CloseButton onClick={closeModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit} noValidate>
              <FormGroup>
                <Label htmlFor="name">שם הלקוח *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="title">תפקיד/כותרת</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="עורך דין, מהנדס..."
                />
              </FormGroup>

              <FormGroup>
                <Label>דירוג</Label>
                <RatingInput>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <RatingStar
                      key={star}
                      type="button"
                      $active={star <= formData.rating}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      <Star size={24} />
                    </RatingStar>
                  ))}
                </RatingInput>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="content">תוכן ההמלצה *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ minHeight: '100px' }}
                  
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" $variant="heroPrimary" $fullWidth>
                  {editingTestimonial ? 'עדכן' : 'צור'} המלצה
                </Button>
                <Button type="button" $variant="outline" $fullWidth onClick={closeModal}>
                  ביטול
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default AdminTestimonials;
