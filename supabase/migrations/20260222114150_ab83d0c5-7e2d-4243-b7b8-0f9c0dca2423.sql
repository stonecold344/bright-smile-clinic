
-- Drop the restrictive "Users can view their own roles" policy and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Also make the admin policy permissive for SELECT separately
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

-- Recreate admin ALL policy as permissive
CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
