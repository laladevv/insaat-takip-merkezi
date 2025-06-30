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
  Users, 
  UserPlus, 
  Phone, 
  Mail,
  Building2,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface User {
  email: string;
  role: string;
  name: string;
}

interface Personnel {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  site: string;
  status: string;
  startDate: string;
  salary: number;
  tcno: string;
}

const Personnel = () => {
  const { user, loading } = useCustomAuth();
  const [personnel, setPersonnel] = useState<Personnel[]>([
    {
      id: 1,
      name: "Mehmet Çelik",
      email: "mehmet.celik@izoefe.com",
      phone: "0532 123 45 67",
      role: "Şantiye Şefi",
      site: "İstanbul Konut Projesi",
      status: "Aktif",
      startDate: "2024-01-15",
      salary: 45000,
      tcno: "12345678901"
    },
    {
      id: 2,
      name: "Ayşe Demir",
      email: "ayse.demir@izoefe.com",
      phone: "0533 234 56 78",
      role: "Mimar",
      site: "Ankara Plaza",
      status: "Aktif",
      startDate: "2024-02-01",
      salary: 38000,
      tcno: "23456789012"
    },
    {
      id: 3,
      name: "Ali Yılmaz",
      email: "ali.yilmaz@izoefe.com",
      phone: "0534 345 67 89",
      role: "İnşaat Mühendisi",
      site: "İzmir Rezidans",
      status: "İzinli",
      startDate: "2024-03-15",
      salary: 42000,
      tcno: "34567890123"
    },
    {
      id: 4,
      name: "Fatma Kaya",
      email: "fatma.kaya@izoefe.com",
      phone: "0535 456 78 90",
      role: "İşçi",
      site: "İstanbul Konut Projesi",
      status: "Aktif",
      startDate: "2024-04-01",
      salary: 28000,
      tcno: "45678901234"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterSite, setFilterSite] = useState("all");
  const [newPersonnel, setNewPersonnel] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    site: "",
    tcno: "",
    salary: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const roles = ["Şantiye Şefi", "Mimar", "İnşaat Mühendisi", "İşçi", "Elektrikçi", "Tesisatçı"];
  const sites = ["İstanbul Konut Projesi", "Ankara Plaza", "İzmir Rezidans"];

  const filteredPersonnel = personnel.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || person.role === filterRole;
    const matchesSite = filterSite === "all" || person.site === filterSite;
    
    return matchesSearch && matchesRole && matchesSite;
  });

  const resetForm = () => {
    setNewPersonnel({
      name: "",
      email: "",
      phone: "",
      role: "",
      site: "",
      tcno: "",
      salary: ""
    });
  };

  const handleAddPersonnel = () => {
    if (!newPersonnel.name || !newPersonnel.email || !newPersonnel.role || !newPersonnel.site) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const person: Personnel = {
      id: Math.max(...personnel.map(p => p.id)) + 1,
      name: newPersonnel.name,
      email: newPersonnel.email,
      phone: newPersonnel.phone,
      role: newPersonnel.role,
      site: newPersonnel.site,
      status: "Aktif",
      startDate: new Date().toISOString().split('T')[0],
      salary: parseInt(newPersonnel.salary) || 0,
      tcno: newPersonnel.tcno
    };

    setPersonnel([...personnel, person]);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Başarılı",
      description: "Yeni personel başarıyla eklendi.",
    });
  };

  const handleEditPersonnel = (person: Personnel) => {
    setSelectedPersonnel(person);
    setNewPersonnel({
      name: person.name,
      email: person.email,
      phone: person.phone,
      role: person.role,
      site: person.site,
      tcno: person.tcno,
      salary: person.salary.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePersonnel = () => {
    if (!selectedPersonnel || !newPersonnel.name || !newPersonnel.email || !newPersonnel.role || !newPersonnel.site) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const updatedPersonnel = personnel.map(person => 
      person.id === selectedPersonnel.id 
        ? { 
            ...person, 
            name: newPersonnel.name,
            email: newPersonnel.email,
            phone: newPersonnel.phone,
            role: newPersonnel.role,
            site: newPersonnel.site,
            tcno: newPersonnel.tcno,
            salary: parseInt(newPersonnel.salary) || 0
          }
        : person
    );

    setPersonnel(updatedPersonnel);
    setIsEditDialogOpen(false);
    setSelectedPersonnel(null);
    resetForm();

    toast({
      title: "Başarılı",
      description: "Personel bilgileri güncellendi.",
    });
  };

  const handleDeletePersonnel = (id: number) => {
    if (window.confirm("Bu personeli silmek istediğinizden emin misiniz?")) {
      setPersonnel(personnel.filter(person => person.id !== id));
      toast({
        title: "Başarılı",
        description: "Personel başarıyla silindi.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
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
                <h1 className="text-2xl font-bold text-gray-900">Personel Yönetimi</h1>
                <p className="text-gray-600">Personel bilgilerini görüntüleyin ve yönetin</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Yeni Personel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Yeni Personel Ekle</DialogTitle>
                  <DialogDescription>
                    Yeni personel bilgilerini girin
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad *</Label>
                    <Input
                      id="name"
                      value={newPersonnel.name}
                      onChange={(e) => setNewPersonnel({...newPersonnel, name: e.target.value})}
                      placeholder="Örn: Mehmet Çelik"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPersonnel.email}
                      onChange={(e) => setNewPersonnel({...newPersonnel, email: e.target.value})}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={newPersonnel.phone}
                      onChange={(e) => setNewPersonnel({...newPersonnel, phone: e.target.value})}
                      placeholder="0532 123 45 67"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tcno">TC Kimlik No</Label>
                    <Input
                      id="tcno"
                      value={newPersonnel.tcno}
                      onChange={(e) => setNewPersonnel({...newPersonnel, tcno: e.target.value})}
                      placeholder="12345678901"
                      maxLength={11}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Pozisyon *</Label>
                    <Select value={newPersonnel.role} onValueChange={(value) => setNewPersonnel({...newPersonnel, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pozisyon seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Şantiye *</Label>
                    <Select value={newPersonnel.site} onValueChange={(value) => setNewPersonnel({...newPersonnel, site: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Şantiye seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Maaş (TL)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newPersonnel.salary}
                      onChange={(e) => setNewPersonnel({...newPersonnel, salary: e.target.value})}
                      placeholder="30000"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}>
                    İptal
                  </Button>
                  <Button onClick={handleAddPersonnel} className="bg-red-500 hover:bg-red-600">
                    Ekle
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtreleme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">İsim veya Email Ara</Label>
                  <Input
                    id="search"
                    placeholder="Arama yapın..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleFilter">Pozisyon</Label>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteFilter">Şantiye</Label>
                  <Select value={filterSite} onValueChange={setFilterSite}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      {sites.map((site) => (
                        <SelectItem key={site} value={site}>{site}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personnel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPersonnel.map((person) => (
              <Card key={person.id} className="border-red-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-red-600 text-lg">{person.name}</CardTitle>
                      <CardDescription className="text-blue-600">{person.role}</CardDescription>
                    </div>
                    <Badge variant={person.status === "Aktif" ? "default" : person.status === "İzinli" ? "secondary" : "destructive"}>
                      {person.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">{person.email}</span>
                    </div>
                    {person.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-red-500" />
                        <span className="text-muted-foreground">{person.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">{person.site}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span className="text-muted-foreground">
                        Başlangıç: {new Date(person.startDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  {/* Salary */}
                  {person.salary > 0 && (
                    <div className="text-sm">
                      <p className="font-medium">Maaş:</p>
                      <p className="text-green-600 font-bold">{person.salary.toLocaleString('tr-TR')} TL</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditPersonnel(person)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeletePersonnel(person.id)}
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
                <DialogTitle>Personel Düzenle</DialogTitle>
                <DialogDescription>
                  Personel bilgilerini güncelleyin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* ... keep existing code (form fields identical to add dialog) */}
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Ad Soyad *</Label>
                  <Input
                    id="edit-name"
                    value={newPersonnel.name}
                    onChange={(e) => setNewPersonnel({...newPersonnel, name: e.target.value})}
                    placeholder="Örn: Mehmet Çelik"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={newPersonnel.email}
                    onChange={(e) => setNewPersonnel({...newPersonnel, email: e.target.value})}
                    placeholder="ornek@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefon</Label>
                  <Input
                    id="edit-phone"
                    value={newPersonnel.phone}
                    onChange={(e) => setNewPersonnel({...newPersonnel, phone: e.target.value})}
                    placeholder="0532 123 45 67"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tcno">TC Kimlik No</Label>
                  <Input
                    id="edit-tcno"
                    value={newPersonnel.tcno}
                    onChange={(e) => setNewPersonnel({...newPersonnel, tcno: e.target.value})}
                    placeholder="12345678901"
                    maxLength={11}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Pozisyon *</Label>
                  <Select value={newPersonnel.role} onValueChange={(value) => setNewPersonnel({...newPersonnel, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pozisyon seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-site">Şantiye *</Label>
                  <Select value={newPersonnel.site} onValueChange={(value) => setNewPersonnel({...newPersonnel, site: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Şantiye seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site} value={site}>{site}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">Maaş (TL)</Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={newPersonnel.salary}
                    onChange={(e) => setNewPersonnel({...newPersonnel, salary: e.target.value})}
                    placeholder="30000"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedPersonnel(null);
                  resetForm();
                }}>
                  İptal
                </Button>
                <Button onClick={handleUpdatePersonnel} className="bg-red-500 hover:bg-red-600">
                  Güncelle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {filteredPersonnel.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personel bulunamadı</h3>
                <p className="text-gray-500">Arama kriterlerinize uygun personel bulunmuyor.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Personnel;
