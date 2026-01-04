import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
                <span className="text-2xl">🦷</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">מרפאת שיניים</h3>
                <p className="text-sm opacity-80">חיוך בריא לכל החיים</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              מרפאת שיניים מקצועית המספקת טיפול שיניים איכותי בסביבה נעימה ומרגיעה.
              אנו מחויבים לבריאות הפה שלכם.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">קישורים מהירים</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                בית
              </Link>
              <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                אודות
              </Link>
              <Link to="/services" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                שירותים
              </Link>
              <Link to="/contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                צור קשר
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">פרטי התקשרות</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+972-00-000-0000" className="flex items-center gap-3 text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Phone className="w-5 h-5 text-primary" />
                <span>00-000-0000</span>
              </a>
              <a href="mailto:info@dental-clinic.co.il" className="flex items-center gap-3 text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@dental-clinic.co.il</span>
              </a>
              <div className="flex items-center gap-3 text-sm opacity-80">
                <MapPin className="w-5 h-5 text-primary" />
                <span>רחוב הרצל 123, תל אביב</span>
              </div>
            </div>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6">שעות פעילות</h4>
            <div className="flex items-start gap-3 text-sm opacity-80 mb-6">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p>א׳-ה׳: 08:00-20:00</p>
                <p>ו׳: 08:00-14:00</p>
                <p>שבת: סגור</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold mb-4">עקבו אחרינו</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm opacity-60">
            © 2026 מרפאת שיניים. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
