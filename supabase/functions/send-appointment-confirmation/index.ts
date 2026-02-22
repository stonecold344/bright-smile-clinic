import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AppointmentConfirmationRequest {
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
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
const validateInput = (data: AppointmentConfirmationRequest): string | null => {
  if (!data.clientName || typeof data.clientName !== "string" || data.clientName.trim().length === 0) {
    return "שם הוא שדה חובה";
  }
  if (data.clientName.length > 100) {
    return "שם ארוך מדי";
  }
  if (!data.clientPhone || typeof data.clientPhone !== "string") {
    return "טלפון הוא שדה חובה";
  }
  const phoneRegex = /^0[0-9]{8,9}$/;
  const cleanPhone = data.clientPhone.replace(/\D/g, "");
  if (!phoneRegex.test(cleanPhone) && !/^972[0-9]{8,9}$/.test(cleanPhone)) {
    return "פורמט טלפון לא תקין";
  }
  if (!data.appointmentDate || typeof data.appointmentDate !== "string") {
    return "תאריך הוא שדה חובה";
  }
  if (!data.appointmentTime || typeof data.appointmentTime !== "string") {
    return "שעה היא שדה חובה";
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
    const requestData: AppointmentConfirmationRequest = await req.json();

    const validationError = validateInput(requestData);
    if (validationError) {
      console.log("Input validation failed:", validationError);
      return new Response(JSON.stringify({ success: false, error: validationError }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { clientName, clientPhone, appointmentDate, appointmentTime } = requestData;

    const sanitizedName = clientName.replace(/[<>\"\'&]/g, "").substring(0, 100).trim();
    
    let whatsappPhone = clientPhone.replace(/\D/g, "");
    if (whatsappPhone.startsWith("0")) {
      whatsappPhone = "972" + whatsappPhone.slice(1);
    }

    let displayPhone = clientPhone.replace(/\D/g, "");
    if (displayPhone.startsWith("972")) {
      displayPhone = "0" + displayPhone.slice(3);
    }

    const customerMessage = `שלום ${sanitizedName}! 👋

התור שלך אושר בהצלחה ✅

📅 תאריך: ${appointmentDate}
🕐 שעה: ${appointmentTime}

נשמח לראות אותך! 🦷
במידה ותרצה לבטל או לשנות את התור, אנא צור קשר.`;

    const encodedMessage = encodeURIComponent(customerMessage);
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;

    console.log("Appointment confirmation prepared for:", sanitizedName, "date:", appointmentDate, "time:", appointmentTime);

    return new Response(
      JSON.stringify({ success: true, message: "הודעת אישור הוכנה בהצלחה", whatsappUrl }),
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
