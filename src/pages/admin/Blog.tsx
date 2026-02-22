import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Button } from '@/components/styled/Button';
import { Input, Textarea, Label, FormGroup } from '@/components/styled/Input';
import { FileText, Loader2, Plus, Pencil, Trash2, X, GripVertical, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import ImageUpload from '@/components/ImageUpload';
import type { BlogPost, ArticleSection } from '@/hooks/useBlogPosts';

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
  max-width: 900px;
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

/* --- Template Section Styles --- */

const SectionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.25rem;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SectionLabel = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  background: ${({ $type, theme }) =>
    $type === 'intro' ? theme.colors.primaryLight :
    $type === 'summary' ? '#fef3c7' :
    theme.colors.secondary};
  color: ${({ $type, theme }) =>
    $type === 'intro' ? theme.colors.primary :
    $type === 'summary' ? '#92400e' :
    theme.colors.foreground};
`;

const RemoveSectionButton = styled.button`
  padding: 0.35rem;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.mutedForeground};
  &:hover { background: #fee2e2; color: #dc2626; }
`;

const AddSectionBar = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  padding: 1rem;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  margin-bottom: 1rem;
`;

const AddSectionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.foreground};
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SectionImagePreview = styled.div`
  margin-top: 0.75rem;
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  max-height: 160px;

  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
`;

const RemoveImageBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PointsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const PointRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const TemplatePreview = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.secondary}40;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.mutedForeground};
  text-align: center;
`;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) || `post-${Date.now()}`;

const defaultSections: ArticleSection[] = [
  { type: 'intro', text: '' },
  { type: 'section', heading: '', text: '', image: '' },
  { type: 'section', heading: '', text: '', image: '' },
  { type: 'summary', text: '', points: [''] },
];

const sectionLabels: Record<string, string> = {
  intro: '🟢 הקדמה',
  section: '📄 פסקה',
  summary: '⭐ סיכום ונקודות עיקריות',
};

const AdminBlog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    featured_image: [] as string[],
    seo_title: '',
    seo_description: '',
    is_published: false,
    sections: defaultSections as ArticleSection[],
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

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as BlogPost[];
    },
  });

  // Build content HTML from sections for backward compatibility
  const buildContentFromSections = (sections: ArticleSection[]): string => {
    return sections.map((s) => {
      if (s.type === 'intro') return `<p>${s.text}</p>`;
      if (s.type === 'section') {
        let html = '';
        if (s.heading) html += `<h2>${s.heading}</h2>`;
        if (s.image) html += `<img src="${s.image}" alt="${s.heading || ''}" />`;
        html += `<p>${s.text}</p>`;
        return html;
      }
      if (s.type === 'summary') {
        let html = `<h2>סיכום</h2><p>${s.text}</p>`;
        if (s.points && s.points.filter(Boolean).length > 0) {
          html += '<ul>' + s.points.filter(Boolean).map(p => `<li>${p}</li>`).join('') + '</ul>';
        }
        return html;
      }
      return '';
    }).join('\n');
  };

  const createPost = useMutation({
    mutationFn: async (data: typeof formData) => {
      const content = buildContentFromSections(data.sections);
      const { error } = await supabase.from('blog_posts').insert({
        title: data.title,
        slug: data.slug || slugify(data.title),
        content,
        sections: data.sections as any,
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
      const content = buildContentFromSections(data.sections);
      const { error } = await supabase.from('blog_posts').update({
        title: data.title,
        slug: data.slug || slugify(data.title),
        content,
        sections: data.sections as any,
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
    setFormData({
      title: '', slug: '', featured_image: [], seo_title: '', seo_description: '',
      is_published: false, sections: [...defaultSections.map(s => ({ ...s, points: s.points ? [...s.points] : undefined }))],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    const sections: ArticleSection[] = (post.sections && Array.isArray(post.sections) && (post.sections as ArticleSection[]).length > 0)
      ? (post.sections as ArticleSection[])
      : defaultSections;
    setFormData({
      title: post.title,
      slug: post.slug,
      featured_image: post.featured_image ? [post.featured_image] : [],
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      is_published: post.is_published,
      sections,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingPost(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Title validation
    if (!formData.title.trim()) { toast.error('יש למלא כותרת'); return; }
    if (formData.title.trim().length < 3) { toast.error('כותרת חייבת להכיל לפחות 3 תווים'); return; }
    if (formData.title.trim().length > 200) { toast.error('כותרת ארוכה מדי (מקסימום 200 תווים)'); return; }
    
    // Slug validation
    if (!formData.slug.trim()) { toast.error('יש למלא slug'); return; }
    if (!/^[a-z0-9-]+$/.test(formData.slug.trim())) { toast.error('Slug יכול להכיל רק אותיות קטנות באנגלית, מספרים ומקפים'); return; }
    
    // Validate sections - check that non-summary sections with type 'section' have content
    const contentSections = formData.sections.filter(s => s.type === 'section');
    for (let i = 0; i < contentSections.length; i++) {
      if (!contentSections[i].text.trim()) {
        toast.error(`פסקה ${i + 1} ריקה — יש למלא תוכן או למחוק אותה`);
        return;
      }
    }
    
    // Validate intro if exists
    const introSection = formData.sections.find(s => s.type === 'intro');
    if (introSection && !introSection.text.trim()) {
      toast.error('יש למלא טקסט הקדמה או למחוק את ההקדמה');
      return;
    }
    
    // SEO validation (optional but if filled must be valid)
    if (formData.seo_title && formData.seo_title.length > 60) {
      toast.error('כותרת SEO ארוכה מדי (מקסימום 60 תווים)');
      return;
    }
    if (formData.seo_description && formData.seo_description.length > 160) {
      toast.error('תיאור SEO ארוך מדי (מקסימום 160 תווים)');
      return;
    }

    if (editingPost) {
      updatePost.mutate({ id: editingPost.id, data: formData });
    } else {
      createPost.mutate(formData);
    }
  };

  const updateSection = (index: number, updates: Partial<ArticleSection>) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], ...updates };
    setFormData({ ...formData, sections: newSections });
  };

  const removeSection = (index: number) => {
    setFormData({ ...formData, sections: formData.sections.filter((_, i) => i !== index) });
  };

  const addSection = (type: ArticleSection['type']) => {
    const newSection: ArticleSection = type === 'summary'
      ? { type: 'summary', text: '', points: [''] }
      : type === 'intro'
      ? { type: 'intro', text: '' }
      : { type: 'section', heading: '', text: '', image: '' };
    
    // Insert new sections BEFORE the summary (if exists)
    const summaryIndex = formData.sections.findIndex(s => s.type === 'summary');
    if (type !== 'summary' && summaryIndex !== -1) {
      const newSections = [...formData.sections];
      newSections.splice(summaryIndex, 0, newSection);
      setFormData({ ...formData, sections: newSections });
    } else {
      setFormData({ ...formData, sections: [...formData.sections, newSection] });
    }
  };

  const updatePoint = (sectionIndex: number, pointIndex: number, value: string) => {
    const newSections = [...formData.sections];
    const points = [...(newSections[sectionIndex].points || [])];
    points[pointIndex] = value;
    newSections[sectionIndex] = { ...newSections[sectionIndex], points };
    setFormData({ ...formData, sections: newSections });
  };

  const addPoint = (sectionIndex: number) => {
    const newSections = [...formData.sections];
    const points = [...(newSections[sectionIndex].points || []), ''];
    newSections[sectionIndex] = { ...newSections[sectionIndex], points };
    setFormData({ ...formData, sections: newSections });
  };

  const removePoint = (sectionIndex: number, pointIndex: number) => {
    const newSections = [...formData.sections];
    const points = (newSections[sectionIndex].points || []).filter((_, i) => i !== pointIndex);
    newSections[sectionIndex] = { ...newSections[sectionIndex], points };
    setFormData({ ...formData, sections: newSections });
  };

  const handleSectionImageUpload = (sectionIndex: number, images: string[]) => {
    updateSection(sectionIndex, { image: images[0] || '' });
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

            <form onSubmit={handleSubmit} noValidate>
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
                  
                />
              </FormGroup>

              <FormGroup>
                <Label>תמונה ראשית (Hero)</Label>
                <ImageUpload
                  images={formData.featured_image}
                  onChange={(images) => setFormData({ ...formData, featured_image: images })}
                  folder="blog"
                />
              </FormGroup>

              {/* Structured Sections */}
              <FormGroup>
                <Label>תבנית מאמר</Label>
                <TemplatePreview>
                  תבנית אחידה: הקדמה → פסקאות עם תמונות → סיכום ונקודות עיקריות
                </TemplatePreview>
              </FormGroup>

              {formData.sections.map((section, idx) => (
                <SectionCard key={idx}>
                  <SectionHeader>
                    <SectionLabel $type={section.type}>
                      <GripVertical size={14} />
                      {sectionLabels[section.type]}
                    </SectionLabel>
                    {formData.sections.length > 1 && (
                      <RemoveSectionButton type="button" onClick={() => removeSection(idx)}>
                        <Trash2 size={14} />
                      </RemoveSectionButton>
                    )}
                  </SectionHeader>

                  {/* Heading for section type */}
                  {section.type === 'section' && (
                    <FormGroup style={{ marginBottom: '0.75rem' }}>
                      <Label>כותרת פסקה</Label>
                      <Input
                        value={section.heading || ''}
                        onChange={(e) => updateSection(idx, { heading: e.target.value })}
                        placeholder="כותרת הפסקה..."
                      />
                    </FormGroup>
                  )}

                  {/* Text area */}
                  <FormGroup style={{ marginBottom: '0.75rem' }}>
                    <Label>
                      {section.type === 'intro' ? 'טקסט הקדמה' :
                       section.type === 'summary' ? 'טקסט סיכום' : 'תוכן'}
                    </Label>
                    <Textarea
                      value={section.text}
                      onChange={(e) => updateSection(idx, { text: e.target.value })}
                      placeholder={
                        section.type === 'intro' ? 'פתיחה קצרה שמסבירה על מה המאמר...' :
                        section.type === 'summary' ? 'סיכום קצר של המאמר...' :
                        'תוכן הפסקה...'
                      }
                      style={{ minHeight: section.type === 'intro' ? '80px' : '120px' }}
                    />
                  </FormGroup>

                  {/* Image upload for section type */}
                  {section.type === 'section' && (
                    <FormGroup style={{ marginBottom: '0' }}>
                      <Label>תמונת פסקה (אופציונלי)</Label>
                      {section.image ? (
                        <SectionImagePreview>
                          <img src={section.image} alt="תמונת פסקה" />
                          <RemoveImageBtn type="button" onClick={() => updateSection(idx, { image: '' })}>
                            <X size={14} />
                          </RemoveImageBtn>
                        </SectionImagePreview>
                      ) : (
                        <ImageUpload
                          images={[]}
                          onChange={(imgs) => handleSectionImageUpload(idx, imgs)}
                          folder="blog"
                        />
                      )}
                    </FormGroup>
                  )}

                  {/* Summary points */}
                  {section.type === 'summary' && (
                    <FormGroup style={{ marginBottom: '0' }}>
                      <Label>נקודות עיקריות</Label>
                      <PointsList>
                        {(section.points || []).map((point, pIdx) => (
                          <PointRow key={pIdx}>
                            <span style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>•</span>
                            <Input
                              value={point}
                              onChange={(e) => updatePoint(idx, pIdx, e.target.value)}
                              placeholder={`נקודה ${pIdx + 1}...`}
                              style={{ flex: 1 }}
                            />
                            {(section.points || []).length > 1 && (
                              <RemoveSectionButton type="button" onClick={() => removePoint(idx, pIdx)}>
                                <X size={14} />
                              </RemoveSectionButton>
                            )}
                          </PointRow>
                        ))}
                      </PointsList>
                      <Button
                        type="button"
                        $variant="outline"
                        onClick={() => addPoint(idx)}
                        style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
                      >
                        <Plus size={14} /> הוסף נקודה
                      </Button>
                    </FormGroup>
                  )}
                </SectionCard>
              ))}

              <AddSectionBar>
                <AddSectionButton type="button" onClick={() => addSection('section')}>
                  <Plus size={14} /> פסקה + תמונה
                </AddSectionButton>
                {!formData.sections.some(s => s.type === 'intro') && (
                  <AddSectionButton type="button" onClick={() => addSection('intro')}>
                    <Plus size={14} /> הקדמה
                  </AddSectionButton>
                )}
                {!formData.sections.some(s => s.type === 'summary') && (
                  <AddSectionButton type="button" onClick={() => addSection('summary')}>
                    <Plus size={14} /> סיכום
                  </AddSectionButton>
                )}
              </AddSectionBar>

              <FormGroup>
                <Label htmlFor="seo_title">כותרת SEO (לגוגל)</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="כותרת שתופיע בתוצאות חיפוש גוגל (עד 60 תווים)"
                  maxLength={60}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="seo_description">תיאור SEO (לגוגל)</Label>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="תיאור קצר שיופיע מתחת לכותרת בתוצאות חיפוש גוגל (עד 160 תווים)"
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
