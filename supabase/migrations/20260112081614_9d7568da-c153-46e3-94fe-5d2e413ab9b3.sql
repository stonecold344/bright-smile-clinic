-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can view appointments" ON public.appointments;

-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for role-based access
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy: Anyone can view only date/time for availability checking (no PII)
CREATE POLICY "Public can check availability"
ON public.appointments
FOR SELECT
USING (true);

-- Note: The SELECT policy above allows viewing all columns, but we'll handle PII protection
-- through a view or by modifying the client to only request needed columns.
-- For proper PII protection, we need authenticated users for full access.

-- Create a more restrictive policy - only allow unauthenticated to see non-PII
-- Since Supabase doesn't support column-level RLS, we'll use authenticated access for full data

-- Drop the permissive policy and create proper ones
DROP POLICY IF EXISTS "Public can check availability" ON public.appointments;

-- Policy: Public can only view appointment slots (date/time) - enforced via security definer function
CREATE OR REPLACE FUNCTION public.get_booked_slots(check_date date DEFAULT NULL)
RETURNS TABLE(appointment_date date, appointment_time time)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.appointment_date, a.appointment_time
  FROM public.appointments a
  WHERE (check_date IS NULL OR a.appointment_date >= check_date)
    AND a.status != 'cancelled';
$$;

-- Policy: Authenticated admins can view all appointment details
CREATE POLICY "Admins can view all appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Rate limiting function for appointment creation
CREATE OR REPLACE FUNCTION public.check_appointment_rate_limit(phone_number text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT COUNT(*)
    FROM public.appointments
    WHERE client_phone = phone_number
      AND created_at > now() - interval '1 hour'
  ) < 3;
$$;

-- Policy: Allow creating appointments with rate limiting
CREATE POLICY "Anyone can create appointments with rate limit"
ON public.appointments
FOR INSERT
WITH CHECK (public.check_appointment_rate_limit(client_phone));

-- Policy: Only admins can update appointments
CREATE POLICY "Admins can update appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can delete appointments
CREATE POLICY "Admins can delete appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));