-- Update RLS policies for role-based user creation
DROP POLICY IF EXISTS "Only admins can create users" ON public.users;
DROP POLICY IF EXISTS "Only admins can update users" ON public.users;

-- Create a function to check if user can create specific role
CREATE OR REPLACE FUNCTION public.can_create_role(creator_role TEXT, target_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Yönetici can create any role
  IF creator_role = 'Yönetici' THEN
    RETURN target_role IN ('Yönetici', 'Müdür', 'Şantiye Şefi', 'Personel');
  -- Müdür can create Şantiye Şefi and Personel
  ELSIF creator_role = 'Müdür' THEN
    RETURN target_role IN ('Şantiye Şefi', 'Personel');
  -- Şantiye Şefi can create only Personel
  ELSIF creator_role = 'Şantiye Şefi' THEN
    RETURN target_role = 'Personel';
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.users 
  WHERE id = auth.uid();
  
  RETURN user_role;
END;
$$;

-- New policy for role-based user creation
CREATE POLICY "Role-based user creation" 
  ON public.users 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    public.can_create_role(
      public.get_current_user_role(),
      role
    )
  );

-- New policy for role-based user updates
CREATE POLICY "Role-based user updates" 
  ON public.users 
  FOR UPDATE 
  TO authenticated
  USING (
    public.can_create_role(
      public.get_current_user_role(),
      role
    )
  );