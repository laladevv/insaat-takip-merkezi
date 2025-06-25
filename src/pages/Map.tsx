
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { 
  MapPin, 
  Building2, 
  Users,
  Calendar,
  Navigation,
  Eye
} from "lucide-react";

interface User {
  email: string;
  role: string;
  name: string;
}

interface SiteLocation {
  id: number;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: string;
  workers: number;
  manager: string;
  progress: number;
}

const Map = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteLocation | null>(null);
  const navigate = useNavigate();

  const sites: SiteLocation[] = [
    {
      id: 1,
      name: "İstanbul Konut Projesi",
      address: "Fenerbahçe Mah. Bağdat Cad. No:123 Kadıköy/İSTANBUL",
      coordinates: { lat: 40.9831, lng: 29.0350 },
      status: "Aktif",
      workers: 45,
      manager: "Mehmet Çelik",
      progress: 75
    },
    {
      id: 2,
      name: "Ankara Plaza",
      address: "Kızılay Mah. Atatürk Bulvarı No:456 Çankaya/ANKARA",
      coordinates: { lat: 39.9208, lng: 32.8541 },
      status: "Aktif",
      workers: 32,
      manager: "Ayşe Demir",
      progress: 45
    },
    {
      id: 3,
      name: "İzmir Rezidans",
      address: "Ege Üniversitesi Mah. 123. Sok. No:789 Bornova/İZMİR",
      coordinates: { lat: 38.4618, lng: 27.2178 },
      status: "Planlama",
      workers: 28,
      manager: "Ali Yılmaz",
      progress: 15
    }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-red-50 to-blue-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Harita Görünümü</h1>
                <p className="text-gray-600">Şantiyelerin konum bilgilerini görüntüleyin</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Placeholder */}
            <div className="lg:col-span-2">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Şantiye Konumları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Harita Entegrasyonu</h3>
                      <p className="text-gray-600 mb-4">
                        Google Maps veya OpenStreetMap entegrasyonu ile şantiye konumları burada görüntülenecek
                      </p>
                      <Button className="bg-red-500 hover:bg-red-600">
                        <Navigation className="h-4 w-4 mr-2" />
                        Harita Aç
                      </Button>
                    </div>
                    
                    {/* Simulated Map Markers */}
                    <div className="absolute top-20 left-20">
                      <div 
                        className="bg-red-500 text-white p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                        onClick={() => setSelectedSite(sites[0])}
                      >
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="absolute top-32 right-24">
                      <div 
                        className="bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                        onClick={() => setSelectedSite(sites[1])}
                      >
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-20 left-1/3">
                      <div 
                        className="bg-yellow-500 text-white p-2 rounded-full cursor-pointer hover:bg-yellow-600 transition-colors"
                        onClick={() => setSelectedSite(sites[2])}
                      >
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Site Info Panel */}
            <div className="space-y-6">
              {selectedSite ? (
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-600">{selectedSite.name}</CardTitle>
                    <CardDescription>Şantiye Detayları</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Badge variant={selectedSite.status === "Aktif" ? "default" : "secondary"}>
                        {selectedSite.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                        <span className="text-muted-foreground">{selectedSite.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-muted-foreground">{selectedSite.workers} İşçi</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-red-500" />
                        <span className="text-muted-foreground">Şef: {selectedSite.manager}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>İlerleme</span>
                        <span>%{selectedSite.progress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${selectedSite.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Detay
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Navigation className="h-4 w-4 mr-1" />
                        Yol Tarifi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-gray-200">
                  <CardContent className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Şantiye Seçin</h3>
                    <p className="text-gray-500">Harita üzerindeki işaretlere tıklayarak şantiye detaylarını görüntüleyin</p>
                  </CardContent>
                </Card>
              )}

              {/* Sites List */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Şantiye Listesi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sites.map((site) => (
                    <div 
                      key={site.id} 
                      className={`p-3 rounded border cursor-pointer transition-colors ${
                        selectedSite?.id === site.id 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                      }`}
                      onClick={() => setSelectedSite(site)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{site.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{site.address}</p>
                        </div>
                        <Badge 
                          variant={site.status === "Aktif" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {site.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">Özet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Toplam Şantiye:</span>
                    <span className="text-sm font-medium">{sites.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Aktif Şantiye:</span>
                    <span className="text-sm font-medium text-green-600">
                      {sites.filter(s => s.status === "Aktif").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Toplam İşçi:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {sites.reduce((total, site) => total + site.workers, 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Map;
