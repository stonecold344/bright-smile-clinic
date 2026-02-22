import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Loader2, Calendar, ArrowLeft } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const HeroSection = styled.section`
  padding-top: 8rem;
  padding-bottom: 4rem;
  background: ${({ theme }) => theme.colors.secondary}4d;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
`;

const BlogSection = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BlogCard = styled(Link)`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-4px);
  }
`;

const CardImage = styled.div<{ $src?: string }>`
  height: 200px;
  background: ${({ $src, theme }) => $src ? `url(${$src}) center/cover no-repeat` : theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.75rem;
`;

const CardExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.7;
  flex: 1;
`;

const ReadMore = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 1rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const Blog = () => {
  const { data: posts = [], isLoading } = useBlogPosts();

  return (
    <div>
      <Header />
      <main>
        <HeroSection>
          <Container>
            <HeroContent>
              <Badge>הבלוג שלנו</Badge>
              <Title $size="xl" style={{ marginTop: '1rem' }}>מאמרים וטיפים</Title>
              <Text $color="muted" $size="lg">מידע מקצועי על בריאות הפה ועולם רפואת השיניים</Text>
            </HeroContent>
          </Container>
        </HeroSection>

        <BlogSection>
          <Container>
            {isLoading ? (
              <LoadingWrapper>
                <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
              </LoadingWrapper>
            ) : posts.length === 0 ? (
              <EmptyState>
                <Title $size="sm">אין מאמרים עדיין</Title>
                <Text $color="muted">מאמרים חדשים יופיעו כאן בקרוב</Text>
              </EmptyState>
            ) : (
              <BlogGrid>
                {posts.map((post) => (
                  <BlogCard key={post.id} to={`/blog/${post.slug}`}>
                    <CardImage $src={post.featured_image || undefined}>
                      {!post.featured_image && <Calendar size={48} />}
                    </CardImage>
                    <CardBody>
                      <CardDate>
                        <Calendar size={14} />
                        {post.published_at
                          ? format(new Date(post.published_at), 'dd MMMM yyyy', { locale: he })
                          : format(new Date(post.created_at), 'dd MMMM yyyy', { locale: he })}
                      </CardDate>
                      <CardTitle>{post.title}</CardTitle>
                      <CardExcerpt>{stripHtml(post.content).slice(0, 150)}...</CardExcerpt>
                      <ReadMore>
                        קראו עוד
                        <ArrowLeft size={16} />
                      </ReadMore>
                    </CardBody>
                  </BlogCard>
                ))}
              </BlogGrid>
            )}
          </Container>
        </BlogSection>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
