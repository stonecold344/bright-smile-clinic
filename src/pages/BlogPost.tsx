import { useParams, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Loader2, Calendar, ArrowRight, Clock, Share2 } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from '@/components/styled/Button';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroWrapper = styled.section`
  padding-top: 6rem;
  background: ${({ theme }) => theme.colors.background};
`;

const HeroInner = styled.div`
  max-width: 52rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 0;
  text-align: center;
  animation: ${fadeUp} 0.6s ease-out;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  padding: 0.35rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  margin-bottom: 1.25rem;
  letter-spacing: 0.02em;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.3;
  margin-bottom: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['5xl']};
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 2rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const FeaturedImage = styled.div<{ $src: string }>`
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  animation: ${fadeUp} 0.7s ease-out 0.1s both;

  &::after {
    content: '';
    display: block;
    width: 100%;
    padding-bottom: 52%;
    border-radius: ${({ theme }) => theme.radii['2xl']};
    background: url(${({ $src }) => $src}) center/cover no-repeat;
    box-shadow: ${({ theme }) => theme.shadows.elevated};
  }
`;

const FeaturedPlaceholder = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 4px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.gradients.hero};
    margin-top: 1rem;
  }
`;

const ArticleSection = styled.section`
  padding: ${({ theme }) => theme.spacing[12]} 0 ${({ theme }) => theme.spacing[20]};
`;

const ArticleContent = styled.article`
  max-width: 44rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  animation: ${fadeUp} 0.8s ease-out 0.2s both;

  h1 {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin: 2.5rem 0 1rem;
    color: ${({ theme }) => theme.colors.foreground};
    line-height: 1.35;
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin: 2rem 0 0.75rem;
    color: ${({ theme }) => theme.colors.foreground};
    line-height: 1.4;
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin: 1.75rem 0 0.5rem;
    color: ${({ theme }) => theme.colors.foreground};
  }

  p {
    margin: 1rem 0;
    line-height: 1.9;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.foreground};
  }

  ul, ol {
    padding-right: 1.75rem;
    margin: 1rem 0;
  }

  li {
    margin: 0.5rem 0;
    line-height: 1.8;
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.foreground};

    &::marker {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radii.xl};
    margin: 1.5rem 0;
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }

  strong {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.foreground};
  }

  blockquote {
    border-right: 4px solid ${({ theme }) => theme.colors.primary};
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    background: ${({ theme }) => theme.colors.primaryLight};
    border-radius: 0 ${({ theme }) => theme.radii.lg} ${({ theme }) => theme.radii.lg} 0;
    font-style: italic;
    color: ${({ theme }) => theme.colors.foreground};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    text-underline-offset: 3px;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Divider = styled.hr`
  max-width: 44rem;
  margin: 2.5rem auto;
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const BottomNav = styled.div`
  max-width: 44rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.secondary};
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const estimateReadingTime = (html: string): number => {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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

  const readingTime = estimateReadingTime(post.content);
  const dateStr = post.published_at
    ? format(new Date(post.published_at), 'dd MMMM yyyy', { locale: he })
    : format(new Date(post.created_at), 'dd MMMM yyyy', { locale: he });

  return (
    <div>
      {post.seo_title && <title>{post.seo_title}</title>}
      <Header />
      <main>
        <HeroWrapper>
          <HeroInner>
            <CategoryBadge>מאמר</CategoryBadge>
            <HeroTitle>{post.title}</HeroTitle>
            <MetaRow>
              <MetaItem>
                <Calendar size={15} />
                {dateStr}
              </MetaItem>
              <MetaItem>
                <Clock size={15} />
                {readingTime} דקות קריאה
              </MetaItem>
            </MetaRow>
          </HeroInner>
        </HeroWrapper>

        {post.featured_image ? (
          <FeaturedImage $src={post.featured_image} />
        ) : (
          <FeaturedPlaceholder />
        )}

        <ArticleSection>
          <ArticleContent dangerouslySetInnerHTML={{ __html: post.content }} />
          <Divider />
          <BottomNav>
            <Button as={Link} to="/blog" $variant="outline">
              <ArrowRight size={18} />
              חזרה לבלוג
            </Button>
            <ShareButton onClick={handleShare}>
              <Share2 size={16} />
              שיתוף
            </ShareButton>
          </BottomNav>
        </ArticleSection>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
