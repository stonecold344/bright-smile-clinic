import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Loader2, Calendar, ArrowLeft, Clock } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

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

const FeaturedCard = styled(Link)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-bottom: 3rem;
  animation: ${fadeUp} 0.5s ease-out;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1.2fr 1fr;
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-4px);
  }
`;

const FeaturedImage = styled.div<{ $src?: string }>`
  height: 240px;
  background: ${({ $src, theme }) => $src ? `url(${$src}) center/cover no-repeat` : theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 100%;
    min-height: 320px;
  }
`;

const FeaturedBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 2.5rem;
  }
`;

const FeaturedBadge = styled.span`
  display: inline-block;
  width: fit-content;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  padding: 0.3rem 0.85rem;
  border-radius: ${({ theme }) => theme.radii.full};
  margin-bottom: 1rem;
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

const BlogCard = styled(Link)<{ $index?: number }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  flex-direction: column;
  animation: ${fadeUp} 0.5s ease-out ${({ $index }) => ($index || 0) * 0.1}s both;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-4px);

    img, .card-image {
      transform: scale(1.05);
    }
  }
`;

const CardImageWrapper = styled.div`
  height: 200px;
  overflow: hidden;
`;

const CardImage = styled.div<{ $src?: string }>`
  height: 100%;
  width: 100%;
  background: ${({ $src, theme }) => $src ? `url(${$src}) center/cover no-repeat` : theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.mutedForeground};
  transition: transform ${({ theme }) => theme.transitions.normal};
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-bottom: 0.75rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.75rem;
  line-height: 1.4;
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
  transition: gap ${({ theme }) => theme.transitions.fast};

  ${BlogCard}:hover & {
    gap: 0.75rem;
  }
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

const estimateReadingTime = (html: string): number => {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const Blog = () => {
  const { data: posts = [], isLoading } = useBlogPosts();
  const [featured, ...rest] = posts;

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
              <>
                {/* Featured post */}
                {featured && (
                  <FeaturedCard to={`/blog/${featured.slug}`}>
                    <FeaturedImage $src={featured.featured_image || undefined}>
                      {!featured.featured_image && <Calendar size={64} style={{ opacity: 0.3 }} />}
                    </FeaturedImage>
                    <FeaturedBody>
                      <FeaturedBadge>מאמר מומלץ</FeaturedBadge>
                      <CardTitle style={{ fontSize: '1.5rem' }}>{featured.title}</CardTitle>
                      <CardMeta>
                        <MetaItem>
                          <Calendar size={13} />
                          {featured.published_at
                            ? format(new Date(featured.published_at), 'dd MMMM yyyy', { locale: he })
                            : format(new Date(featured.created_at), 'dd MMMM yyyy', { locale: he })}
                        </MetaItem>
                        <MetaItem>
                          <Clock size={13} />
                          {estimateReadingTime(featured.content)} דק׳
                        </MetaItem>
                      </CardMeta>
                      <CardExcerpt>{stripHtml(featured.content).slice(0, 200)}...</CardExcerpt>
                      <ReadMore>
                        קראו עוד
                        <ArrowLeft size={16} />
                      </ReadMore>
                    </FeaturedBody>
                  </FeaturedCard>
                )}

                {/* Rest of posts */}
                {rest.length > 0 && (
                  <BlogGrid>
                    {rest.map((post, i) => (
                      <BlogCard key={post.id} to={`/blog/${post.slug}`} $index={i}>
                        <CardImageWrapper>
                          <CardImage className="card-image" $src={post.featured_image || undefined}>
                            {!post.featured_image && <Calendar size={48} style={{ opacity: 0.3 }} />}
                          </CardImage>
                        </CardImageWrapper>
                        <CardBody>
                          <CardMeta>
                            <MetaItem>
                              <Calendar size={13} />
                              {post.published_at
                                ? format(new Date(post.published_at), 'dd MMMM yyyy', { locale: he })
                                : format(new Date(post.created_at), 'dd MMMM yyyy', { locale: he })}
                            </MetaItem>
                            <MetaItem>
                              <Clock size={13} />
                              {estimateReadingTime(post.content)} דק׳
                            </MetaItem>
                          </CardMeta>
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
              </>
            )}
          </Container>
        </BlogSection>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
