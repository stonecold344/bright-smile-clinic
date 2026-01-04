import { Link } from "react-router-dom";
import { ArrowLeft, Award, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import teamImage from "@/assets/dental-team.jpg";

const stats = [
  { icon: Users, value: "5,000+", label: "מטופלים מרוצים" },
  { icon: Award, value: "15+", label: "שנות ניסיון" },
  { icon: Clock, value: "24/7", label: "זמינות לחירום" },
];

const AboutPreview = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={teamImage}
                alt="צוות מרפאת השיניים"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-card rounded-2xl p-6 shadow-elevated animate-float">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-hero rounded-full flex items-center justify-center text-2xl">
                  ⭐
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4.9/5</p>
                  <p className="text-sm text-muted-foreground">דירוג גוגל</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              אודותינו
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              מרפאת שיניים מובילה
              <br />
              <span className="text-primary">עם צוות מומחים</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              אנו מרפאת שיניים מתקדמת המספקת טיפולי שיניים איכותיים לכל המשפחה.
              הצוות המקצועי שלנו מחויב לספק לכם את הטיפול הטוב ביותר בסביבה נעימה ומרגיעה.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              אנו משתמשים בטכנולוגיות המתקדמות ביותר ובציוד חדיש כדי להבטיח
              תוצאות מעולות ונוחות מקסימלית למטופלים שלנו.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link to="/about">
              <Button variant="heroPrimary" size="lg" className="gap-2">
                קראו עוד
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
