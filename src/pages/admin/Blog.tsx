import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Input, Textarea, Label, FormGroup } from '@/components/styled/Input';
import { FileText, Loader2, Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';
import type { BlogPost } from '@/hooks/useBlogPosts';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div<{ $published?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  opacity: ${({ $published }) => $published ? 1 : 0.7};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
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

const ActionButton = styled.button<{ $variant?: 'danger' | 'success' }>`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  color: ${({ $variant }) =>
    $variant === 'danger' ? '#dc2626' :
    $variant === 'success' ? '#16a34a' : 'inherit'};
  &:hover { background: ${({ theme }) => theme.colors.secondary}; }
`;

const CardMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-top: 0.5rem;
`;

const StatusBadge = styled.span<{ $published: boolean }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ $published }) => $published ? '#dcfce7' : '#fef3c7'};
  color: ${({ $published }) => $published ? '#166534' : '#92400e'};
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
  align-items: flex-start;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem 1rem;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  margin: 2rem 0;
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

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.foreground};
`;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) || `post-${Date.now()}`;

const AdminBlog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    featured_image: [] as string[],
    seo_title: '',
    seo_description: '',
    is_published: false,
  });

  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const createPost = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('blog_posts').insert({
        title: data.title,
        slug: data.slug || slugify(data.title),
        content: data.content,
        featured_image: data.featured_image[0] || null,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        is_published: data.is_published,
        published_at: data.is_published ? new Date().toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('המאמר נוצר בהצלחה');
      closeModal();
    },
    onError: () => toast.error('שגיאה ביצירת המאמר'),
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('blog_posts').update({
        title: data.title,
        slug: data.slug || slugify(data.title),
        content: data.content,
        featured_image: data.featured_image[0] || null,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        is_published: data.is_published,
        published_at: data.is_published ? new Date().toISOString() : null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('המאמר עודכן בהצלחה');
      closeModal();
    },
    onError: () => toast.error('שגיאה בעדכון המאמר'),
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('המאמר נמחק בהצלחה');
    },
    onError: () => toast.error('שגיאה במחיקת המאמר'),
  });

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({ title: '', slug: '', content: '', featured_image: [], seo_title: '', seo_description: '', is_published: false });
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      featured_image: post.featured_image ? [post.featured_image] : [],
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      is_published: post.is_published,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingPost(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updatePost.mutate({ id: editingPost.id, data: formData });
    } else {
      createPost.mutate(formData);
    }
  };

  if (isLoading) {
    return <LoadingWrapper><Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} /></LoadingWrapper>;
  }

  return (
    <div>
      <PageHeader>
        <div>
          <Title $size="md">ניהול בלוג</Title>
          <Text $color="muted">הוסף, ערוך ומחק מאמרים</Text>
        </div>
        <Button onClick={openCreateModal} $variant="heroPrimary">
          <Plus size={18} />
          מאמר חדש
        </Button>
      </PageHeader>

      {posts.length === 0 ? (
        <EmptyState>
          <FileText size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <Title $size="sm">אין מאמרים במערכת</Title>
          <Text $color="muted">הוסף מאמר חדש כדי להתחיל</Text>
        </EmptyState>
      ) : (
        <Grid>
          {posts.map((post) => (
            <Card key={post.id} $published={post.is_published}>
              <CardHeader>
                <div>
                  <CardTitle>{post.title}</CardTitle>
                  <StatusBadge $published={post.is_published}>
                    {post.is_published ? 'פורסם' : 'טיוטה'}
                  </StatusBadge>
                </div>
                <CardActions>
                  <ActionButton onClick={() => openEditModal(post)} title="ערוך">
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton
                    $variant="danger"
                    onClick={() => {
                      if (confirm('האם אתה בטוח שברצונך למחוק את המאמר?')) {
                        deletePost.mutate(post.id);
                      }
                    }}
                    title="מחק"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </CardActions>
              </CardHeader>
              <CardMeta>
                {post.published_at
                  ? format(new Date(post.published_at), 'dd/MM/yyyy', { locale: he })
                  : format(new Date(post.created_at), 'dd/MM/yyyy', { locale: he })}
              </CardMeta>
            </Card>
          ))}
        </Grid>
      )}

      {isModalOpen && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title $size="sm">{editingPost ? 'עריכת מאמר' : 'מאמר חדש'}</Title>
              <CloseButton onClick={closeModal}><X size={20} /></CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="title">כותרת *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: editingPost ? formData.slug : slugify(e.target.value),
                  })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="slug">Slug (באנגלית) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  dir="ltr"
                  placeholder="my-blog-post"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>תמונה ראשית</Label>
                <ImageUpload
                  images={formData.featured_image}
                  onChange={(images) => setFormData({ ...formData, featured_image: images })}
                  folder="blog"
                />
              </FormGroup>

              <FormGroup>
                <Label>תוכן *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="seo_title">כותרת SEO</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="כותרת לתוצאות חיפוש (עד 60 תווים)"
                  maxLength={60}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="seo_description">תיאור SEO</Label>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="תיאור לתוצאות חיפוש (עד 160 תווים)"
                  maxLength={160}
                  style={{ minHeight: '60px' }}
                />
              </FormGroup>

              <FormGroup>
                <CheckboxWrapper>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  פרסם מאמר
                </CheckboxWrapper>
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" $variant="heroPrimary" $fullWidth>
                  {editingPost ? 'עדכן' : 'צור'} מאמר
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

export default AdminBlog;
