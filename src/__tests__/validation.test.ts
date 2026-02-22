import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Mirror the schemas from the app
const appointmentSchema = z.object({
  client_name: z.string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(100, 'שם ארוך מדי')
    .regex(/^[\p{L}\s'-]+$/u, 'שם יכול להכיל רק אותיות ורווחים'),
  client_phone: z.string()
    .regex(/^0[0-9]{8,9}$/, 'מספר טלפון לא תקין'),
  client_email: z.string()
    .email('כתובת אימייל לא תקינה')
    .max(255, 'אימייל ארוך מדי')
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .max(500, 'ההערות ארוכות מדי')
    .optional(),
});

const contactSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  phone: z.string().regex(/^0[0-9]{8,9}$/, 'מספר טלפון לא תקין'),
  email: z.string().email('כתובת אימייל לא תקינה').optional().or(z.literal('')),
  message: z.string().max(1000, 'ההודעה ארוכה מדי').optional(),
});

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

describe('Appointment Form Validation', () => {
  it('accepts valid appointment data', () => {
    const result = appointmentSchema.safeParse({
      client_name: 'דוד כהן',
      client_phone: '0501234567',
      client_email: 'david@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = appointmentSchema.safeParse({
      client_name: '',
      client_phone: '0501234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name with numbers', () => {
    const result = appointmentSchema.safeParse({
      client_name: 'דוד123',
      client_phone: '0501234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone format', () => {
    const result = appointmentSchema.safeParse({
      client_name: 'דוד כהן',
      client_phone: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects phone not starting with 0', () => {
    const result = appointmentSchema.safeParse({
      client_name: 'דוד כהן',
      client_phone: '5501234567',
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty email', () => {
    const result = appointmentSchema.safeParse({
      client_name: 'דוד כהן',
      client_phone: '0501234567',
      client_email: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = appointmentSchema.safeParse({
      client_name: 'דוד כהן',
      client_phone: '0501234567',
      client_email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects notes over 500 chars', () => {
    const result = appointmentSchema.safeParse({
      client_name: 'דוד כהן',
      client_phone: '0501234567',
      notes: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('rejects name over 100 chars', () => {
    const result = appointmentSchema.safeParse({
      client_name: 'א'.repeat(101),
      client_phone: '0501234567',
    });
    expect(result.success).toBe(false);
  });

  // XSS / injection attempts
  it('rejects script injection in name', () => {
    const result = appointmentSchema.safeParse({
      client_name: '<script>alert("xss")</script>',
      client_phone: '0501234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects SQL injection in name', () => {
    const result = appointmentSchema.safeParse({
      client_name: "'; DROP TABLE appointments;--",
      client_phone: '0501234567',
    });
    expect(result.success).toBe(false);
  });
});

describe('Contact Form Validation', () => {
  it('accepts valid contact data', () => {
    const result = contactSchema.safeParse({
      name: 'שרה לוי',
      phone: '0521234567',
      email: 'sarah@example.com',
      message: 'שלום, אשמח לקבל מידע',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = contactSchema.safeParse({
      name: 'א',
      phone: '0521234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects message over 1000 chars', () => {
    const result = contactSchema.safeParse({
      name: 'שרה לוי',
      phone: '0521234567',
      message: 'a'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone', () => {
    const result = contactSchema.safeParse({
      name: 'שרה לוי',
      phone: 'abc',
    });
    expect(result.success).toBe(false);
  });
});

describe('Auth Form Validation', () => {
  it('accepts valid email', () => {
    expect(emailSchema.safeParse('user@example.com').success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(emailSchema.safeParse('not-email').success).toBe(false);
  });

  it('rejects empty email', () => {
    expect(emailSchema.safeParse('').success).toBe(false);
  });

  it('accepts valid password', () => {
    expect(passwordSchema.safeParse('123456').success).toBe(true);
  });

  it('rejects short password', () => {
    expect(passwordSchema.safeParse('123').success).toBe(false);
  });

  it('rejects empty password', () => {
    expect(passwordSchema.safeParse('').success).toBe(false);
  });
});
