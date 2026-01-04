import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Check } from "lucide-react";
import heroImage from "@/assets/hero-dental.jpg";

const services = [
  {
    icon: "🦷",
    title: "טיפולי שיניים כלליים",
    description: "טיפולים מונעים, סתימות, ניקוי שיניים מקצועי ובדיקות תקופתיות לשמירה על בריאות הפה.",
    features: ["בדיקות תקופתיות", "ניקוי מקצועי", "סתימות לבנות", "טיפולי חניכיים"],
  },
  {
    icon: "✨",
    title: "הלבנת שיניים",
    description: "טיפולי הלבנה מתקדמים בשיטות שונות לחיוך לבן וזוהר יותר.",
    features: ["הלבנה במרפאה", "ערכת הלבנה ביתית", "הלבנה בלייזר", "תוצאות מהירות"],
  },
  {
    icon: "🔧",
    title: "שתלים דנטליים",
    description: "שתלי שיניים איכותיים עם אחוזי הצלחה גבוהים, פתרון קבוע לשיניים חסרות.",
    features: ["שתלים מתקדמים", "תכנון מחשב", "ריפוי מהיר", "אחריות מלאה"],
  },
  {
    icon: "👶",
    title: "רפואת שיניים לילדים",
    description: "טיפול עדין ומותאם לילדים בסביבה ידידותית ונעימה שמפחיתה חרדות.",
    features: ["סביבה ידידותית", "טיפול עדין", "הרדמה מותאמת", "מניעה מוקדמת"],
  },
  {
    icon: "😁",
    title: "יישור שיניים",
    description: "פתרונות אורתודנטיים מתקדמים כולל קשתיות שקופות ליישור שיניים יעיל.",
    features: ["קשתיות שקופות", "גשרים קבועים", "ריטיינרים", "מעקב קבוע"],
  },
  {
    icon: "🏆",
    title: "אסתטיקה דנטלית",
    description: "ציפויי חרסינה, עיצוב חיוך ושיפור מראה השיניים לחיוך מושלם.",
    features: ["ציפויי חרסינה", "עיצוב חיוך", "סגירת רווחים", "שיקום אסתטי"],
  },
  {
    icon: "🩺",
    title: "טיפולי שורש",
    description: "טיפולי שורש מקצועיים להצלת שיניים פגועות ושמירה על השן הטבעית.",
    features: ["אבחון מדויק", "טיפול ללא כאב", "שימור השן", "מעקב"],
  },
  {
    icon: "🚨",
    title: "טיפולי חירום",
    description: "זמינות לטיפולי חירום בשיניים - כאבים, שברים ומקרים דחופים.",
    features: ["זמינות מהירה", "טיפול דחוף", "הקלה בכאב", "פתרון מיידי"],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="שירותי מרפאה"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                השירותים שלנו
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                טיפולי שיניים מקצועיים
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                אנו מציעים מגוון רחב של טיפולי שיניים מתקדמים לכל המשפחה בטכנולוגיות החדשניות ביותר
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center text-3xl shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <ul className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <Check className="w-4 h-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
