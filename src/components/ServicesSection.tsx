import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: "🦷",
    title: "טיפולי שיניים כלליים",
    description: "טיפולים מונעים, סתימות, ניקוי שיניים מקצועי ובדיקות תקופתיות.",
  },
  {
    icon: "✨",
    title: "הלבנת שיניים",
    description: "טיפולי הלבנה מתקדמים לחיוך לבן וזוהר יותר.",
  },
  {
    icon: "🔧",
    title: "שתלים דנטליים",
    description: "שתלי שיניים איכותיים עם אחוזי הצלחה גבוהים.",
  },
  {
    icon: "👶",
    title: "רפואת שיניים לילדים",
    description: "טיפול עדין ומותאם לילדים בסביבה ידידותית ונעימה.",
  },
  {
    icon: "😁",
    title: "יישור שיניים",
    description: "פתרונות אורתודנטיים מתקדמים כולל קשתיות שקופות.",
  },
  {
    icon: "🏆",
    title: "אסתטיקה דנטלית",
    description: "ציפויי חרסינה, עיצוב חיוך ושיפור מראה השיניים.",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            השירותים שלנו
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            טיפולי שיניים מקצועיים
          </h2>
          <p className="text-muted-foreground text-lg">
            אנו מציעים מגוון רחב של טיפולי שיניים מתקדמים לכל המשפחה
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="heroPrimary" size="lg" className="gap-2">
              לכל השירותים
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
