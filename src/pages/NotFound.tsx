import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from 'lucide-react';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(200, 20%, 96%);
`;

const Content = styled.div`
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 800;
  background: linear-gradient(135deg, hsl(174, 62%, 45%) 0%, hsl(190, 60%, 50%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: hsl(200, 50%, 15%);
  margin: 1rem 0;
`;

const Text = styled.p`
  font-size: 1.125rem;
  color: hsl(200, 15%, 45%);
  margin-bottom: 2rem;
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, hsl(174, 62%, 45%) 0%, hsl(190, 60%, 50%) 100%);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Wrapper>
      <Content>
        <ErrorCode>404</ErrorCode>
        <Title>הדף לא נמצא</Title>
        <Text>מצטערים, הדף שחיפשתם אינו קיים או הוסר</Text>
        <HomeLink to="/">
          <Home size={20} />
          חזרה לדף הבית
        </HomeLink>
      </Content>
    </Wrapper>
  );
};

export default NotFound;
