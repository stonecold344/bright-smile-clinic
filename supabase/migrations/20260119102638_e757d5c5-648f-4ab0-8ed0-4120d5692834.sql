-- Fix appointments table RLS policies
-- The current setup has conflicting RESTRICTIVE policies that may cause issues
-- Remove the "Deny anonymous read access" policy since the admin-only policy already properly restricts access

-- Drop the conflicting policy
DROP POLICY IF EXISTS "Deny anonymous read access" ON public.appointments;

-- The existing "Admins can view all appointments" policy is correct and sufficient
-- It uses has_role(auth.uid(), 'admin'::app_role) which:
-- 1. Returns false for unauthenticated users (auth.uid() is null)
-- 2. Returns false for authenticated non-admin users
-- 3. Returns true only for authenticated admin users

-- Verify the admin policy exists (if not, recreate it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointments' 
    AND policyname = 'Admins can view all appointments'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all appointments" ON public.appointments FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;