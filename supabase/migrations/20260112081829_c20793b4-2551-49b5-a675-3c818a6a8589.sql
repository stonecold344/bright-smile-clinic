-- Fix: Deny anonymous/public read access to appointments table
-- The existing admin policy only allows authenticated admins, but we need to explicitly block anonymous
CREATE POLICY "Deny anonymous read access"
ON public.appointments
FOR SELECT
TO anon
USING (false);