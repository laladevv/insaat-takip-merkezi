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
import { 
  Package, 
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Minus,
  TrendingUp,
  Archive
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface Material {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minStock: number;
  site: string;
  category: string;
  supplier: string;
  unitPrice: number;
  totalValue: number;
  status: "Normal" | "Kritik" | "Tükendi";
  lastUpdated: string;
  description: string;
}

const Materials = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      name: "Çimento",
      quantity: 150,
      unit: "Ton",
      minStock: 50,
      site: "İstanbul Konut Projesi", 
      category: "İnşaat Malzemesi",
      supplier: "ABC Çimento",
      unitPrice: 850,
      totalValue: 127500,
      status: "Normal",
      lastUpdated: "2024-06-25",
      description: "Portland çimentosu CEM I 42.5 R"
    },
    {
      id: 2,
      name: "Demir",
      quantity: 25,
      unit: "Ton",
      minStock: 30,
      site: "İstanbul Konut Projesi",
      category: "İnşaat Malzemesi", 
      supplier: "XYZ Demir",
      unitPrice: 18500,
      totalValue: 462500,
      status: "Kritik",
      lastUpdated: "2024-06-24",
      description: "Nervürlü inşaat demiri S420"
    },
    {
      id: 3,
      name: "Alçı",
      quantity: 0,
      unit: "Ton",
      minStock: 10,
      site: "Ankara Plaza",
      category: "İç Mekan",
      supplier: "DEF Alçı",
      unitPrice: 650,
      totalValue: 0,
      status: "Tükendi",
      lastUpdated: "2024-06-23",
      description: "Saten alçı 25 kg"
    },
    {
      id: 4,
      name: "Boya",
      quantity: 85,
      unit: "Litre",
      minStock: 20,
      site: "İzmir Rezidans",
      category: "Boyalar",
      supplier: "GHI Boya",
      unitPrice: 125,
      totalValue: 10625,
      status: "Normal",
      lastUpdated: "2024-06-25",
      description: "Plastik iç cephe boyası beyaz"
    },
    {
      id: 5,
      name: "Seramik",
      quantity: 8,
      unit: "m²",
      minStock: 15,
      site: "Ankara Plaza",
      category: "Kaplama",
      supplier: "JKL Seramik",
      unitPrice: 85,
      totalValue: 680,
      status: "Kritik",
      lastUpdated: "2024-06-24",
      description: "60x60 cm granit seramik gri"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSite, setFilterSite] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stockAction, setStockAction] = useState<"add" | "remove">("add");
  const [stockAmount, setStockAmount] = useState("");
  
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: "",
    unit: "",
    minStock: "",
    site: "",
    category: "",
    supplier: "",
    unitPrice: "",
    description: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const sites = ["İstanbul Konut Projesi", "Ankara Plaza", "İzmir Rezidans"];
  const categories = ["İnşaat Malzemesi", "İç Mekan", "Boyalar", "Kaplama", "Elektrik", "Tesisat"];
  const units = ["Adet", "Ton", "m²", "m³", "Litre", "kg", "Paket"];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = filterSite === "all" || material.site === filterSite;
    const matchesCategory = filterCategory === "all" || material.category === filterCategory;
    const matchesStatus = filterStatus === "all" || material.status === filterStatus;
    
    return matchesSearch && matchesSite && matchesCategory && matchesStatus;
  });

  const resetForm = () => {
    setNewMaterial({
      name: "",
      quantity: "",
      unit: "",
      minStock: "",
      site: "",
      category: "",
      supplier: "",
      unitPrice: "",
      description: ""
    });
  };

  const calculateStatus = (quantity: number, minStock: number): Material["status"] => {
    if (quantity === 0) return "Tükendi";
    if (quantity <= minStock) return "Kritik";
    return "Normal";
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity || !newMaterial.unit || !newMaterial.site) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const quantity = parseInt(newMaterial.quantity) || 0;
    const minStock = parseInt(newMaterial.minStock) || 0;
    const unitPrice = parseFloat(newMaterial.unitPrice) || 0;

    const material: Material = {
      id: Math.max(...materials.map(m => m.id)) + 1,
      name: newMaterial.name,
      quantity: quantity,
      unit: newMaterial.unit,
      minStock: minStock,
      site: newMaterial.site,
      category: newMaterial.category || "Diğer",
      supplier: newMaterial.supplier || "Belirtilmemiş",
      unitPrice: unitPrice,
      totalValue: quantity * unitPrice,
      status: calculateStatus(quantity, minStock),
      lastUpdated: new Date().toISOString().split('T')[0],
      description: newMaterial.description
    };

    setMaterials([...materials, material]);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Başarılı",
      description: "Yeni malzeme başarıyla eklendi.",
    });
  };

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setNewMaterial({
      name: material.name,
      quantity: material.quantity.toString(),
      unit: material.unit,
      minStock: material.minStock.toString(),
      site: material.site,
      category: material.category,
      supplier: material.supplier,
      unitPrice: material.unitPrice.toString(),
      description: material.description
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMaterial = () => {
    if (!selectedMaterial || !newMaterial.name || !newMaterial.quantity || !newMaterial.unit || !newMaterial.site) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const quantity = parseInt(newMaterial.quantity) || 0;
    const minStock = parseInt(newMaterial.minStock) || 0;
    const unitPrice = parseFloat(newMaterial.unitPrice) || 0;

    const updatedMaterials = materials.map(material => 
      material.id === selectedMaterial.id 
        ? { 
            ...material, 
            name: newMaterial.name,
            quantity: quantity,
            unit: newMaterial.unit,
            minStock: minStock,
            site: newMaterial.site,
            category: newMaterial.category || "Diğer",
            supplier: newMaterial.supplier || "Belirtilmemiş",
            unitPrice: unitPrice,
            totalValue: quantity * unitPrice,
            status: calculateStatus(quantity, minStock),
            lastUpdated: new Date().toISOString().split('T')[0],
            description: newMaterial.description
          }
        : material
    );

    setMaterials(updatedMaterials);
    setIsEditDialogOpen(false);
    setSelectedMaterial(null);
    resetForm();

    toast({
      title: "Başarılı",
      description: "Malzeme bilgileri güncellendi.",
    });
  };

  const handleDeleteMaterial = (id: number) => {
    if (window.confirm("Bu malzemeyi silmek istediğinizden emin misiniz?")) {
      setMaterials(materials.filter(material => material.id !== id));
      toast({
        title: "Başarılı",
        description: "Malzeme başarıyla silindi.",
      });
    }
  };

  const handleStockUpdate = (material: Material, action: "add" | "remove") => {
    setSelectedMaterial(material);
    setStockAction(action);
    setStockAmount("");
    setIsStockDialogOpen(true);
  };

  const handleConfirmStockUpdate = () => {
    if (!selectedMaterial || !stockAmount) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen miktar girin.",
      });
      return;
    }

    const amount = parseInt(stockAmount) || 0;
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Miktar sıfırdan büyük olmalıdır.",
      });
      return;
    }

    const newQuantity = stockAction === "add" 
      ? selectedMaterial.quantity + amount 
      : Math.max(0, selectedMaterial.quantity - amount);

    const updatedMaterials = materials.map(material => 
      material.id === selectedMaterial.id 
        ? { 
            ...material, 
            quantity: newQuantity,
            totalValue: newQuantity * material.unitPrice,
            status: calculateStatus(newQuantity, material.minStock),
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : material
    );

    setMaterials(updatedMaterials);
    setIsStockDialogOpen(false);
    setSelectedMaterial(null);
    setStockAmount("");

    toast({
      title: "Başarılı",
      description: `Stok ${stockAction === "add" ? "eklendi" : "çıkarıldı"}.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalValue = materials.reduce((sum, material) => sum + material.totalValue, 0);
  const criticalMaterials = materials.filter(m => m.status === "Kritik" || m.status === "Tükendi").length;

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
                <p className="text-gray-600">Stok durumunu kontrol edin ve yönetin</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Malzeme
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Yeni Malzeme Ekle</DialogTitle>
                  <DialogDescription>
                    Yeni malzeme bilgilerini girin
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Malzeme Adı *</Label>
                    <Input
                      id="name"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                      placeholder="Örn: Çimento"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
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
                        <SelectValue placeholder="Birim seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="unitPrice">Birim Fiyat (TL)</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      value={newMaterial.unitPrice}
                      onChange={(e) => setNewMaterial({...newMaterial, unitPrice: e.target.value})}
                      placeholder="850.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Şantiye *</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Tedarikçi</Label>
                    <Input
                      id="supplier"
                      value={newMaterial.supplier}
                      onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                      placeholder="ABC Çimento"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={newMaterial.description}
                      onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                      placeholder="Malzeme hakkında detaylı bilgi..."
                      rows={3}
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
                  <Button onClick={handleAddMaterial} className="bg-red-500 hover:bg-red-600">
                    Ekle
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Malzeme</p>
                    <p className="text-lg font-bold text-blue-600">{materials.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Değer</p>
                    <p className="text-lg font-bold text-green-600">{totalValue.toLocaleString('tr-TR')} TL</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kritik/Tükenen</p>
                    <p className="text-lg font-bold text-red-600">{criticalMaterials}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Archive className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Normal Stok</p>
                    <p className="text-lg font-bold text-gray-600">{materials.filter(m => m.status === "Normal").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Malzeme Ara</Label>
                  <Input
                    id="search"
                    placeholder="Malzeme adı veya tedarikçi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                  <Label htmlFor="statusFilter">Durum</Label>
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
                    <Badge variant={
                      material.status === "Tükendi" ? "destructive" :
                      material.status === "Kritik" ? "secondary" :
                      "default"
                    }>
                      {material.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stock Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Mevcut Stok:</span>
                      <span className={`text-lg font-bold ${
                        material.status === "Tükendi" ? "text-red-600" :
                        material.status === "Kritik" ? "text-orange-600" :
                        "text-green-600"
                      }`}>
                        {material.quantity} {material.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Min. Stok:</span>
                      <span>{material.minStock} {material.unit}</span>
                    </div>
                  </div>

                  {/* Site and Supplier */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium">Şantiye:</p>
                      <p className="text-muted-foreground">{material.site}</p>
                    </div>
                    <div>
                      <p className="font-medium">Tedarikçi:</p>
                      <p className="text-muted-foreground">{material.supplier}</p>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Birim Fiyat:</span>
                      <span className="text-blue-600">{material.unitPrice.toLocaleString('tr-TR')} TL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Toplam Değer:</span>
                      <span className="text-green-600 font-bold">{material.totalValue.toLocaleString('tr-TR')} TL</span>
                    </div>
                  </div>

                  {/* Description */}
                  {material.description && (
                    <div className="text-sm">
                      <p className="text-muted-foreground bg-gray-50 p-2 rounded text-xs">
                        {material.description}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => handleStockUpdate(material, "add")}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Stok Ekle
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-orange-600 hover:bg-orange-50"
                      onClick={() => handleStockUpdate(material, "remove")}
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Stok Çıkar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditMaterial(material)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Malzeme Düzenle</DialogTitle>
                <DialogDescription>
                  Malzeme bilgilerini güncelleyin
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Malzeme Adı *</Label>
                  <Input
                    id="edit-name"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                    placeholder="Örn: Çimento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Kategori</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Miktar *</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Birim *</Label>
                  <Select value={newMaterial.unit} onValueChange={(value) => setNewMaterial({...newMaterial, unit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Birim seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Minimum Stok</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={newMaterial.minStock}
                    onChange={(e) => setNewMaterial({...newMaterial, minStock: e.target.value})}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unitPrice">Birim Fiyat (TL)</Label>
                  <Input
                    id="edit-unitPrice"
                    type="number"
                    step="0.01"
                    value={newMaterial.unitPrice}
                    onChange={(e) => setNewMaterial({...newMaterial, unitPrice: e.target.value})}
                    placeholder="850.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-site">Şantiye *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier">Tedarikçi</Label>
                  <Input
                    id="edit-supplier"
                    value={newMaterial.supplier}
                    onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                    placeholder="ABC Çimento"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-description">Açıklama</Label>
                  <Textarea
                    id="edit-description"
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                    placeholder="Malzeme hakkında detaylı bilgi..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedMaterial(null);
                  resetForm();
                }}>
                  İptal
                </Button>
                <Button onClick={handleUpdateMaterial} className="bg-red-500 hover:bg-red-600">
                  Güncelle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Stock Update Dialog */}
          <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Stok {stockAction === "add" ? "Ekle" : "Çıkar"}
                </DialogTitle>
                <DialogDescription>
                  {selectedMaterial?.name} için stok {stockAction === "add" ? "ekleme" : "çıkarma"} miktarını girin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stockAmount">
                    {stockAction === "add" ? "Eklenecek" : "Çıkarılacak"} Miktar
                  </Label>
                  <Input
                    id="stockAmount"
                    type="number"
                    value={stockAmount}
                    onChange={(e) => setStockAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
                {selectedMaterial && (
                  <div className="text-sm text-muted-foreground">
                    <p>Mevcut Stok: <span className="font-medium">{selectedMaterial.quantity} {selectedMaterial.unit}</span></p>
                    {stockAction === "add" && stockAmount && (
                      <p>Yeni Stok: <span className="font-medium text-green-600">{selectedMaterial.quantity + (parseInt(stockAmount) || 0)} {selectedMaterial.unit}</span></p>
                    )}
                    {stockAction === "remove" && stockAmount && (
                      <p>Yeni Stok: <span className="font-medium text-orange-600">{Math.max(0, selectedMaterial.quantity - (parseInt(stockAmount) || 0))} {selectedMaterial.unit}</span></p>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsStockDialogOpen(false);
                  setSelectedMaterial(null);
                  setStockAmount("");
                }}>
                  İptal
                </Button>
                <Button 
                  onClick={handleConfirmStockUpdate} 
                  className={stockAction === "add" ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"}
                >
                  {stockAction === "add" ? "Stok Ekle" : "Stok Çıkar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {filteredMaterials.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Malzeme bulunamadı</h3>
                <p className="text-gray-500">Arama kriterlerinize uygun malzeme bulunmuyor.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Materials;
