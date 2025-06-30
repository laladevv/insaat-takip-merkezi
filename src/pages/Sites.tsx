
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface Site {
  id: number;
  name: string;
  location: string;
  address: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  manager: string;
  workers: number;
  description: string;
}

const Sites = () => {
  const { user, loading } = useCustomAuth();
  const [sites, setSites] = useState<Site[]>([
    {
      id: 1,
      name: "İstanbul Konut Projesi",
      location: "Kadıköy, İstanbul",
      address: "Fenerbahçe Mah. Bağdat Cad. No:123 Kadıköy/İSTANBUL",
      status: "Aktif",
      progress: 75,
      startDate: "2024-01-15",
      endDate: "2024-12-30",
      manager: "Mehmet Çelik",
      workers: 45,
      description: "50 daireli lüks konut projesi"
    },
    {
      id: 2,
      name: "Ankara Plaza",
      location: "Çankaya, Ankara",
      address: "Kızılay Mah. Atatürk Bulvarı No:456 Çankaya/ANKARA",
      status: "Aktif",
      progress: 45,
      startDate: "2024-03-01",
      endDate: "2025-06-15",
      manager: "Ayşe Demir",
      workers: 32,
      description: "Modern ofis ve AVM kompleksi"
    },
    {
      id: 3,
      name: "İzmir Rezidans",
      location: "Bornova, İzmir",
      address: "Ege Üniversitesi Mah. 123. Sok. No:789 Bornova/İZMİR",
      status: "Planlama",
      progress: 15,
      startDate: "2024-07-01",
      endDate: "2025-12-31",
      manager: "Ali Yılmaz",
      workers: 28,
      description: "Öğrenci ve genç profesyoneller için rezidans"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSite, setNewSite] = useState({
    name: "",
    location: "",
    address: "",
    description: "",
    startDate: "",
    endDate: "",
    manager: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSite = () => {
    if (!newSite.name || !newSite.location) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const site: Site = {
      id: Math.max(...sites.map(s => s.id)) + 1,
      name: newSite.name,
      location: newSite.location,
      address: newSite.address,
      status: "Planlama",
      progress: 0,
      startDate: newSite.startDate,
      endDate: newSite.endDate,
      manager: newSite.manager || "Atanmadı",
      workers: 0,
      description: newSite.description
    };

    setSites([...sites, site]);
    setNewSite({
      name: "",
      location: "",
      address: "",
      description: "",
      startDate: "",
      endDate: "",
      manager: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Başarılı",
      description: "Yeni şantiye başarıyla eklendi.",
    });
  };

  const handleEditSite = (site: Site) => {
    setSelectedSite(site);
    setNewSite({
      name: site.name,
      location: site.location,
      address: site.address,
      description: site.description,
      startDate: site.startDate,
      endDate: site.endDate,
      manager: site.manager
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSite = () => {
    if (!selectedSite || !newSite.name || !newSite.location) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const updatedSites = sites.map(site => 
      site.id === selectedSite.id 
        ? { 
            ...site, 
            name: newSite.name,
            location: newSite.location,
            address: newSite.address,
            description: newSite.description,
            startDate: newSite.startDate,
            endDate: newSite.endDate,
            manager: newSite.manager || "Atanmadı"
          }
        : site
    );

    setSites(updatedSites);
    setIsEditDialogOpen(false);
    setSelectedSite(null);
    setNewSite({
      name: "",
      location: "",
      address: "",
      description: "",
      startDate: "",
      endDate: "",
      manager: ""
    });

    toast({
      title: "Başarılı",
      description: "Şantiye bilgileri güncellendi.",
    });
  };

  const handleDeleteSite = (id: number) => {
    if (window.confirm("Bu şantiyeyi silmek istediğinizden emin misiniz?")) {
      setSites(sites.filter(site => site.id !== id));
      toast({
        title: "Başarılı",
        description: "Şantiye başarıyla silindi.",
      });
    }
  };

  const handleViewSite = (site: Site) => {
    toast({
      title: "Şantiye Detayları",
      description: `${site.name} - ${site.description}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
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
                <h1 className="text-2xl font-bold text-gray-900">Şantiye Yönetimi</h1>
                <p className="text-gray-600">Şantiyeleri görüntüleyin ve yönetin</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Şantiye
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Yeni Şantiye Ekle</DialogTitle>
                  <DialogDescription>
                    Yeni şantiye bilgilerini girin
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Şantiye Adı *</Label>
                    <Input
                      id="name"
                      value={newSite.name}
                      onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                      placeholder="Örn: İstanbul Konut Projesi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Konum *</Label>
                    <Input
                      id="location"
                      value={newSite.location}
                      onChange={(e) => setNewSite({...newSite, location: e.target.value})}
                      placeholder="Örn: Kadıköy, İstanbul"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Textarea
                      id="address"
                      value={newSite.address}
                      onChange={(e) => setNewSite({...newSite, address: e.target.value})}
                      placeholder="Detaylı adres bilgisi"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Şantiye Şefi</Label>
                    <Input
                      id="manager"
                      value={newSite.manager}
                      onChange={(e) => setNewSite({...newSite, manager: e.target.value})}
                      placeholder="Şantiye şefi adı"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newSite.startDate}
                        onChange={(e) => setNewSite({...newSite, startDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Bitiş Tarihi</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newSite.endDate}
                        onChange={(e) => setNewSite({...newSite, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={newSite.description}
                      onChange={(e) => setNewSite({...newSite, description: e.target.value})}
                      placeholder="Proje açıklaması"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={handleAddSite} className="bg-red-500 hover:bg-red-600">
                    Ekle
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Şantiye ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sites Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSites.map((site) => (
              <Card key={site.id} className="border-red-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-red-600 text-lg">{site.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {site.location}
                      </CardDescription>
                    </div>
                    <Badge variant={site.status === "Aktif" ? "default" : "secondary"}>
                      {site.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>İlerleme</span>
                      <span>%{site.progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${site.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Site Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{site.workers} İşçi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>{new Date(site.startDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">Şantiye Şefi:</p>
                    <p className="text-muted-foreground">{site.manager}</p>
                  </div>

                  {site.description && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">{site.description}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewSite(site)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detay
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditSite(site)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteSite(site.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Şantiye Düzenle</DialogTitle>
                <DialogDescription>
                  Şantiye bilgilerini güncelleyin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Şantiye Adı *</Label>
                  <Input
                    id="edit-name"
                    value={newSite.name}
                    onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                    placeholder="Örn: İstanbul Konut Projesi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Konum *</Label>
                  <Input
                    id="edit-location"
                    value={newSite.location}
                    onChange={(e) => setNewSite({...newSite, location: e.target.value})}
                    placeholder="Örn: Kadıköy, İstanbul"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Adres</Label>
                  <Textarea
                    id="edit-address"
                    value={newSite.address}
                    onChange={(e) => setNewSite({...newSite, address: e.target.value})}
                    placeholder="Detaylı adres bilgisi"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-manager">Şantiye Şefi</Label>
                  <Input
                    id="edit-manager"
                    value={newSite.manager}
                    onChange={(e) => setNewSite({...newSite, manager: e.target.value})}
                    placeholder="Şantiye şefi adı"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Başlangıç Tarihi</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={newSite.startDate}
                      onChange={(e) => setNewSite({...newSite, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">Bitiş Tarihi</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={newSite.endDate}
                      onChange={(e) => setNewSite({...newSite, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Açıklama</Label>
                  <Textarea
                    id="edit-description"
                    value={newSite.description}
                    onChange={(e) => setNewSite({...newSite, description: e.target.value})}
                    placeholder="Proje açıklaması"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handleUpdateSite} className="bg-red-500 hover:bg-red-600">
                  Güncelle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {filteredSites.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Şantiye bulunamadı</h3>
                <p className="text-gray-500">Arama kriterlerinize uygun şantiye bulunmuyor.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Sites;
