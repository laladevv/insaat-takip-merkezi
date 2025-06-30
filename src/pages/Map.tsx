
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MapPin, 
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Navigation,
  Zap,
  Shield,
  Camera,
  Clock,
  Phone
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface Site {
  id: number;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: "Aktif" | "Pasif" | "Bakım";
  manager: string;
  workers: number;
  security: boolean;
  cameras: number;
  lastUpdate: string;
  emergencyContact: string;
}

const Map = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  
  const [sites, setSites] = useState<Site[]>([
    {
      id: 1,
      name: "İstanbul Konut Projesi",
      location: "Kadıköy, İstanbul",
      coordinates: { lat: 40.9917, lng: 29.0254 },
      status: "Aktif",
      manager: "Mehmet Çelik",
      workers: 45,
      security: true,
      cameras: 8,
      lastUpdate: "2024-06-25T14:30:00",
      emergencyContact: "+90 532 123 4567"
    },
    {
      id: 2,
      name: "Ankara Plaza",
      location: "Çankaya, Ankara",
      coordinates: { lat: 39.9208, lng: 32.8541 },
      status: "Aktif",
      manager: "Ayşe Demir",
      workers: 32,
      security: true,
      cameras: 12,
      lastUpdate: "2024-06-25T15:45:00",
      emergencyContact: "+90 533 987 6543"
    },
    {
      id: 3,
      name: "İzmir Rezidans",
      location: "Bornova, İzmir",
      coordinates: { lat: 38.4237, lng: 27.1428 },
      status: "Bakım",
      manager: "Ali Yılmaz",
      workers: 18,
      security: false,
      cameras: 4,
      lastUpdate: "2024-06-24T09:15:00",
      emergencyContact: "+90 534 555 1234"
    }
  ]);

  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const filteredSites = sites.filter(site => {
    const matchesStatus = filterStatus === "all" || site.status === filterStatus;
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSiteClick = (site: Site) => {
    setSelectedSite(site);
    setIsDetailsOpen(true);
    toast({
      title: "Şantiye Seçildi",
      description: `${site.name} harita üzerinde gösteriliyor`,
    });
  };

  const handleEmergencyCall = (contact: string) => {
    window.open(`tel:${contact}`, '_self');
    toast({
      title: "Acil Arama",
      description: `${contact} aranıyor...`,
    });
  };

  const handleNavigateToSite = (site: Site) => {
    const url = `https://maps.google.com/?q=${site.coordinates.lat},${site.coordinates.lng}`;
    window.open(url, '_blank');
    toast({
      title: "Navigasyon",
      description: `${site.name} konumuna yönlendiriliyor`,
    });
  };

  const handleSecurityAlert = (site: Site) => {
    toast({
      variant: "destructive",
      title: "Güvenlik Uyarısı",
      description: `${site.name} için güvenlik uyarısı gönderildi!`,
    });
  };

  const handleCameraView = (site: Site) => {
    toast({
      title: "Kamera Görüntüleri",
      description: `${site.name} - ${site.cameras} kamera görüntüsü açılıyor`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif": return "bg-green-500";
      case "Pasif": return "bg-gray-500";
      case "Bakım": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Aktif": return "text-green-600";
      case "Pasif": return "text-gray-600";
      case "Bakım": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
                <h1 className="text-2xl font-bold text-gray-900">Garita Görünümü</h1>
                <p className="text-gray-600">Şantiyelerin harita görünümü ve güvenlik takibi</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Şantiye Konumları
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>
                    
                    {/* Site Markers */}
                    {filteredSites.map((site, index) => (
                      <div
                        key={site.id}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${30 + index * 25}%`,
                          top: `${40 + index * 15}%`
                        }}
                        onClick={() => handleSiteClick(site)}
                      >
                        <div className="relative">
                          <div className={`w-4 h-4 rounded-full ${getStatusColor(site.status)} border-2 border-white shadow-lg animate-pulse`}></div>
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium">
                              {site.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 space-y-2">
                      <Button size="sm" variant="outline" className="bg-white">
                        <Navigation className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white">
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                      <h4 className="font-medium text-sm mb-2">Durum</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Aktif</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Bakım</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span>Pasif</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Filters */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">Filtreler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Şantiye Ara</Label>
                    <Input
                      id="search"
                      placeholder="İsim veya konum..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="statusFilter">Durum</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Pasif">Pasif</SelectItem>
                        <SelectItem value="Bakım">Bakım</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Sites List */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Şantiyeler</CardTitle>
                  <CardDescription>
                    {filteredSites.length} şantiye görüntüleniyor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredSites.map((site) => (
                    <div 
                      key={site.id} 
                      className="p-4 border rounded-lg bg-white cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleSiteClick(site)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{site.name}</h3>
                        <Badge variant={site.status === "Aktif" ? "default" : 
                                      site.status === "Bakım" ? "secondary" : "outline"}>
                          {site.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{site.location}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {site.workers} işçi
                        </span>
                        <span className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          {site.cameras} kamera
                        </span>
                        <span className="flex items-center gap-1">
                          {site.security ? (
                            <Shield className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Site Details Dialog */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedSite?.name}
                </DialogTitle>
                <DialogDescription>
                  Şantiye detayları ve güvenlik bilgileri
                </DialogDescription>
              </DialogHeader>
              
              {selectedSite && (
                <div className="space-y-6">
                  {/* Status and Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Durum</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedSite.status)}`}></div>
                        <span className={`font-medium ${getStatusTextColor(selectedSite.status)}`}>
                          {selectedSite.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>Konum</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedSite.location}</p>
                    </div>
                  </div>

                  {/* Manager and Workers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Şantiye Şefi</Label>
                      <p className="font-medium mt-1">{selectedSite.manager}</p>
                    </div>
                    <div>
                      <Label>İşçi Sayısı</Label>
                      <p className="font-medium mt-1">{selectedSite.workers} kişi</p>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Güvenlik</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedSite.security ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Aktif</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Pasif</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Kamera Sayısı</Label>
                      <p className="font-medium mt-1">{selectedSite.cameras} kamera</p>
                    </div>
                  </div>

                  {/* Last Update */}
                  <div>
                    <Label>Son Güncelleme</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(selectedSite.lastUpdate).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <Label>Acil Durum İletişim</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedSite.emergencyContact}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button 
                      size="sm" 
                      onClick={() => handleNavigateToSite(selectedSite)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigasyon
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEmergencyCall(selectedSite.emergencyContact)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Acil Ara
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCameraView(selectedSite)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Kameraları Görüntüle
                    </Button>
                    
                    {selectedSite.security && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleSecurityAlert(selectedSite)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Güvenlik Uyarısı
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Map;
