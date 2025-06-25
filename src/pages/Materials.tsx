
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  email: string;
  role: string;
  name: string;
}

interface Material {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  price: number;
  supplier: string;
  site: string;
  status: "Normal" | "Kritik" | "Tükendi";
  lastUpdate: string;
}

interface MaterialRequest {
  id: number;
  materialName: string;
  requestedQuantity: number;
  unit: string;
  requestedBy: string;
  site: string;
  status: "Bekliyor" | "Onaylandı" | "Reddedildi";
  requestDate: string;
  reason: string;
  urgency: "Düşük" | "Orta" | "Yüksek";
}

const Materials = () => {
  const [user, setUser] = useState<User | null>(null);
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      name: "Çimento",
      category: "İnşaat Malzemesi",
      quantity: 150,
      unit: "ton",
      minStock: 50,
      price: 850,
      supplier: "ABC İnşaat Ltd.",
      site: "İstanbul Konut Projesi",
      status: "Normal",
      lastUpdate: "2024-06-25"
    },
    {
      id: 2,
      name: "Demir",
      category: "İnşaat Malzemesi",
      quantity: 25,
      unit: "ton",
      minStock: 30,
      price: 18500,
      supplier: "Demir AS",
      site: "Ankara Plaza",
      status: "Kritik",
      lastUpdate: "2024-06-24"
    },
    {
      id: 3,
      name: "Tuğla",
      category: "Yapı Malzemesi",
      quantity: 0,
      unit: "adet",
      minStock: 1000,
      price: 2.5,
      supplier: "Tuğla San.",
      site: "İzmir Rezidans",
      status: "Tükendi",
      lastUpdate: "2024-06-23"
    },
    {
      id: 4,
      name: "Kablo",
      category: "Elektrik",
      quantity: 2500,
      unit: "metre",
      minStock: 500,
      price: 25,
      supplier: "Elektrik Ltd.",
      site: "İstanbul Konut Projesi",
      status: "Normal",
      lastUpdate: "2024-06-25"
    }
  ]);

  const [requests, setRequests] = useState<MaterialRequest[]>([
    {
      id: 1,
      materialName: "Çimento",
      requestedQuantity: 50,
      unit: "ton",
      requestedBy: "Mehmet Çelik",
      site: "İstanbul Konut Projesi",
      status: "Bekliyor",
      requestDate: "2024-06-25",
      reason: "Temel beton dökümü için",
      urgency: "Yüksek"
    },
    {
      id: 2,
      materialName: "Demir",
      requestedQuantity: 15,
      unit: "ton",
      requestedBy: "Ayşe Demir",
      site: "Ankara Plaza",
      status: "Onaylandı",
      requestDate: "2024-06-24",
      reason: "Kolon demiri",
      urgency: "Orta"
    }
  ]);
  
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    minStock: "",
    price: "",
    supplier: "",
    site: ""
  });

  const [newRequest, setNewRequest] = useState({
    materialName: "",
    requestedQuantity: "",
    unit: "",
    site: "",
    reason: "",
    urgency: "Orta" as "Düşük" | "Orta" | "Yüksek"
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const categories = ["İnşaat Malzemesi", "Yapı Malzemesi", "Elektrik", "Tesisat", "Boyalar", "Temizlik"];
  const units = ["ton", "adet", "metre", "litre", "kg", "m²", "m³"];
  const sites = ["İstanbul Konut Projesi", "Ankara Plaza", "İzmir Rezidans"];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || material.category === filterCategory;
    const matchesStatus = filterStatus === "all" || material.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.category || !newMaterial.quantity || !newMaterial.unit) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const quantity = parseInt(newMaterial.quantity);
    const minStock = parseInt(newMaterial.minStock) || 0;
    let status: "Normal" | "Kritik" | "Tükendi" = "Normal";
    
    if (quantity === 0) {
      status = "Tükendi";
    } else if (quantity <= minStock) {
      status = "Kritik";
    }

    const material: Material = {
      id: materials.length + 1,
      name: newMaterial.name,
      category: newMaterial.category,
      quantity: quantity,
      unit: newMaterial.unit,
      minStock: minStock,
      price: parseFloat(newMaterial.price) || 0,
      supplier: newMaterial.supplier,
      site: newMaterial.site,
      status: status,
      lastUpdate: new Date().toISOString().split('T')[0]
    };

    setMaterials([...materials, material]);
    setNewMaterial({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      minStock: "",
      price: "",
      supplier: "",
      site: ""
    });
    setIsAddMaterialOpen(false);
    
    toast({
      title: "Başarılı",
      description: "Yeni malzeme başarıyla eklendi.",
    });
  };

  const handleAddRequest = () => {
    if (!newRequest.materialName || !newRequest.requestedQuantity || !newRequest.site) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const request: MaterialRequest = {
      id: requests.length + 1,
      materialName: newRequest.materialName,
      requestedQuantity: parseInt(newRequest.requestedQuantity),
      unit: newRequest.unit || "adet",
      requestedBy: user?.name || "Bilinmeyen",
      site: newRequest.site,
      status: "Bekliyor",
      requestDate: new Date().toISOString().split('T')[0],
      reason: newRequest.reason,
      urgency: newRequest.urgency
    };

    setRequests([...requests, request]);
    setNewRequest({
      materialName: "",
      requestedQuantity: "",
      unit: "",
      site: "",
      reason: "",
      urgency: "Orta"
    });
    setIsAddRequestOpen(false);
    
    toast({
      title: "Başarılı",
      description: "Malzeme talebi başarıyla oluşturuldu.",
    });
  };

  const handleApproveRequest = (id: number) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: "Onaylandı" as const } : request
    ));
    toast({
      title: "Başarılı",
      description: "Talep onaylandı.",
    });
  };

  const handleRejectRequest = (id: number) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: "Reddedildi" as const } : request
    ));
    toast({
      title: "Başarılı",
      description: "Talep reddedildi.",
    });
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Malzeme Yönetimi</h1>
                <p className="text-gray-600">Malzeme stoklarını ve taleplerini yönetin</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Normal Stok</p>
                    <p className="text-lg font-bold text-green-600">
                      {materials.filter(m => m.status === "Normal").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kritik Stok</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {materials.filter(m => m.status === "Kritik").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tükenen</p>
                    <p className="text-lg font-bold text-red-600">
                      {materials.filter(m => m.status === "Tükendi").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bekleyen Talep</p>
                    <p className="text-lg font-bold text-blue-600">
                      {requests.filter(r => r.status === "Bekliyor").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="materials" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-white border-2 border-red-100">
              <TabsTrigger value="materials" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                Malzeme Stoku
              </TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Talepler
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials">
              <div className="space-y-6">
                {/* Add Material Button */}
                <div className="flex justify-end">
                  <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Malzeme
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Yeni Malzeme Ekle</DialogTitle>
                        <DialogDescription>
                          Yeni malzeme bilgilerini girin
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="materialName">Malzeme Adı *</Label>
                          <Input
                            id="materialName"
                            value={newMaterial.name}
                            onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                            placeholder="Örn: Çimento"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Kategori *</Label>
                          <Select value={newMaterial.category} onValueChange={(value) => setNewMaterial({...newMaterial, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Kategori seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Miktar *</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={newMaterial.quantity}
                              onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
                              placeholder="100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="unit">Birim *</Label>
                            <Select value={newMaterial.unit} onValueChange={(value) => setNewMaterial({...newMaterial, unit: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Birim" />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map((unit) => (
                                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="minStock">Minimum Stok</Label>
                          <Input
                            id="minStock"
                            type="number"
                            value={newMaterial.minStock}
                            onChange={(e) => setNewMaterial({...newMaterial, minStock: e.target.value})}
                            placeholder="10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Birim Fiyat (TL)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newMaterial.price}
                            onChange={(e) => setNewMaterial({...newMaterial, price: e.target.value})}
                            placeholder="100.50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supplier">Tedarikçi</Label>
                          <Input
                            id="supplier"
                            value={newMaterial.supplier}
                            onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                            placeholder="ABC İnşaat Ltd."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="materialSite">Şantiye</Label>
                          <Select value={newMaterial.site} onValueChange={(value) => setNewMaterial({...newMaterial, site: value})}>
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
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddMaterialOpen(false)}>
                          İptal
                        </Button>
                        <Button onClick={handleAddMaterial} className="bg-red-500 hover:bg-red-600">
                          Ekle
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Filters */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Filtreleme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="search">Malzeme Ara</Label>
                        <Input
                          id="search"
                          placeholder="Arama yapın..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryFilter">Kategori</Label>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statusFilter">Stok Durumu</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Kritik">Kritik</SelectItem>
                            <SelectItem value="Tükendi">Tükendi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMaterials.map((material) => (
                    <Card key={material.id} className="border-red-200 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-red-600 text-lg">{material.name}</CardTitle>
                            <CardDescription className="text-blue-600">{material.category}</CardDescription>
                          </div>
                          <Badge 
                            variant={
                              material.status === "Normal" ? "default" : 
                              material.status === "Kritik" ? "secondary" : 
                              "destructive"
                            }
                          >
                            {material.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Quantity Info */}
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">
                            {material.quantity.toLocaleString('tr-TR')}
                          </div>
                          <div className="text-sm text-muted-foreground">{material.unit}</div>
                          {material.minStock > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Min: {material.minStock} {material.unit}
                            </div>
                          )}
                        </div>

                        {/* Stock Progress */}
                        {material.minStock > 0 && (
                          <div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  material.status === "Normal" ? "bg-green-500" :
                                  material.status === "Kritik" ? "bg-yellow-500" :
                                  "bg-red-500"
                                }`}
                                style={{ 
                                  width: `${Math.min((material.quantity / (material.minStock * 2)) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Material Info */}
                        <div className="space-y-2 text-sm">
                          {material.price > 0 && (
                            <div>
                              <p className="font-medium">Birim Fiyat:</p>
                              <p className="text-green-600 font-bold">{material.price.toLocaleString('tr-TR')} TL</p>
                            </div>
                          )}
                          {material.supplier && (
                            <div>
                              <p className="font-medium">Tedarikçi:</p>
                              <p className="text-muted-foreground">{material.supplier}</p>
                            </div>
                          )}
                          {material.site && (
                            <div>
                              <p className="font-medium">Şantiye:</p>
                              <p className="text-muted-foreground">{material.site}</p>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">Son Güncelleme:</p>
                            <p className="text-muted-foreground">
                              {new Date(material.lastUpdate).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Detay
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <div className="space-y-6">
                {/* Add Request Button */}
                <div className="flex justify-end">
                  <Dialog open={isAddRequestOpen} onOpenChange={setIsAddRequestOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Talep
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Malzeme Talebi Oluştur</DialogTitle>
                        <DialogDescription>
                          Malzeme talep bilgilerini girin
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="requestMaterialName">Malzeme Adı *</Label>
                          <Input
                            id="requestMaterialName"
                            value={newRequest.materialName}
                            onChange={(e) => setNewRequest({...newRequest, materialName: e.target.value})}
                            placeholder="Örn: Çimento"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="requestQuantity">Miktar *</Label>
                            <Input
                              id="requestQuantity"
                              type="number"
                              value={newRequest.requestedQuantity}
                              onChange={(e) => setNewRequest({...newRequest, requestedQuantity: e.target.value})}
                              placeholder="10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="requestUnit">Birim</Label>
                            <Select value={newRequest.unit} onValueChange={(value) => setNewRequest({...newRequest, unit: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Birim" />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map((unit) => (
                                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="requestSite">Şantiye *</Label>
                          <Select value={newRequest.site} onValueChange={(value) => setNewRequest({...newRequest, site: value})}>
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
                          <Label htmlFor="urgency">Aciliyet</Label>
                          <Select value={newRequest.urgency} onValueChange={(value) => setNewRequest({...newRequest, urgency: value as "Düşük" | "Orta" | "Yüksek"})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Düşük">Düşük</SelectItem>
                              <SelectItem value="Orta">Orta</SelectItem>
                              <SelectItem value="Yüksek">Yüksek</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason">Talep Nedeni</Label>
                          <Textarea
                            id="reason"
                            value={newRequest.reason}
                            onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                            placeholder="Talep nedenini açıklayın..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddRequestOpen(false)}>
                          İptal
                        </Button>
                        <Button onClick={handleAddRequest} className="bg-blue-500 hover:bg-blue-600">
                          Talep Oluştur
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card key={request.id} className="border-blue-200">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-blue-600 text-lg">{request.materialName}</CardTitle>
                            <CardDescription>
                              {request.requestedQuantity} {request.unit} - {request.site}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={
                              request.urgency === "Yüksek" ? "destructive" :
                              request.urgency === "Orta" ? "secondary" :
                              "outline"
                            }>
                              {request.urgency}
                            </Badge>
                            <Badge variant={
                              request.status === "Onaylandı" ? "default" :
                              request.status === "Reddedildi" ? "destructive" :
                              "secondary"
                            }>
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Talep Eden:</p>
                            <p className="text-sm text-muted-foreground">{request.requestedBy}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Talep Tarihi:</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.requestDate).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        {request.reason && (
                          <div className="mb-4">
                            <p className="text-sm font-medium">Talep Nedeni:</p>
                            <p className="text-sm text-muted-foreground">{request.reason}</p>
                          </div>
                        )}
                        {request.status === "Bekliyor" && user?.role === "Yönetici" && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Onayla
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Reddet
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {requests.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Talep bulunamadı</h3>
                      <p className="text-gray-500">Henüz malzeme talebi bulunmuyor.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Materials;
