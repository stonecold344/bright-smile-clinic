import { Link } from "react-router-dom";
import { Phone, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dental.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="מרפאת שיניים מודרנית"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-foreground/80 via-foreground/60 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20">
        <div className="max-w-2xl mr-auto">
          <div className="animate-fade-up">
            <span className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium mb-6">
              ✨ מרפאת שיניים מובילה
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            חיוך בריא
            <br />
            <span className="text-gradient bg-gradient-to-l from-primary to-accent">לכל החיים</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            מרפאת שיניים מקצועית המספקת טיפולי שיניים מתקדמים בסביבה נעימה ומרגיעה.
            צוות המומחים שלנו מחויב לבריאות הפה ולחיוך המושלם שלכם.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <a href="tel:+972-00-000-0000">
              <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                <Phone className="w-5 h-5" />
                התקשרו עכשיו
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto gap-2">
                <Calendar className="w-5 h-5" />
                קביעת תור
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap gap-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                <span className="text-lg">👨‍⚕️</span>
              </div>
              <span className="text-sm">צוות מומחים</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                <span className="text-lg">🏥</span>
              </div>
              <span className="text-sm">ציוד מתקדם</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <span className="text-sm">5 כוכבים בגוגל</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary-foreground/60" />
      </div>
    </section>
  );
};

export default HeroSection;
