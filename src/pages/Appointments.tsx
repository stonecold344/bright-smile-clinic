import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppointmentBooking from '@/components/AppointmentBooking';
import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: 5rem;
`;

const HeroSection = styled.section`
  background: ${({ theme }) => theme.gradients.hero};
  padding: 3rem 0 2rem;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: white;
  margin-bottom: 0.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
`;

const BookingSection = styled.section`
  padding: 3rem 0 4rem;
  background: ${({ theme }) => theme.colors.background};
`;

const Appointments = () => {
  return (
    <PageWrapper>
      <Header />
      <Main>
        <HeroSection>
          <Container>
            <Title>קביעת תור</Title>
            <Subtitle>בחרו תאריך ושעה נוחים לכם ונחזור אליכם לאישור</Subtitle>
          </Container>
        </HeroSection>
        <BookingSection>
          <Container>
            <AppointmentBooking />
          </Container>
        </BookingSection>
      </Main>
      <Footer />
    </PageWrapper>
  );
};

export default Appointments;
