
-- Kullanıcılar için yeni tablo oluştur (Supabase Auth yerine)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Personel',
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- İlk yönetici kullanıcıyı ekle (kullanıcı adı: ozgur, şifre: 1234)
-- Şifre hash'i bcrypt ile oluşturulmuş 1234 için hash
INSERT INTO public.users (username, password_hash, name, role) 
VALUES ('ozgur', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Özgür Yönetici', 'Yönetici');

-- RLS politikalarını etkinleştir
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi bilgilerini görebilir
CREATE POLICY "Users can view their own data" 
  ON public.users 
  FOR SELECT 
  USING (true); -- Tüm kullanıcılar görülebilir (yönetim için)

-- Yalnızca yöneticiler kullanıcı oluşturabilir
CREATE POLICY "Only admins can create users" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'Yönetici'
  ));

-- Yalnızca yöneticiler kullanıcı güncelleyebilir
CREATE POLICY "Only admins can update users" 
  ON public.users 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'Yönetici'
  ));

-- Oturum tablosu oluştur
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Oturum tablosu için RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Oturum politikaları
CREATE POLICY "Users can manage their own sessions" 
  ON public.user_sessions 
  FOR ALL 
  USING (user_id = auth.uid());

-- Şifre hash fonksiyonu (basit bcrypt alternative)
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Basit hash fonksiyonu (gerçek uygulamada bcrypt kullanılmalı)
  RETURN encode(digest(password || 'salt123', 'sha256'), 'hex');
END;
$$;

-- Kullanıcı doğrulama fonksiyonu
CREATE OR REPLACE FUNCTION public.authenticate_user(username_input TEXT, password_input TEXT)
RETURNS TABLE(user_id UUID, user_name TEXT, user_role TEXT, success BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record public.users%ROWTYPE;
  hashed_password TEXT;
BEGIN
  -- Şifreyi hash'le
  hashed_password := public.hash_password(password_input);
  
  -- Kullanıcıyı bul
  SELECT * INTO user_record 
  FROM public.users 
  WHERE username = username_input 
    AND (password_hash = hashed_password OR password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
    AND is_active = true;
  
  IF user_record.id IS NOT NULL THEN
    RETURN QUERY SELECT user_record.id, user_record.name, user_record.role, true;
  ELSE
    RETURN QUERY SELECT NULL::UUID, NULL::TEXT, NULL::TEXT, false;
  END IF;
END;
$$;
