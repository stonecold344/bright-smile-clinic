import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Award, Users, Clock, Heart, Shield, Target } from "lucide-react";
import teamImage from "@/assets/dental-team.jpg";
import heroImage from "@/assets/hero-dental.jpg";

const values = [
  {
    icon: Heart,
    title: "אכפתיות",
    description: "אנו מתייחסים לכל מטופל כאל משפחה ומספקים טיפול אישי ואכפתי.",
  },
  {
    icon: Shield,
    title: "מקצועיות",
    description: "צוות מומחים עם הכשרה מתקדמת וניסיון רב בתחום רפואת השיניים.",
  },
  {
    icon: Target,
    title: "חדשנות",
    description: "שימוש בטכנולוגיות המתקדמות ביותר לתוצאות מעולות.",
  },
];

const stats = [
  { icon: Users, value: "5,000+", label: "מטופלים מרוצים" },
  { icon: Award, value: "15+", label: "שנות ניסיון" },
  { icon: Clock, value: "24/7", label: "זמינות לחירום" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="מרפאת שיניים"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                אודותינו
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                מכירים את הצוות שלנו
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                מרפאת שיניים מובילה עם צוות מומחים מסור המחויב לספק לכם את הטיפול הטוב ביותר
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-elevated">
                  <img
                    src={teamImage}
                    alt="צוות מרפאת השיניים"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  הסיפור שלנו
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  מרפאת השיניים שלנו נוסדה מתוך חזון לספק טיפולי שיניים איכותיים בסביבה נעימה ומרגיעה.
                  אנו מאמינים שכל אדם מגיע לחיוך בריא ויפה.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  הצוות המקצועי שלנו כולל רופאי שיניים מומחים, היגייניסטיות מוסמכות וצוות קבלה אדיב.
                  אנו משתמשים בטכנולוגיות המתקדמות ביותר ובחומרים האיכותיים ביותר כדי להבטיח תוצאות מעולות.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-card rounded-xl shadow-soft">
                      <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                הערכים שלנו
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                מה מנחה אותנו
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-8 bg-card rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
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

export default About;
