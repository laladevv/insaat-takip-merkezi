-- Add sample data for testing
INSERT INTO public.sites (name, location, status, progress, manager_id) VALUES
('İnşaat Sitesi A', 'İstanbul Başakşehir', 'Aktif', 45, NULL),
('İnşaat Sitesi B', 'İstanbul Esenyurt', 'Aktif', 75, NULL),
('İnşaat Sitesi C', 'İstanbul Beylikdüzü', 'Beklemede', 25, NULL),
('İnşaat Sitesi D', 'İstanbul Arnavutköy', 'Aktif', 90, NULL);

INSERT INTO public.personnel (name, role, site_id, phone, email, status) VALUES
('Ahmet Yılmaz', 'Mühendis', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), '+90 532 123 4567', 'ahmet@example.com', 'Aktif'),
('Mehmet Kaya', 'İşçi', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), '+90 532 234 5678', 'mehmet@example.com', 'Aktif'),
('Ayşe Demir', 'Tekniker', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), '+90 532 345 6789', 'ayse@example.com', 'Aktif'),
('Fatma Öz', 'İşçi', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), '+90 532 456 7890', 'fatma@example.com', 'İzinli'),
('Ali Çelik', 'Ustabaşı', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi C' LIMIT 1), '+90 532 567 8901', 'ali@example.com', 'Aktif');

INSERT INTO public.materials (name, quantity, unit, site_id, critical_level, status) VALUES
('Çimento', 150, 'Ton', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), 20, 'Normal'),
('Demir', 50, 'Ton', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), 10, 'Normal'),
('Kum', 5, 'M³', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), 15, 'Kritik'),
('Çimento', 200, 'Ton', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), 25, 'Normal'),
('Tuğla', 8000, 'Adet', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), 1000, 'Kritik'),
('Beton', 80, 'M³', (SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi C' LIMIT 1), 20, 'Normal');

INSERT INTO public.daily_reports (site_id, reporter_id, work_description, personnel_count, weather, status) VALUES
((SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), (SELECT id FROM public.users WHERE username = 'ozgur' LIMIT 1), 'Temel kazısı tamamlandı, beton dökümü başladı', 12, 'Güneşli', 'Tamamlandı'),
((SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi B' LIMIT 1), (SELECT id FROM public.users WHERE username = 'ozgur' LIMIT 1), 'İkinci kat duvarları örülmeye başlandı', 8, 'Parçalı bulutlu', 'Devam Ediyor'),
((SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi C' LIMIT 1), (SELECT id FROM public.users WHERE username = 'ozgur' LIMIT 1), 'Malzeme temini yapıldı, hazırlık çalışmaları devam ediyor', 6, 'Yağmurlu', 'Beklemede'),
((SELECT id FROM public.sites WHERE name = 'İnşaat Sitesi A' LIMIT 1), (SELECT id FROM public.users WHERE username = 'ozgur' LIMIT 1), 'Elektrik tesisatı çekilmeye başlandı', 10, 'Güneşli', 'Devam Ediyor');

INSERT INTO public.notifications (title, message, type, priority, source, user_id) VALUES
('Malzeme Kritik Seviyede', 'İnşaat Sitesi A''da kum miktarı kritik seviyeye düştü', 'warning', 'high', 'system', (SELECT id FROM public.users WHERE username = 'ozgur' LIMIT 1)),
('Yeni Rapor Eklendi', 'İnşaat Sitesi B için günlük rapor eklendi', 'info', 'medium', 'system', (SELECT id FROM public.users WHERE username = 'ozgur' LIMIT 1)),
('Malzeme Kritik Seviyede', 'İnşaat Sitesi B''de tuğla miktarı kritik seviyeye düştü', 'warning', 'high', 'system', (SELECT id FROM public.users WHERE username = 'ozgur' LIMIT 1)),
('Sistem Bakımı', 'Sistem bakımı 15:00-16:00 arası gerçekleştirilecek', 'info', 'low', 'admin', (SELECT id FROM public.users WHERE username = 'ozgur' LIMIT 1));