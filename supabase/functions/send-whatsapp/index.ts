import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, name, date, time }: WhatsAppRequest = await req.json();

    console.log(`Sending WhatsApp notification to ${phone}`);
    console.log(`Appointment for ${name} on ${date} at ${time}`);

    // Clean phone number - remove non-digits and add country code if needed
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '972' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('972')) {
      cleanPhone = '972' + cleanPhone;
    }

    // Create WhatsApp message
    const message = `שלום ${name}! 🦷

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
    
    // Option 1: Using WhatsApp Business API (requires setup)
    // const WHATSAPP_API_KEY = Deno.env.get('WHATSAPP_API_KEY');
    // const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');
    
    // if (WHATSAPP_API_KEY && WHATSAPP_PHONE_ID) {
    //   const response = await fetch(
    //     `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         messaging_product: 'whatsapp',
    //         to: cleanPhone,
    //         type: 'text',
    //         text: { body: message }
    //       }),
    //     }
    //   );
    //   
    //   if (!response.ok) {
    //     throw new Error(`WhatsApp API error: ${response.status}`);
    //   }
    // }

    // For now, log the message that would be sent
    console.log('WhatsApp message that would be sent:');
    console.log(`To: ${cleanPhone}`);
    console.log(`Message: ${message}`);

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
    console.error('Error sending WhatsApp notification:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
