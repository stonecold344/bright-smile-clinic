import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/styled/Layout';

const PageWrapper = styled.div`
  padding-top: 5.5rem;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[4]};
  max-width: 800px;
  margin: 0 auto;
  overflow-wrap: break-word;
  word-break: break-word;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[16]} 0;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
`;

const UpdateDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const Paragraph = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const List = styled.ul`
  padding-right: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  
  li {
    list-style: disc;
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.foreground};
    line-height: 1.8;
    margin-bottom: 0.25rem;
  }
`;

const Terms = () => {
  return (
    <>
      <Header />
      <PageWrapper>
        <Container>
          <Content>
            <PageTitle>תנאי שימוש</PageTitle>
            <UpdateDate>עודכן לאחרונה: פברואר 2026</UpdateDate>

            <Section>
              <SectionTitle>1. הקדמה</SectionTitle>
              <Paragraph>
                ברוכים הבאים לאתר מרפאת השיניים (להלן: "האתר"). השימוש באתר כפוף לתנאי שימוש אלה. בגלישה באתר ו/או בשימוש בשירותים המוצעים בו, הנך מסכים/ה לתנאים אלה במלואם.
              </Paragraph>
              <Paragraph>
                תנאי שימוש אלה נכתבו בלשון זכר מטעמי נוחות בלבד, והם חלים על כל המגדרים.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>2. השירותים</SectionTitle>
              <Paragraph>
                האתר מספק מידע אודות שירותי המרפאה, מאפשר קביעת תורים מקוונת, צפייה בגלריית עבודות, קריאת מאמרים ויצירת קשר עם המרפאה.
              </Paragraph>
              <Paragraph>
                המידע באתר הינו לצרכי מידע כללי בלבד ואינו מהווה ייעוץ רפואי. לקבלת ייעוץ רפואי מקצועי, יש לפנות לרופא שיניים.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>3. קביעת תורים</SectionTitle>
              <List>
                <li>קביעת תור באתר מהווה בקשה בלבד ואינה מחייבת את המרפאה עד לאישור מצד המרפאה.</li>
                <li>ביטול תור יש לבצע לפחות 24 שעות מראש. ביטול באיחור עלול להיות כרוך בתשלום בהתאם למדיניות המרפאה.</li>
                <li>המרפאה שומרת לעצמה את הזכות לשנות או לבטל תורים בהתאם לצורך.</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>4. קניין רוחני</SectionTitle>
              <Paragraph>
                כל הזכויות באתר, לרבות עיצוב, טקסטים, תמונות, לוגו, סימני מסחר וקוד מקור, שייכות למרפאה ומוגנות על פי חוק זכות יוצרים, התשס"ח-2007, ופקודת סימני מסחר [נוסח חדש], התשל"ב-1972.
              </Paragraph>
              <Paragraph>
                אין להעתיק, לשכפל, להפיץ, לפרסם, להציג בפומבי או למסור לצד שלישי כל תוכן מהאתר ללא אישור מפורש בכתב מהמרפאה.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>5. הגבלת אחריות</SectionTitle>
              <Paragraph>
                בהתאם לחוק הגנת הצרכן, התשמ"א-1981:
              </Paragraph>
              <List>
                <li>המרפאה אינה אחראית לנזק שנגרם עקב תקלות טכניות באתר.</li>
                <li>המידע באתר מוצג "כמות שהוא" (AS IS) ואינו מהווה תחליף לייעוץ רפואי מקצועי.</li>
                <li>המרפאה אינה אחראית לתכנים של אתרים חיצוניים המקושרים מהאתר.</li>
                <li>תמונות הטיפולים באתר הן להמחשה בלבד. תוצאות הטיפול עשויות להשתנות מאדם לאדם.</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>6. נגישות</SectionTitle>
              <Paragraph>
                אנו מחויבים להנגשת האתר בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998, ותקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.
              </Paragraph>
              <Paragraph>
                האתר עומד בתקן הנגישות הישראלי (ת"י 5568) ברמת AA. אם נתקלתם בבעיית נגישות, אנא פנו אלינו ואנו נפעל לתקנה בהקדם.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>7. פרטיות</SectionTitle>
              <Paragraph>
                השימוש באתר כפוף גם למדיניות הפרטיות שלנו. נא עיינו במדיניות הפרטיות לפרטים מלאים אודות איסוף ושימוש במידע אישי.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>8. שימוש אסור</SectionTitle>
              <Paragraph>
                חל איסור מוחלט על:
              </Paragraph>
              <List>
                <li>שימוש באתר לכל מטרה בלתי חוקית</li>
                <li>העלאת תוכן פוגעני, מטעה או שקרי</li>
                <li>ניסיון לפרוץ למערכות האתר או לגשת למידע שאינו מיועד לך</li>
                <li>שימוש בבוטים או כלים אוטומטיים ללא אישור</li>
                <li>התחזות לאדם אחר</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>9. שינויים בתנאי השימוש</SectionTitle>
              <Paragraph>
                המרפאה שומרת לעצמה את הזכות לעדכן את תנאי השימוש מעת לעת. שינויים ייכנסו לתוקף עם פרסומם באתר. המשך השימוש באתר לאחר פרסום השינויים מהווה הסכמה לתנאים המעודכנים.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>10. דין חל וסמכות שיפוט</SectionTitle>
              <Paragraph>
                על תנאי שימוש אלה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית נתונה לבתי המשפט במחוז תל אביב-יפו.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>11. יצירת קשר</SectionTitle>
              <Paragraph>
                לשאלות בנושא תנאי השימוש, ניתן לפנות אלינו:
              </Paragraph>
              <List>
                <li>טלפון: 00-000-0000</li>
                <li>דוא"ל: info@dental-clinic.co.il</li>
                <li>כתובת: רחוב הרצל 123, תל אביב</li>
              </List>
            </Section>
          </Content>
        </Container>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default Terms;
