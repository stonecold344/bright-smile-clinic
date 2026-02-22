import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Loader2, Calendar, ArrowRight } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from '@/components/styled/Button';

const HeroSection = styled.section<{ $bg?: string }>`
  padding-top: 8rem;
  padding-bottom: 4rem;
  background: ${({ $bg, theme }) => $bg ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${$bg}) center/cover` : theme.colors.secondary + '4d'};
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
`;

const ArticleSection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`;

const ArticleContent = styled.article`
  max-width: 48rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};

  h1 { font-size: 1.75rem; font-weight: 700; margin: 1.5rem 0 0.75rem; color: ${({ theme }) => theme.colors.foreground}; }
  h2 { font-size: 1.375rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: ${({ theme }) => theme.colors.foreground}; }
  p { margin: 0.75rem 0; line-height: 1.8; color: ${({ theme }) => theme.colors.foreground}; }
  ul, ol { padding-right: 1.5rem; margin: 0.75rem 0; }
  li { margin: 0.375rem 0; line-height: 1.7; }
  img { max-width: 100%; border-radius: ${({ theme }) => theme.radii.lg}; margin: 1rem 0; }
  strong { font-weight: 600; }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const BackLink = styled.div`
  max-width: 48rem;
  margin: 2rem auto 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <div>
        <Header />
        <LoadingWrapper>
          <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
        </LoadingWrapper>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div>
        <Header />
        <main style={{ paddingTop: '8rem', textAlign: 'center', minHeight: '50vh' }}>
          <Container>
            <Title $size="lg">המאמר לא נמצא</Title>
            <Text $color="muted">ייתכן שהמאמר הוסר או שהקישור שגוי</Text>
            <Button as={Link} to="/blog" $variant="heroPrimary" style={{ marginTop: '1.5rem' }}>
              <ArrowRight size={18} />
              חזרה לבלוג
            </Button>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      {post.seo_title && <title>{post.seo_title}</title>}
      <Header />
      <main>
        <HeroSection $bg={post.featured_image || undefined}>
          <Container>
            <HeroContent>
              <Title $size="xl" $color={post.featured_image ? 'light' : undefined} style={{ marginTop: '1rem' }}>
                {post.title}
              </Title>
              <MetaInfo style={post.featured_image ? { color: 'rgba(255,255,255,0.8)' } : undefined}>
                <Calendar size={16} />
                {post.published_at
                  ? format(new Date(post.published_at), 'dd MMMM yyyy', { locale: he })
                  : format(new Date(post.created_at), 'dd MMMM yyyy', { locale: he })}
              </MetaInfo>
            </HeroContent>
          </Container>
        </HeroSection>

        <ArticleSection>
          <Container>
            <ArticleContent dangerouslySetInnerHTML={{ __html: post.content }} />
            <BackLink>
              <Button as={Link} to="/blog" $variant="outline">
                <ArrowRight size={18} />
                חזרה לבלוג
              </Button>
            </BackLink>
          </Container>
        </ArticleSection>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
