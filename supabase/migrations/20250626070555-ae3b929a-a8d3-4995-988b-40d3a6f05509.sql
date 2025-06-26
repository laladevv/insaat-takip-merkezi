
-- Kullanıcı profilleri tablosu
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Personel',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Şantiyeler tablosu
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Aktif',
  progress INTEGER NOT NULL DEFAULT 0,
  manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Personel tablosu
CREATE TABLE public.personnel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  site_id UUID REFERENCES public.sites(id),
  status TEXT NOT NULL DEFAULT 'Aktif',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Malzemeler tablosu
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  site_id UUID REFERENCES public.sites(id),
  status TEXT NOT NULL DEFAULT 'Normal',
  critical_level INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bildirimler tablosu
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium',
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Günlük raporlar tablosu
CREATE TABLE public.daily_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID REFERENCES public.sites(id) NOT NULL,
  reporter_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weather TEXT,
  work_description TEXT NOT NULL,
  materials_used JSONB,
  personnel_count INTEGER NOT NULL DEFAULT 0,
  progress_notes TEXT,
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'Bekliyor',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Row Level Security (RLS) politikaları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi profillerini görebilir ve güncelleyebilir
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Herkese şantiyeleri görme izni (genel bilgi)
CREATE POLICY "Everyone can view sites" ON public.sites FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers can manage sites" ON public.sites FOR ALL TO authenticated USING (manager_id = auth.uid());

-- Personel bilgilerini herkes görebilir
CREATE POLICY "Everyone can view personnel" ON public.personnel FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert personnel" ON public.personnel FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update personnel" ON public.personnel FOR UPDATE TO authenticated USING (true);

-- Malzeme bilgilerini herkes görebilir ve güncelleyebilir
CREATE POLICY "Everyone can view materials" ON public.materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage materials" ON public.materials FOR ALL TO authenticated USING (true);

-- Kullanıcılar kendi bildirimlerini görebilir
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Raporları herkes görebilir, sadece rapor sahibi güncelleyebilir
CREATE POLICY "Everyone can view reports" ON public.daily_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert reports" ON public.daily_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can update own reports" ON public.daily_reports FOR UPDATE TO authenticated USING (auth.uid() = reporter_id);

-- Gerçek zamanlı güncellemeler için
ALTER TABLE public.sites REPLICA IDENTITY FULL;
ALTER TABLE public.personnel REPLICA IDENTITY FULL;
ALTER TABLE public.materials REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.daily_reports REPLICA IDENTITY FULL;

-- Realtime publikasyona tabloları ekle
ALTER PUBLICATION supabase_realtime ADD TABLE public.sites;
ALTER PUBLICATION supabase_realtime ADD TABLE public.personnel;
ALTER PUBLICATION supabase_realtime ADD TABLE public.materials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_reports;

-- Yeni kullanıcı kaydolduğunda profil oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'Personel'
  );
  RETURN new;
END;
$$;

-- Trigger oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Demo verileri ekle
INSERT INTO public.sites (name, location, status, progress) VALUES
('İstanbul Konut Projesi', 'Kadıköy, İstanbul', 'Aktif', 75),
('Ankara Plaza', 'Çankaya, Ankara', 'Aktif', 45),
('İzmir Rezidans', 'Bornova, İzmir', 'Planlama', 15);

INSERT INTO public.materials (name, quantity, unit, status, site_id) 
SELECT 'Çimento', 150, 'ton', 'Normal', id FROM public.sites WHERE name = 'İstanbul Konut Projesi' LIMIT 1;

INSERT INTO public.materials (name, quantity, unit, status, site_id, critical_level) 
SELECT 'Demir', 25, 'ton', 'Kritik', id, 50 FROM public.sites WHERE name = 'Ankara Plaza' LIMIT 1;

INSERT INTO public.materials (name, quantity, unit, status, site_id) 
SELECT 'Tuğla', 5000, 'adet', 'Normal', id FROM public.sites WHERE name = 'İzmir Rezidans' LIMIT 1;
