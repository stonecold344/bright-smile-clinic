import { useState } from 'react';
import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container, Badge } from '@/components/styled/Layout';
import { Title, Text } from '@/components/styled/Typography';
import { ChevronDown } from 'lucide-react';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import { Helmet } from 'react-helmet-async';

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

const FAQSection = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} 0;
  background: ${({ theme }) => theme.colors.background};
`;

const FAQList = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.elevated};
  }
`;

const FAQQuestion = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: right;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  gap: 1rem;

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FAQAnswer = styled.div<{ $open: boolean }>`
  max-height: ${({ $open }) => ($open ? '500px' : '0')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  overflow: hidden;
  transition: max-height 0.4s ease, opacity 0.3s ease, padding 0.3s ease;
  padding: ${({ $open }) => ($open ? '0 1.5rem 1.25rem' : '0 1.5rem')};
  color: ${({ theme }) => theme.colors.mutedForeground};
  line-height: 1.8;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const faqData = [
  {
    question: 'כמה זמן לוקח טיפול שיניים רגיל?',
    answer: 'טיפול שיניים רגיל כגון בדיקה וניקוי שיניים אורך בדרך כלל כ-30 עד 60 דקות. טיפולים מורכבים יותר כמו טיפולי שורש או כתרים עשויים לארוך יותר, ונקבע עם המטופל מראש.'
  },
  {
    question: 'האם הטיפולים כואבים?',
    answer: 'אנו משתמשים בטכנולוגיות מתקדמות ובהרדמה מקומית כדי להבטיח שהטיפולים יהיו נוחים ככל האפשר. רוב המטופלים מדווחים על מינימום אי נוחות במהלך הטיפול ואחריו.'
  },
  {
    question: 'כל כמה זמן צריך לבוא לבדיקה?',
    answer: 'מומלץ להגיע לבדיקת שיניים שגרתית וניקוי כל 6 חודשים. במקרים מסוימים, רופא השיניים עשוי להמליץ על ביקורים תכופים יותר בהתאם למצב בריאות הפה שלכם.'
  },
  {
    question: 'האם אתם מקבלים ביטוחי שיניים?',
    answer: 'כן, אנו עובדים עם רוב חברות הביטוח הגדולות בישראל. מומלץ לבדוק מראש את הכיסוי הביטוחי שלכם. צוות המרפאה ישמח לסייע לכם בהגשת תביעות ובירור זכאות.'
  },
  {
    question: 'מה לעשות במקרה חירום דנטלי?',
    answer: 'במקרה של חירום דנטלי כמו שבר בשן, כאב חזק או דימום, פנו אלינו מיד. אנו שומרים זמני חירום במהלך שעות הפעילות. מחוץ לשעות הפעילות, ניתן להשאיר הודעה ונחזור אליכם בהקדם האפשרי.'
  },
  {
    question: 'האם אפשר לקבוע תור אונליין?',
    answer: 'בהחלט! ניתן לקבוע תור דרך האתר שלנו בכל שעה. פשוט לחצו על "קביעת תור" ומלאו את הפרטים הנדרשים. נאשר את התור בהקדם.'
  },
  {
    question: 'מהם שעות הפעילות של המרפאה?',
    answer: 'המרפאה פועלת בימים א׳-ה׳ בין השעות 08:00-20:00, ביום ו׳ בין השעות 08:00-14:00. בשבת המרפאה סגורה.'
  },
  {
    question: 'האם יש חנייה ליד המרפאה?',
    answer: 'כן, ישנה חנייה זמינה בסמוך למרפאה. ניתן למצוא חניון ציבורי במרחק הליכה קצר. בנוסף, המרפאה נגישה בתחבורה ציבורית.'
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div>
      <Helmet>
        <title>שאלות נפוצות | מרפאת שיניים</title>
        <meta name="description" content="תשובות לשאלות הנפוצות ביותר על טיפולי שיניים, קביעת תורים, ביטוחים ועוד" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Header />
      <main>
        <HeroSection>
          <Container>
            <HeroContent>
              <Badge>שאלות נפוצות</Badge>
              <Title $size="xl" style={{ marginTop: '1rem' }}>
                שאלות ותשובות
              </Title>
              <Text $color="muted" $size="lg">
                מצאו תשובות לשאלות הנפוצות ביותר
              </Text>
            </HeroContent>
          </Container>
        </HeroSection>

        <FAQSection>
          <Container>
            <FAQList>
              {faqData.map((item, index) => (
                <ScrollAnimationWrapper key={index} delay={index * 0.05}>
                  <FAQItem>
                    <FAQQuestion
                      $open={openIndex === index}
                      onClick={() => toggle(index)}
                      aria-expanded={openIndex === index}
                    >
                      {item.question}
                      <ChevronDown size={22} />
                    </FAQQuestion>
                    <FAQAnswer $open={openIndex === index}>
                      {item.answer}
                    </FAQAnswer>
                  </FAQItem>
                </ScrollAnimationWrapper>
              ))}
            </FAQList>
          </Container>
        </FAQSection>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
