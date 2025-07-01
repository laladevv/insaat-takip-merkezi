-- Add sample data for testing (without foreign key constraint issues)
INSERT INTO public.sites (name, location, status, progress, manager_id) VALUES
('İnşaat Sitesi A', 'İstanbul Başakşehir', 'Aktif', 45, NULL),
('İnşaat Sitesi B', 'İstanbul Esenyurt', 'Aktif', 75, NULL),
('İnşaat Sitesi C', 'İstanbul Beylikdüzü', 'Beklemede', 25, NULL),
('İnşaat Sitesi D', 'İstanbul Arnavutköy', 'Aktif', 90, NULL)
ON CONFLICT DO NOTHING;

INSERT INTO public.personnel (name, role, site_id, phone, email, status) VALUES
('Ahmet Yılmaz', 'Mühendis', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), '+90 532 123 4567', 'ahmet@example.com', 'Aktif'),
('Mehmet Kaya', 'İşçi', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), '+90 532 234 5678', 'mehmet@example.com', 'Aktif'),
('Ayşe Demir', 'Tekniker', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), '+90 532 345 6789', 'ayse@example.com', 'Aktif'),
('Fatma Öz', 'İşçi', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), '+90 532 456 7890', 'fatma@example.com', 'İzinli'),
('Ali Çelik', 'Ustabaşı', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi C' LIMIT 1), '+90 532 567 8901', 'ali@example.com', 'Aktif')
ON CONFLICT DO NOTHING;

INSERT INTO public.materials (name, quantity, unit, site_id, critical_level, status) VALUES
('Çimento', 150, 'Ton', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), 20, 'Normal'),
('Demir', 50, 'Ton', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), 10, 'Normal'),
('Kum', 5, 'M³', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), 15, 'Kritik'),
('Çimento', 200, 'Ton', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), 25, 'Normal'),
('Tuğla', 8000, 'Adet', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), 1000, 'Kritik'),
('Beton', 80, 'M³', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi C' LIMIT 1), 20, 'Normal')
ON CONFLICT DO NOTHING;

-- Get the ozgur user ID for reports
DO $$
DECLARE
    ozgur_user_id UUID;
BEGIN
    SELECT id INTO ozgur_user_id FROM public.users WHERE username = 'ozgur' LIMIT 1;
    
    IF ozgur_user_id IS NOT NULL THEN
        INSERT INTO public.daily_reports (site_id, reporter_id, work_description, personnel_count, weather, status) VALUES
        ((SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), ozgur_user_id, 'Temel kazısı tamamlandı, beton dökümü başladı', 12, 'Güneşli', 'Tamamlandı'),
        ((SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), ozgur_user_id, 'İkinci kat duvarları örülmeye başlandı', 8, 'Parçalı bulutlu', 'Devam Ediyor'),
        ((SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi C' LIMIT 1), ozgur_user_id, 'Malzeme temini yapıldı, hazırlık çalışmaları devam ediyor', 6, 'Yağmurlu', 'Beklemede'),
        ((SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), ozgur_user_id, 'Elektrik tesisatı çekilmeye başlandı', 10, 'Güneşli', 'Devam Ediyor')
        ON CONFLICT DO NOTHING;
        
        INSERT INTO public.notifications (title, message, type, priority, source, user_id) VALUES
        ('Malzeme Kritik Seviyede', 'İnşaat Sitesi A''da kum miktarı kritik seviyeye düştü', 'warning', 'high', 'system', ozgur_user_id),
        ('Yeni Rapor Eklendi', 'İnşaat Sitesi B için günlük rapor eklendi', 'info', 'medium', 'system', ozgur_user_id),
        ('Malzeme Kritik Seviyede', 'İnşaat Sitesi B''de tuğla miktarı kritik seviyeye düştü', 'warning', 'high', 'system', ozgur_user_id),
        ('Sistem Bakımı', 'Sistem bakımı 15:00-16:00 arası gerçekleştirilecek', 'info', 'low', 'admin', ozgur_user_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;