import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { Loader2, Calendar, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlogPosts';
import type { ArticleSection } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from '@/components/styled/Button';
import SocialShare from '@/components/SocialShare';

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

const ArticleSection_ = styled.section`
  padding: ${({ theme }) => theme.spacing[12]} 0 ${({ theme }) => theme.spacing[20]};
`;

const ArticleBody = styled.article`
  max-width: 44rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  animation: ${fadeUp} 0.8s ease-out 0.2s both;
`;

/* --- Structured Section Styles --- */

const IntroText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 2.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.3rem;
  }
`;

const SectionBlock = styled.div`
  margin-bottom: 2.5rem;
`;

const SectionHeading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 1rem;
  line-height: 1.4;
  position: relative;
  padding-right: 1rem;

  &::before {
    content: '';
    position: absolute;
    right: 0;
    top: 0.25em;
    bottom: 0.25em;
    width: 4px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.gradients.hero};
  }
`;

const SectionImage = styled.div<{ $src: string }>`
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  margin-bottom: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};

  img {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: cover;
    display: block;
  }
`;

const SectionText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.foreground};
  white-space: pre-line;
`;

const SummaryBox = styled.div`
  background: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: 2rem;
  margin: 2.5rem 0;
  border-right: 5px solid ${({ theme }) => theme.colors.primary};
`;

const SummaryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 1rem;
`;

const PointList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PointItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.4rem 0;
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.foreground};

  svg {
    flex-shrink: 0;
    margin-top: 0.2rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/* --- Legacy content fallback --- */

const LegacyContent = styled.div`
  h1 { font-size: ${({ theme }) => theme.fontSizes['3xl']}; font-weight: ${({ theme }) => theme.fontWeights.bold}; margin: 2.5rem 0 1rem; color: ${({ theme }) => theme.colors.foreground}; line-height: 1.35; }
  h2 { font-size: ${({ theme }) => theme.fontSizes['2xl']}; font-weight: ${({ theme }) => theme.fontWeights.semibold}; margin: 2rem 0 0.75rem; color: ${({ theme }) => theme.colors.foreground}; line-height: 1.4; }
  p { margin: 1rem 0; line-height: 1.9; font-size: ${({ theme }) => theme.fontSizes.lg}; color: ${({ theme }) => theme.colors.foreground}; }
  ul, ol { padding-right: 1.75rem; margin: 1rem 0; }
  li { margin: 0.5rem 0; line-height: 1.8; font-size: ${({ theme }) => theme.fontSizes.base}; &::marker { color: ${({ theme }) => theme.colors.primary}; } }
  img { max-width: 100%; border-radius: ${({ theme }) => theme.radii.xl}; margin: 1.5rem 0; box-shadow: ${({ theme }) => theme.shadows.soft}; }
  strong { font-weight: ${({ theme }) => theme.fontWeights.bold}; }
  blockquote { border-right: 4px solid ${({ theme }) => theme.colors.primary}; padding: 1rem 1.5rem; margin: 1.5rem 0; background: ${({ theme }) => theme.colors.primaryLight}; border-radius: 0 ${({ theme }) => theme.radii.lg} ${({ theme }) => theme.radii.lg} 0; }
  a { color: ${({ theme }) => theme.colors.primary}; text-decoration: underline; text-underline-offset: 3px; &:hover { opacity: 0.8; } }
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

// ShareButton removed - using SocialShare component instead

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const estimateReadingTime = (text: string): number => {
  const clean = text.replace(/<[^>]*>/g, '');
  const words = clean.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const getFullText = (post: { content: string; sections?: ArticleSection[] | null }): string => {
  if (post.sections && Array.isArray(post.sections) && post.sections.length > 0) {
    return post.sections.map(s => `${s.heading || ''} ${s.text} ${(s.points || []).join(' ')}`).join(' ');
  }
  return post.content;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  // Set OG meta tags dynamically
  useEffect(() => {
    if (post) {
      const setMeta = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.content = content;
      };
      setMeta('og:title', post.seo_title || post.title);
      setMeta('og:description', post.seo_description || '');
      setMeta('og:url', window.location.href);
      setMeta('og:type', 'article');
      if (post.featured_image) setMeta('og:image', post.featured_image);
      
      // Twitter card
      let tw = document.querySelector('meta[name="twitter:card"]') as HTMLMetaElement;
      if (!tw) { tw = document.createElement('meta'); tw.setAttribute('name', 'twitter:card'); document.head.appendChild(tw); }
      tw.content = 'summary_large_image';
    }
  }, [post]);

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

  const hasStructuredSections = post.sections && Array.isArray(post.sections) && (post.sections as ArticleSection[]).length > 0;
  const sections = hasStructuredSections ? (post.sections as ArticleSection[]) : [];
  const readingTime = estimateReadingTime(getFullText(post));
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
              <MetaItem><Calendar size={15} />{dateStr}</MetaItem>
              <MetaItem><Clock size={15} />{readingTime} דקות קריאה</MetaItem>
            </MetaRow>
          </HeroInner>
        </HeroWrapper>

        {post.featured_image ? (
          <FeaturedImage $src={post.featured_image} />
        ) : (
          <FeaturedPlaceholder />
        )}

        <ArticleSection_>
          <ArticleBody>
            {hasStructuredSections ? (
              <>
                {sections.map((section, idx) => {
                  if (section.type === 'intro') {
                    return <IntroText key={idx}>{section.text}</IntroText>;
                  }
                  if (section.type === 'section') {
                    return (
                      <SectionBlock key={idx}>
                        {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
                        {section.image && (
                          <SectionImage $src={section.image}>
                            <img src={section.image} alt={section.heading || `תמונה ${idx + 1}`} loading="lazy" />
                          </SectionImage>
                        )}
                        <SectionText>{section.text}</SectionText>
                      </SectionBlock>
                    );
                  }
                  if (section.type === 'summary') {
                    return (
                      <SummaryBox key={idx}>
                        <SummaryTitle>
                          <CheckCircle2 size={22} />
                          נקודות עיקריות
                        </SummaryTitle>
                        {section.text && <SummaryText>{section.text}</SummaryText>}
                        {section.points && section.points.filter(Boolean).length > 0 && (
                          <PointList>
                            {section.points.filter(Boolean).map((point, pIdx) => (
                              <PointItem key={pIdx}>
                                <CheckCircle2 size={16} />
                                {point}
                              </PointItem>
                            ))}
                          </PointList>
                        )}
                      </SummaryBox>
                    );
                  }
                  return null;
                })}
              </>
            ) : (
              <LegacyContent dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </ArticleBody>

          <Divider />
          <BottomNav>
            <Button as={Link} to="/blog" $variant="outline">
              <ArrowRight size={18} />
              חזרה לבלוג
            </Button>
            <SocialShare
              title={post.title}
              description={post.seo_description || undefined}
              image={post.featured_image || undefined}
            />
          </BottomNav>
        </ArticleSection_>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
