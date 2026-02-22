import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/styled/Layout';

const PageWrapper = styled.div`
  padding-top: 5.5rem;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing[16]} 0;
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
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
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
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

const Privacy = () => {
  return (
    <>
      <Header />
      <PageWrapper>
        <Container>
          <Content>
            <PageTitle>מדיניות פרטיות</PageTitle>
            <UpdateDate>עודכן לאחרונה: פברואר 2026</UpdateDate>

            <Section>
              <SectionTitle>1. כללי</SectionTitle>
              <Paragraph>
                מרפאת שיניים (להלן: "המרפאה" או "אנחנו") מכבדת את פרטיותך ומחויבת להגנה על המידע האישי שלך בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, ותקנות הגנת הפרטיות (אבטחת מידע), התשע"ז-2017.
              </Paragraph>
              <Paragraph>
                מדיניות פרטיות זו מתארת את אופן איסוף, שימוש, אחסון והגנה על המידע האישי שלך בעת שימוש באתר האינטרנט שלנו ובשירותי המרפאה.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>2. מידע שאנו אוספים</SectionTitle>
              <Paragraph>אנו עשויים לאסוף את המידע הבא:</Paragraph>
              <List>
                <li>פרטים אישיים: שם מלא, מספר טלפון, כתובת דוא"ל</li>
                <li>מידע רפואי: היסטוריה רפואית, פרטי טיפולים, תמונות רפואיות (בכפוף להסכמתך)</li>
                <li>מידע על תורים: תאריכי ושעות תורים, סוגי טיפולים</li>
                <li>מידע טכני: כתובת IP, סוג דפדפן, מערכת הפעלה, עמודים שנצפו</li>
                <li>עוגיות (Cookies): לצורך שיפור חוויית הגלישה</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>3. מטרות השימוש במידע</SectionTitle>
              <Paragraph>אנו משתמשים במידע שלך למטרות הבאות:</Paragraph>
              <List>
                <li>תיאום וניהול תורים</li>
                <li>מתן טיפול רפואי מותאם אישית</li>
                <li>שליחת תזכורות לתורים ועדכונים</li>
                <li>שיפור השירותים והאתר שלנו</li>
                <li>עמידה בדרישות חוקיות ורגולטוריות</li>
                <li>יצירת קשר בנוגע לשירותינו</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>4. שמירה ואבטחת המידע</SectionTitle>
              <Paragraph>
                אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע האישי שלך, בהתאם לתקנות הגנת הפרטיות (אבטחת מידע). האמצעים כוללים:
              </Paragraph>
              <List>
                <li>הצפנת מידע בהעברה ובאחסון</li>
                <li>הגבלת גישה למידע לצוות מורשה בלבד</li>
                <li>גיבוי מידע שוטף</li>
                <li>ביקורות אבטחה תקופתיות</li>
              </List>
              <Paragraph>
                המידע הרפואי נשמר בהתאם לתקנות בריאות העם (שמירת רשומות רפואיות), התשע"ז-2017, לתקופה של לפחות 7 שנים.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>5. שיתוף מידע עם צדדים שלישיים</SectionTitle>
              <Paragraph>
                אנו לא מוכרים, משכירים או מעבירים את המידע האישי שלך לצדדים שלישיים, אלא במקרים הבאים:
              </Paragraph>
              <List>
                <li>בהסכמתך המפורשת</li>
                <li>לצורך מתן שירותים רפואיים (כגון מעבדות שיניים)</li>
                <li>לעמידה בדרישות חוק או צו בית משפט</li>
                <li>לספקי שירות הפועלים מטעמנו ובכפוף להסכמי סודיות</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>6. עוגיות (Cookies)</SectionTitle>
              <Paragraph>
                האתר שלנו משתמש בעוגיות לצורך:
              </Paragraph>
              <List>
                <li>עוגיות הכרחיות: לתפקוד תקין של האתר</li>
                <li>עוגיות ביצועים: לניתוח תעבורה ושיפור חוויית המשתמש</li>
                <li>עוגיות פונקציונליות: לשמירת העדפות המשתמש (כגון הגדרות נגישות)</li>
              </List>
              <Paragraph>
                באפשרותך לשלוט בעוגיות דרך הגדרות הדפדפן שלך. שים לב כי חסימת עוגיות מסוימות עשויה לפגוע בתפקוד האתר.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>7. זכויותיך</SectionTitle>
              <Paragraph>
                בהתאם לחוק הגנת הפרטיות, עומדות לך הזכויות הבאות:
              </Paragraph>
              <List>
                <li>הזכות לעיין במידע האישי שלך המוחזק אצלנו</li>
                <li>הזכות לבקש תיקון מידע שגוי</li>
                <li>הזכות לבקש מחיקת מידע (בכפוף למגבלות חוקיות)</li>
                <li>הזכות להתנגד לשימוש במידע לצורך דיוור ישיר</li>
                <li>הזכות לפנות לרשות להגנת הפרטיות בתלונה</li>
              </List>
              <Paragraph>
                לממש את זכויותיך, ניתן לפנות אלינו באמצעות פרטי הקשר המופיעים בתחתית עמוד זה.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>8. מידע על קטינים</SectionTitle>
              <Paragraph>
                איסוף מידע אישי על קטינים מתחת לגיל 18 מתבצע רק בהסכמת הורה או אפוטרופוס, בהתאם לחוק הכשרות המשפטית והאפוטרופסות, התשכ"ב-1962.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>9. שינויים במדיניות</SectionTitle>
              <Paragraph>
                אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יפורסמו באתר ותישלח הודעה למשתמשים רשומים.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>10. יצירת קשר</SectionTitle>
              <Paragraph>
                לשאלות, בקשות או תלונות בנושא פרטיות, ניתן לפנות אלינו:
              </Paragraph>
              <List>
                <li>טלפון: 00-000-0000</li>
                <li>דוא"ל: info@dental-clinic.co.il</li>
                <li>כתובת: רחוב הרצל 123, תל אביב</li>
              </List>
              <Paragraph>
                ניתן גם לפנות לרשות להגנת הפרטיות:
                <br />
                אתר: www.gov.il/he/departments/the_privacy_protection_authority
              </Paragraph>
            </Section>
          </Content>
        </Container>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default Privacy;
