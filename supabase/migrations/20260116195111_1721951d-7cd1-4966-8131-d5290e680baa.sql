-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public read for visible testimonials
CREATE POLICY "Visible testimonials are publicly readable"
ON public.testimonials
FOR SELECT
USING (is_visible = true);

-- Admins can manage all testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample testimonials
INSERT INTO public.testimonials (name, title, content, rating, is_visible) VALUES
('שרה כהן', 'עורכת דין', 'הצוות המקצועי והאדיב הפך את החוויה לנעימה במיוחד. ממליצה בחום לכל מי שמחפש מרפאת שיניים איכותית.', 5, true),
('דוד לוי', 'מהנדס תוכנה', 'טיפול מקצועי ויחס אישי מעולה. המרפאה הכי טובה שהייתי בה. תודה רבה על השירות המצוין!', 5, true),
('מיכל ישראלי', 'מורה', 'אחרי שנים של פחד מרופא שיניים, סוף סוף מצאתי מקום שבו אני מרגישה בנוח. הצוות מדהים!', 5, true),
('יוסי אברהם', 'איש עסקים', 'הלבנת שיניים מקצועית עם תוצאות מדהימות. מאוד מרוצה מהשירות והמחיר.', 4, true);