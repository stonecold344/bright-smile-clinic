import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Input, Textarea, Label, FormGroup } from '@/components/styled/Input';
import { Stethoscope, Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
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

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  color: ${({ $variant, theme }) => $variant === 'danger' ? '#dc2626' : theme.colors.mutedForeground};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.6;
  margin: 0;
`;

const CardMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
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
  max-width: 600px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

interface Treatment {
  id: string;
  slug: string;
  icon: string;
  title: string;
  short_description: string;
  full_description: string | null;
  features: string[];
  benefits: string[] | null;
  process_steps: string[] | null;
  duration: string | null;
  price_range: string | null;
}

const AdminTreatments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: '🦷',
    short_description: '',
    full_description: '',
    features: '',
    benefits: '',
    process_steps: '',
    duration: '',
    price_range: '',
  });
  
  const queryClient = useQueryClient();

  const { data: treatments = [], isLoading } = useQuery({
    queryKey: ['admin-treatments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Treatment[];
    },
  });

  const createTreatment = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('treatments').insert({
        title: data.title,
        slug: data.slug,
        icon: data.icon,
        short_description: data.short_description,
        full_description: data.full_description || null,
        features: data.features.split('\n').filter(f => f.trim()),
        benefits: data.benefits ? data.benefits.split('\n').filter(b => b.trim()) : null,
        process_steps: data.process_steps ? data.process_steps.split('\n').filter(p => p.trim()) : null,
        duration: data.duration || null,
        price_range: data.price_range || null,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success('הטיפול נוצר בהצלחה');
      closeModal();
    },
    onError: () => {
      toast.error('שגיאה ביצירת הטיפול');
    },
  });

  const updateTreatment = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('treatments').update({
        title: data.title,
        slug: data.slug,
        icon: data.icon,
        short_description: data.short_description,
        full_description: data.full_description || null,
        features: data.features.split('\n').filter(f => f.trim()),
        benefits: data.benefits ? data.benefits.split('\n').filter(b => b.trim()) : null,
        process_steps: data.process_steps ? data.process_steps.split('\n').filter(p => p.trim()) : null,
        duration: data.duration || null,
        price_range: data.price_range || null,
      }).eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success('הטיפול עודכן בהצלחה');
      closeModal();
    },
    onError: () => {
      toast.error('שגיאה בעדכון הטיפול');
    },
  });

  const deleteTreatment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('treatments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success('הטיפול נמחק בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה במחיקת הטיפול');
    },
  });

  const openCreateModal = () => {
    setEditingTreatment(null);
    setFormData({
      title: '',
      slug: '',
      icon: '🦷',
      short_description: '',
      full_description: '',
      features: '',
      benefits: '',
      process_steps: '',
      duration: '',
      price_range: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setFormData({
      title: treatment.title,
      slug: treatment.slug,
      icon: treatment.icon,
      short_description: treatment.short_description,
      full_description: treatment.full_description || '',
      features: treatment.features.join('\n'),
      benefits: treatment.benefits?.join('\n') || '',
      process_steps: treatment.process_steps?.join('\n') || '',
      duration: treatment.duration || '',
      price_range: treatment.price_range || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTreatment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('יש למלא שם טיפול'); return; }
    if (formData.title.trim().length < 2) { toast.error('שם טיפול חייב להכיל לפחות 2 תווים'); return; }
    if (formData.title.trim().length > 100) { toast.error('שם טיפול ארוך מדי (מקסימום 100 תווים)'); return; }
    if (!formData.slug.trim()) { toast.error('יש למלא slug'); return; }
    if (!/^[a-z0-9-]+$/.test(formData.slug.trim())) { toast.error('Slug יכול להכיל רק אותיות קטנות באנגלית, מספרים ומקפים'); return; }
    if (!formData.short_description.trim()) { toast.error('יש למלא תיאור קצר'); return; }
    if (formData.short_description.trim().length > 500) { toast.error('תיאור קצר ארוך מדי (מקסימום 500 תווים)'); return; }
    if (formData.full_description && formData.full_description.length > 5000) { toast.error('תיאור מלא ארוך מדי (מקסימום 5000 תווים)'); return; }
    if (editingTreatment) {
      updateTreatment.mutate({ id: editingTreatment.id, data: formData });
    } else {
      createTreatment.mutate(formData);
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
          <Title $size="md">ניהול טיפולים</Title>
          <Text $color="muted">הוסף, ערוך ומחק טיפולים</Text>
        </div>
        <Button onClick={openCreateModal} $variant="heroPrimary">
          <Plus size={18} />
          טיפול חדש
        </Button>
      </PageHeader>

      {treatments.length === 0 ? (
        <EmptyState>
          <Stethoscope size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">אין טיפולים במערכת</Title>
          <Text $color="muted">הוסף טיפול חדש כדי להתחיל</Text>
        </EmptyState>
      ) : (
        <Grid>
          {treatments.map((treatment) => (
            <Card key={treatment.id}>
              <CardHeader>
                <CardTitle>{treatment.title}</CardTitle>
                <CardActions>
                  <ActionButton onClick={() => openEditModal(treatment)} title="ערוך">
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton 
                    $variant="danger" 
                    onClick={() => {
                      if (confirm('האם אתה בטוח שברצונך למחוק את הטיפול?')) {
                        deleteTreatment.mutate(treatment.id);
                      }
                    }}
                    title="מחק"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </CardActions>
              </CardHeader>
              <CardDescription>{treatment.short_description}</CardDescription>
              <CardMeta>
                {treatment.duration && <span>{treatment.duration}</span>}
                {treatment.price_range && <span>{treatment.price_range}</span>}
              </CardMeta>
            </Card>
          ))}
        </Grid>
      )}

      {isModalOpen && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="sm">{editingTreatment ? 'עריכת טיפול' : 'טיפול חדש'}</Title>
              <CloseButton onClick={closeModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit} noValidate>
              <FormGroup>
                <Label htmlFor="title">שם הטיפול *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="slug">Slug (באנגלית) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  dir="ltr"
                  placeholder="general-dentistry"
                
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="short_description">תיאור קצר *</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="full_description">תיאור מלא</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  style={{ minHeight: '100px' }}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="features">תכונות (שורה לכל תכונה)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="בדיקות תקופתיות&#10;ניקוי שיניים מקצועי"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="benefits">יתרונות (שורה לכל יתרון)</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="duration">משך זמן</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30-60 דקות"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="price_range">טווח מחירים</Label>
                <Input
                  id="price_range"
                  value={formData.price_range}
                  onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                  placeholder="₪200-500"
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" $variant="heroPrimary" $fullWidth>
                  {editingTreatment ? 'עדכן' : 'צור'} טיפול
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

export default AdminTreatments;
