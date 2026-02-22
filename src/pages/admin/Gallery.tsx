import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Input, Textarea, Label, FormGroup } from '@/components/styled/Input';
import { Image, Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/ImageUpload';
import type { GalleryItem } from '@/hooks/useGallery';

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
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const CardImages = styled.div`
  display: flex;
  gap: 2px;
  height: 160px;
  overflow: hidden;
`;

const CardImage = styled.img`
  flex: 1;
  object-fit: cover;
  min-width: 0;
`;

const CardBody = styled.div`
  padding: 1.25rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
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
  color: ${({ $variant }) => $variant === 'danger' ? '#dc2626' : 'inherit'};
  &:hover { background: ${({ theme }) => theme.colors.secondary}; }
`;

const CardMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
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
  &:hover { background: ${({ theme }) => theme.colors.secondary}; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const AdminGallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    images: [] as string[],
  });

  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  const createItem = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('gallery').insert({
        title: data.title,
        category: data.category || 'כללי',
        description: data.description || null,
        images: data.images,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('הפריט נוצר בהצלחה');
      closeModal();
    },
    onError: () => toast.error('שגיאה ביצירת הפריט'),
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('gallery').update({
        title: data.title,
        category: data.category || 'כללי',
        description: data.description || null,
        images: data.images,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('הפריט עודכן בהצלחה');
      closeModal();
    },
    onError: () => toast.error('שגיאה בעדכון הפריט'),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('הפריט נמחק בהצלחה');
    },
    onError: () => toast.error('שגיאה במחיקת הפריט'),
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ title: '', category: '', description: '', images: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description || '',
      images: item.images,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data: formData });
    } else {
      createItem.mutate(formData);
    }
  };

  if (isLoading) {
    return <LoadingWrapper><Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} /></LoadingWrapper>;
  }

  return (
    <div>
      <PageHeader>
        <div>
          <Title $size="md">ניהול גלריה</Title>
          <Text $color="muted">הוסף, ערוך ומחק תמונות מהגלריה</Text>
        </div>
        <Button onClick={openCreateModal} $variant="heroPrimary">
          <Plus size={18} />
          פריט חדש
        </Button>
      </PageHeader>

      {items.length === 0 ? (
        <EmptyState>
          <Image size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">אין פריטים בגלריה</Title>
          <Text $color="muted">הוסף פריט חדש כדי להתחיל</Text>
        </EmptyState>
      ) : (
        <Grid>
          {items.map((item) => (
            <Card key={item.id}>
              {item.images.length > 0 && (
                <CardImages>
                  {item.images.slice(0, 3).map((img, i) => (
                    <CardImage key={i} src={img} alt={item.title} />
                  ))}
                </CardImages>
              )}
              <CardBody>
                <CardHeader>
                  <div>
                    <CardMeta>{item.category}</CardMeta>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                  <CardActions>
                    <ActionButton onClick={() => openEditModal(item)} title="ערוך">
                      <Pencil size={16} />
                    </ActionButton>
                    <ActionButton
                      $variant="danger"
                      onClick={() => {
                        if (confirm('האם אתה בטוח שברצונך למחוק את הפריט?')) {
                          deleteItem.mutate(item.id);
                        }
                      }}
                      title="מחק"
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </CardActions>
                </CardHeader>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}

      {isModalOpen && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="sm">{editingItem ? 'עריכת פריט' : 'פריט חדש'}</Title>
              <CloseButton onClick={closeModal}><X size={20} /></CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="title">כותרת *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="category">קטגוריה</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="כללי, לפני ואחרי, המרפאה..."
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">תיאור</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ minHeight: '60px' }}
                />
              </FormGroup>

              <FormGroup>
                <Label>תמונות *</Label>
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  multiple
                  folder="gallery"
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" $variant="heroPrimary" $fullWidth>
                  {editingItem ? 'עדכן' : 'צור'} פריט
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

export default AdminGallery;
