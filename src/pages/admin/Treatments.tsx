import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Input, Textarea, Label, FormGroup, Select } from '@/components/styled/Input';
import { Stethoscope, Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import ImageUpload from '@/components/ImageUpload';

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

const CardImage = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: 0.75rem;
`;

const CardIconFallback = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: ${({ theme }) => theme.gradients?.hero || 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))'};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
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

const DURATION_OPTIONS = [
  '15 דקות', '30 דקות', '45 דקות', '60 דקות',
  '75 דקות', '90 דקות', '105 דקות', '120 דקות',
  '135 דקות', '150 דקות', '165 דקות', '180 דקות',
];

const ErrorText = styled.span`
  color: #dc2626;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-top: 0.25rem;
  display: block;
`;

const isImageUrl = (value: string) => {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');
};

const parsePriceRange = (priceRange: string | null): { min: string; max: string } => {
  if (!priceRange) return { min: '', max: '' };
  const numbers = priceRange.replace(/[^\d-]/g, '').split('-').map(s => s.trim()).filter(Boolean);
  return { min: numbers[0] || '', max: numbers[1] || numbers[0] || '' };
};

const AdminTreatments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: '',
    short_description: '',
    full_description: '',
    features: '',
    benefits: '',
    process_steps: '',
    duration: '',
    price_min: '',
    price_max: '',
  });
  
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

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
        price_range: (data.price_min && data.price_max) ? `₪${data.price_min} - ₪${data.price_max}` : null,
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
        price_range: (data.price_min && data.price_max) ? `₪${data.price_min} - ₪${data.price_max}` : null,
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
      icon: '',
      short_description: '',
      full_description: '',
      features: '',
      benefits: '',
      process_steps: '',
      duration: '',
      price_min: '',
      price_max: '',
    });
    setErrors({});
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
      price_min: parsePriceRange(treatment.price_range).min,
      price_max: parsePriceRange(treatment.price_range).max,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTreatment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'יש למלא שם טיפול';
    else if (formData.title.trim().length < 2) newErrors.title = 'שם טיפול חייב להכיל לפחות 2 תווים';
    else if (formData.title.trim().length > 100) newErrors.title = 'מקסימום 100 תווים';
    
    if (!formData.slug.trim()) newErrors.slug = 'יש למלא slug';
    else if (!/^[a-z0-9-]+$/.test(formData.slug.trim())) newErrors.slug = 'רק אותיות קטנות באנגלית, מספרים ומקפים';
    
    if (!formData.short_description.trim()) newErrors.short_description = 'יש למלא תיאור קצר';
    else if (formData.short_description.trim().length > 500) newErrors.short_description = 'מקסימום 500 תווים';
    
    if (formData.full_description && formData.full_description.length > 5000) newErrors.full_description = 'מקסימום 5000 תווים';
    
    if (formData.price_min && isNaN(Number(formData.price_min))) newErrors.price_min = 'יש להזין מספר בלבד';
    if (formData.price_max && isNaN(Number(formData.price_max))) newErrors.price_max = 'יש להזין מספר בלבד';
    if (formData.price_min && formData.price_max && Number(formData.price_min) > Number(formData.price_max)) newErrors.price_max = 'מחיר מקסימלי חייב להיות גדול מהמינימלי';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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
                <div>
                  <CardTitle>{treatment.title}</CardTitle>
                </div>
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
                  onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setErrors(prev => ({ ...prev, title: '' })); }}
                  style={errors.title ? { borderColor: '#dc2626' } : {}}
                />
                {errors.title && <ErrorText>{errors.title}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="slug">Slug (באנגלית) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => { setFormData({ ...formData, slug: e.target.value }); setErrors(prev => ({ ...prev, slug: '' })); }}
                  dir="ltr"
                  placeholder="general-dentistry"
                  style={errors.slug ? { borderColor: '#dc2626' } : {}}
                />
                {errors.slug && <ErrorText>{errors.slug}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>תמונת טיפול</Label>
                <ImageUpload
                  images={formData.icon && isImageUrl(formData.icon) ? [formData.icon] : []}
                  onChange={(images) => setFormData({ ...formData, icon: images[0] || '' })}
                  multiple={false}
                  folder="treatments"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="short_description">תיאור קצר *</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => { setFormData({ ...formData, short_description: e.target.value }); setErrors(prev => ({ ...prev, short_description: '' })); }}
                  style={errors.short_description ? { borderColor: '#dc2626' } : {}}
                />
                {errors.short_description && <ErrorText>{errors.short_description}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="full_description">תיאור מלא</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => { setFormData({ ...formData, full_description: e.target.value }); setErrors(prev => ({ ...prev, full_description: '' })); }}
                  style={{ minHeight: '100px', ...(errors.full_description ? { borderColor: '#dc2626' } : {}) }}
                />
                {errors.full_description && <ErrorText>{errors.full_description}</ErrorText>}
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
                <Select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                >
                  <option value="">בחר משך זמן</option>
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>טווח מחירים (₪)</Label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Input
                    id="price_min"
                    type="number"
                    value={formData.price_min}
                    onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
                    placeholder="מחיר מינימום"
                    min="0"
                    dir="ltr"
                    style={{ flex: 1, textAlign: 'center' }}
                  />
                  <span style={{ fontWeight: 'bold', color: 'hsl(var(--muted-foreground))' }}>-</span>
                  <Input
                    id="price_max"
                    type="number"
                    value={formData.price_max}
                    onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
                    placeholder="מחיר מקסימום"
                    min="0"
                    dir="ltr"
                    style={{ flex: 1, textAlign: 'center' }}
                  />
                </div>
                {errors.price_min && <ErrorText>{errors.price_min}</ErrorText>}
                {errors.price_max && <ErrorText>{errors.price_max}</ErrorText>}
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
