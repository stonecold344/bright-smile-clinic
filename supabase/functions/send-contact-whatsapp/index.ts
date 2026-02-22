import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactFormRequest {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count++;
  return true;
}

// Input validation
const validateInput = (data: ContactFormRequest): string | null => {
  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    return "שם הוא שדה חובה";
  }
  if (data.name.length > 100) {
    return "שם ארוך מדי";
  }
  if (!data.phone || typeof data.phone !== "string") {
    return "טלפון הוא שדה חובה";
  }
  const phoneRegex = /^0[0-9]{8,9}$/;
  const cleanPhone = data.phone.replace(/\D/g, "");
  if (!phoneRegex.test(cleanPhone) && !/^972[0-9]{8,9}$/.test(cleanPhone)) {
    return "פורמט טלפון לא תקין";
  }
  if (data.email && data.email.length > 255) {
    return "אימייל ארוך מדי";
  }
  if (data.message && data.message.length > 1000) {
    return "הודעה ארוכה מדי";
  }
  return null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ success: false, error: "יותר מדי בקשות, נסו שוב בעוד דקה" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
    );
  }

  try {
    const requestData: ContactFormRequest = await req.json();

    const validationError = validateInput(requestData);
    if (validationError) {
      console.log("Input validation failed:", validationError);
      return new Response(JSON.stringify({ success: false, error: validationError }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { name, phone, email, message } = requestData;

    const sanitizedName = name.replace(/[<>\"\'&]/g, "").substring(0, 100).trim();
    const sanitizedMessage = message?.replace(/[<>\"\'&]/g, "").substring(0, 1000).trim() || "";
    const sanitizedEmail = email?.replace(/[<>\"\'&]/g, "").substring(0, 255).trim() || "";
    
    let displayPhone = phone.replace(/\D/g, "");
    if (displayPhone.startsWith("972")) {
      displayPhone = "0" + displayPhone.slice(3);
    }

    const clinicPhone = "972507334482";
    
    let whatsappMessage = `📩 פנייה חדשה מהאתר!

👤 שם: ${sanitizedName}
📱 טלפון: ${displayPhone}`;

    if (sanitizedEmail) {
      whatsappMessage += `\n📧 אימייל: ${sanitizedEmail}`;
    }

    if (sanitizedMessage) {
      whatsappMessage += `\n\n💬 הודעה:\n${sanitizedMessage}`;
    }

    whatsappMessage += `\n\n---\nנשלח דרך טופס יצירת קשר באתר`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${clinicPhone}?text=${encodedMessage}`;

    console.log("Contact form submission prepared for:", sanitizedName, "phone:", displayPhone);

    return new Response(
      JSON.stringify({ success: true, message: "הפנייה נשלחה בהצלחה", whatsappUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "אירעה שגיאה, נסו שוב" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
