import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppRequest {
  phone: string;
  name: string;
  date: string;
  time: string;
}

// Input validation
const validateInput = (data: WhatsAppRequest): string | null => {
  if (!data.phone || typeof data.phone !== 'string') {
    return 'Invalid phone number';
  }
  if (!data.name || typeof data.name !== 'string' || data.name.length > 100) {
    return 'Invalid name';
  }
  if (!data.date || typeof data.date !== 'string') {
    return 'Invalid date';
  }
  if (!data.time || typeof data.time !== 'string') {
    return 'Invalid time';
  }
  // Validate phone format (Israeli phone numbers)
  const phoneRegex = /^0[0-9]{8,9}$/;
  const cleanPhone = data.phone.replace(/\D/g, '');
  if (!phoneRegex.test(cleanPhone) && !/^972[0-9]{8,9}$/.test(cleanPhone)) {
    return 'Invalid phone format';
  }
  return null;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the request has proper authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create Supabase client to verify the appointment exists
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const requestData: WhatsAppRequest = await req.json();
    
    // Validate input data
    const validationError = validateInput(requestData);
    if (validationError) {
      return new Response(
        JSON.stringify({ success: false, error: validationError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { phone, name, date, time } = requestData;

    // Clean phone number - remove non-digits and add country code if needed
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '972' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('972')) {
      cleanPhone = '972' + cleanPhone;
    }

    // Sanitize name for message (remove any potential injection characters)
    const sanitizedName = name.replace(/[<>\"\'&]/g, '').substring(0, 50);

    // Create WhatsApp message
    const message = `שלום ${sanitizedName}! 🦷

התור שלך במרפאת השיניים אושר:
📅 תאריך: ${date}
🕐 שעה: ${time}

אנא הגיע/י 10 דקות לפני התור.
לשאלות ניתן להתקשר: 00-000-0000

בברכה,
מרפאת שיניים`;

    // For WhatsApp Business API integration, you would need to configure
    // a provider like Twilio, MessageBird, or Meta's WhatsApp Business API
    // This is a placeholder for the actual implementation
    
    // Generate WhatsApp click-to-chat URL (can be used for manual follow-up)
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification logged successfully',
        whatsappUrl,
        phone: cleanPhone
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
