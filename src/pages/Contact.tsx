import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם.");
      setFormData({ name: "", phone: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "טלפון",
      value: "00-000-0000",
      link: "tel:+972-00-000-0000",
    },
    {
      icon: Mail,
      title: "אימייל",
      value: "info@dental-clinic.co.il",
      link: "mailto:info@dental-clinic.co.il",
    },
    {
      icon: MapPin,
      title: "כתובת",
      value: "רחוב הרצל 123, תל אביב",
      link: "#",
    },
    {
      icon: Clock,
      title: "שעות פעילות",
      value: "א׳-ה׳: 08:00-20:00",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                צור קשר
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                נשמח לשמוע ממכם
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                השאירו פרטים ונחזור אליכם בהקדם, או התקשרו אלינו ישירות
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  השאירו פרטים
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      שם מלא *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="הכניסו את שמכם"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      טלפון *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="050-000-0000"
                      className="h-12"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      אימייל
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="h-12"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      הודעה
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="ספרו לנו במה נוכל לעזור..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="heroPrimary"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "שולח..." : "שליחת הודעה"}
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  פרטי התקשרות
                </h2>
                
                <div className="space-y-6 mb-12">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Quick Call CTA */}
                <div className="bg-gradient-hero rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                    מעדיפים לדבר?
                  </h3>
                  <p className="text-primary-foreground/90 mb-6">
                    התקשרו אלינו עכשיו ונקבע תור שמתאים לכם
                  </p>
                  <a href="tel:+972-00-000-0000">
                    <Button variant="hero" size="xl" className="gap-2">
                      <Phone className="w-5 h-5" />
                      00-000-0000
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="h-96 bg-muted flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              רחוב הרצל 123, תל אביב
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              (כאן תוכלו להוסיף מפת גוגל)
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
