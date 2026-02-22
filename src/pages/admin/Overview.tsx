import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Title, Text } from '@/components/styled/Typography';
import { Calendar, Stethoscope, MessageSquare, TrendingUp, Loader2, FileText, Image } from 'lucide-react';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Link)`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition: all ${({ theme }) => theme.transitions.normal};
  display: block;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
    transform: translateY(-4px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: white;
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

const WelcomeCard = styled.div`
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: 3rem;
  margin-bottom: 2rem;
  color: white;
`;

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0 0 0.5rem 0;
`;

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  opacity: 0.9;
  margin: 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const AdminOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [appointmentsRes, treatmentsRes, testimonialsRes, blogRes, galleryRes] = await Promise.all([
        supabase.from('appointments').select('id, status'),
        supabase.from('treatments').select('id'),
        supabase.from('testimonials').select('id, is_visible'),
        supabase.from('blog_posts').select('id, is_published'),
        supabase.from('gallery').select('id'),
      ]);

      const appointments = appointmentsRes.data || [];
      const activeStatuses = ['pending', 'confirmed', 'arrived'];
      const activeAppointments = appointments.filter(a => activeStatuses.includes(a.status));
      const treatments = treatmentsRes.data || [];
      const testimonials = testimonialsRes.data || [];
      const blogPosts = blogRes.data || [];
      const galleryItems = galleryRes.data || [];

      return {
        totalAppointments: activeAppointments.length,
        pendingAppointments: activeAppointments.filter(a => a.status === 'pending').length,
        totalTreatments: treatments.length,
        totalTestimonials: testimonials.length,
        visibleTestimonials: testimonials.filter(t => t.is_visible).length,
        totalBlogPosts: blogPosts.length,
        publishedBlogPosts: blogPosts.filter(p => p.is_published).length,
        totalGalleryItems: galleryItems.length,
      };
    },
  });

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Loader2 size={48} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
      </LoadingWrapper>
    );
  }

  return (
    <div>
      <WelcomeCard>
        <WelcomeTitle>שלום, מנהל!</WelcomeTitle>
        <WelcomeText>ברוך הבא לממשק הניהול של מרפאת השיניים</WelcomeText>
      </WelcomeCard>

      <Grid>
        <StatCard to="/admin/appointments">
          <StatHeader>
            <IconWrapper>
              <Calendar size={24} />
            </IconWrapper>
            <TrendingUp size={20} style={{ color: '#16a34a' }} />
          </StatHeader>
          <StatValue>{stats?.totalAppointments || 0}</StatValue>
          <StatLabel>תורים פעילים ({stats?.pendingAppointments || 0} ממתינים)</StatLabel>
        </StatCard>

        <StatCard to="/admin/treatments">
          <StatHeader>
            <IconWrapper>
              <Stethoscope size={24} />
            </IconWrapper>
          </StatHeader>
          <StatValue>{stats?.totalTreatments || 0}</StatValue>
          <StatLabel>טיפולים זמינים</StatLabel>
        </StatCard>

        <StatCard to="/admin/testimonials">
          <StatHeader>
            <IconWrapper>
              <MessageSquare size={24} />
            </IconWrapper>
          </StatHeader>
          <StatValue>{stats?.totalTestimonials || 0}</StatValue>
          <StatLabel>המלצות ({stats?.visibleTestimonials || 0} מוצגות)</StatLabel>
        </StatCard>

        <StatCard to="/admin/blog">
          <StatHeader>
            <IconWrapper>
              <FileText size={24} />
            </IconWrapper>
          </StatHeader>
          <StatValue>{stats?.totalBlogPosts || 0}</StatValue>
          <StatLabel>מאמרים ({stats?.publishedBlogPosts || 0} פורסמו)</StatLabel>
        </StatCard>

        <StatCard to="/admin/gallery">
          <StatHeader>
            <IconWrapper>
              <Image size={24} />
            </IconWrapper>
          </StatHeader>
          <StatValue>{stats?.totalGalleryItems || 0}</StatValue>
          <StatLabel>פריטים בגלריה</StatLabel>
        </StatCard>
      </Grid>
    </div>
  );
};

export default AdminOverview;
