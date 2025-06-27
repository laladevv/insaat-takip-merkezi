
-- RLS politikalarını düzelt
DROP POLICY IF EXISTS "Only admins can create users" ON public.users;
DROP POLICY IF EXISTS "Only admins can update users" ON public.users;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.user_sessions;

-- Tüm kullanıcılar tablosunu herkes okuyabilir (uygulama seviyesinde kontrol)
CREATE POLICY "Allow read access to users" 
  ON public.users 
  FOR SELECT 
  USING (true);

-- Sadece authenticated kullanıcılar ekleme yapabilir
CREATE POLICY "Allow authenticated insert to users" 
  ON public.users 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Sadece authenticated kullanıcılar güncelleme yapabilir
CREATE POLICY "Allow authenticated update to users" 
  ON public.users 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Oturum tablosu politikaları
CREATE POLICY "Allow authenticated access to sessions" 
  ON public.user_sessions 
  FOR ALL 
  TO authenticated
  USING (true);

-- Diğer tablolar için de RLS politikaları ekle
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access to sites" 
  ON public.sites 
  FOR ALL 
  TO authenticated
  USING (true);

ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access to personnel" 
  ON public.personnel 
  FOR ALL 
  TO authenticated
  USING (true);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access to materials" 
  ON public.materials 
  FOR ALL 
  TO authenticated
  USING (true);

ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access to daily_reports" 
  ON public.daily_reports 
  FOR ALL 
  TO authenticated
  USING (true);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access to notifications" 
  ON public.notifications 
  FOR ALL 
  TO authenticated
  USING (true);
