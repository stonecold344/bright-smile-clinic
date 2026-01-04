import { Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 bg-primary-foreground/20 rounded-full text-primary-foreground text-sm font-medium mb-6">
            📞 התקשרו עכשיו
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            מוכנים לחיוך חדש?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 leading-relaxed">
            צוות המומחים שלנו מחכה לכם. קבעו תור עכשיו וקבלו ייעוץ חינם לגבי הטיפול המתאים לכם.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+972-00-000-0000">
              <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                <Phone className="w-5 h-5" />
                00-000-0000
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto gap-2">
                <Calendar className="w-5 h-5" />
                קביעת תור אונליין
              </Button>
            </Link>
          </div>

          {/* Trust Elements */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <span className="text-2xl">✓</span>
              <span>ייעוץ ראשוני חינם</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <span className="text-2xl">✓</span>
              <span>תוכניות תשלום גמישות</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <span className="text-2xl">✓</span>
              <span>אחריות מלאה</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
