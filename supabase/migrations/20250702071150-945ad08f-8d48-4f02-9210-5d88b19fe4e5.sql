-- Add sample data for testing (sites, personnel, materials only)
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