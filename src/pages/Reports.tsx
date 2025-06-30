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
  FileText, 
  Plus,
  Calendar,
  User,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  Image,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface Report {
  id: number;
  title: string;
  date: string;
  site: string;
  reporter: string;
  status: "Bekliyor" | "Onaylandı" | "Reddedildi";
  weather: string;
  workersPresent: number;
  workersAbsent: number;
  workDescription: string;
  materials: string;
  safety: string;
  issues: string;
  photos: string[];
  createdAt: string;
}

const Reports = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: "Günlük Rapor - 25.06.2024",
      date: "2024-06-25",
      site: "İstanbul Konut Projesi",
      reporter: "Mehmet Çelik",
      status: "Onaylandı",
      weather: "Güneşli",
      workersPresent: 42,
      workersAbsent: 3,
      workDescription: "Temel kazı işlemleri tamamlandı. Betonarme işlerine başlandı.",
      materials: "Çimento 15 ton, Demir 5 ton kullanıldı.",
      safety: "Herhangi bir güvenlik sorunu yaşanmadı. Tüm işçiler kask ve emniyet kemeri kullandı.",
      issues: "Yok",
      photos: [],
      createdAt: "2024-06-25T08:30:00"
    },
    {
      id: 2,
      title: "Günlük Rapor - 25.06.2024",
      date: "2024-06-25",
      site: "Ankara Plaza",
      reporter: "Ayşe Demir",
      status: "Bekliyor",
      weather: "Yağmurlu",
      workersPresent: 28,
      workersAbsent: 4,
      workDescription: "Yağmur nedeniyle dış cephe işleri durduruldu. İç mekan işlerine odaklanıldı.",
      materials: "Alçı 2 ton, Elektrik kablosu 500 metre",
      safety: "Yağmur nedeniyle ek güvenlik önlemleri alındı.",
      issues: "Hava koşulları nedeniyle gecikme",
      photos: [],
      createdAt: "2024-06-25T09:15:00"
    },
    {
      id: 3,
      title: "Günlük Rapor - 24.06.2024",
      date: "2024-06-24",
      site: "İzmir Rezidans",
      reporter: "Ali Yılmaz",
      status: "Onaylandı",
      weather: "Bulutlu",
      workersPresent: 25,
      workersAbsent: 3,
      workDescription: "Çelik konstrüksiyon montajı devam ediyor. %60 tamamlandı.",
      materials: "Çelik profil 8 ton, Kaynak elektrotları",
      safety: "Yüksekte çalışma güvenlik eğitimi verildi.",
      issues: "Yok",
      photos: [],
      createdAt: "2024-06-24T17:00:00"
    }
  ]);
  
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [isEditReportOpen, setIsEditReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterSite, setFilterSite] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  
  const [newReport, setNewReport] = useState({
    title: "",
    site: "",
    weather: "",
    workersPresent: "",
    workersAbsent: "",
    workDescription: "",
    materials: "",
    safety: "",
    issues: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const sites = ["İstanbul Konut Projesi", "Ankara Plaza", "İzmir Rezidans"];
  const weatherOptions = ["Güneşli", "Bulutlu", "Yağmurlu", "Karlı", "Rüzgarlı"];

  const filteredReports = reports.filter(report => {
    const matchesSite = filterSite === "all" || report.site === filterSite;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesDate = !filterDate || report.date === filterDate;
    
    return matchesSite && matchesStatus && matchesDate;
  });

  const resetForm = () => {
    setNewReport({
      title: "",
      site: "",
      weather: "",
      workersPresent: "",
      workersAbsent: "",
      workDescription: "",
      materials: "",
      safety: "",
      issues: ""
    });
  };

  const handleAddReport = () => {
    if (!newReport.title || !newReport.site || !newReport.workDescription) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const report: Report = {
      id: Math.max(...reports.map(r => r.id)) + 1,
      title: newReport.title,
      date: new Date().toISOString().split('T')[0],
      site: newReport.site,
      reporter: user?.name || "Bilinmeyen",
      status: "Bekliyor",
      weather: newReport.weather,
      workersPresent: parseInt(newReport.workersPresent) || 0,
      workersAbsent: parseInt(newReport.workersAbsent) || 0,
      workDescription: newReport.workDescription,
      materials: newReport.materials,
      safety: newReport.safety,
      issues: newReport.issues || "Yok",
      photos: [],
      createdAt: new Date().toISOString()
    };

    setReports([...reports, report]);
    resetForm();
    setIsAddReportOpen(false);
    
    toast({
      title: "Başarılı",
      description: "Günlük rapor başarıyla oluşturuldu.",
    });
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setNewReport({
      title: report.title,
      site: report.site,
      weather: report.weather,
      workersPresent: report.workersPresent.toString(),
      workersAbsent: report.workersAbsent.toString(),
      workDescription: report.workDescription,
      materials: report.materials,
      safety: report.safety,
      issues: report.issues
    });
    setIsEditReportOpen(true);
  };

  const handleUpdateReport = () => {
    if (!selectedReport || !newReport.title || !newReport.site || !newReport.workDescription) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun.",
      });
      return;
    }

    const updatedReports = reports.map(report => 
      report.id === selectedReport.id 
        ? { 
            ...report, 
            title: newReport.title,
            site: newReport.site,
            weather: newReport.weather,
            workersPresent: parseInt(newReport.workersPresent) || 0,
            workersAbsent: parseInt(newReport.workersAbsent) || 0,
            workDescription: newReport.workDescription,
            materials: newReport.materials,
            safety: newReport.safety,
            issues: newReport.issues || "Yok"
          }
        : report
    );

    setReports(updatedReports);
    setIsEditReportOpen(false);
    setSelectedReport(null);
    resetForm();

    toast({
      title: "Başarılı",
      description: "Rapor bilgileri güncellendi.",
    });
  };

  const handleDeleteReport = (id: number) => {
    if (window.confirm("Bu raporu silmek istediğinizden emin misiniz?")) {
      setReports(reports.filter(report => report.id !== id));
      toast({
        title: "Başarılı",
        description: "Rapor başarıyla silindi.",
      });
    }
  };

  const handleApproveReport = (id: number) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status: "Onaylandı" as const } : report
    ));
    toast({
      title: "Başarılı",
      description: "Rapor onaylandı.",
    });
  };

  const handleRejectReport = (id: number) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status: "Reddedildi" as const } : report
    ));
    toast({
      title: "Başarılı",
      description: "Rapor reddedildi.",
    });
  };

  const handleViewReport = (report: Report) => {
    toast({
      title: "Rapor Detayları",
      description: `${report.title} - ${report.workDescription.substring(0, 50)}...`,
    });
  };

  const handleDownloadReport = (report: Report) => {
    toast({
      title: "İndiriliyor",
      description: `${report.title} raporu indiriliyor...`,
    });
  };

  const handleViewPhotos = (report: Report) => {
    toast({
      title: "Fotoğraflar",
      description: `${report.title} için ${report.photos.length} fotoğraf bulundu.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
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
                <h1 className="text-2xl font-bold text-gray-900">Günlük Raporlar</h1>
                <p className="text-gray-600">Günlük çalışma raporlarını görüntüleyin ve yönetin</p>
              </div>
            </div>
            <Dialog open={isAddReportOpen} onOpenChange={setIsAddReportOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Rapor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Yeni Günlük Rapor</DialogTitle>
                  <DialogDescription>
                    Günlük çalışma raporu bilgilerini girin
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportTitle">Rapor Başlığı *</Label>
                    <Input
                      id="reportTitle"
                      value={newReport.title}
                      onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                      placeholder="Örn: Günlük Rapor - 25.06.2024"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportSite">Şantiye *</Label>
                      <Select value={newReport.site} onValueChange={(value) => setNewReport({...newReport, site: value})}>
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
                      <Label htmlFor="weather">Hava Durumu</Label>
                      <Select value={newReport.weather} onValueChange={(value) => setNewReport({...newReport, weather: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Hava durumu" />
                        </SelectTrigger>
                        <SelectContent>
                          {weatherOptions.map((weather) => (
                            <SelectItem key={weather} value={weather}>{weather}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workersPresent">Mevcut İşçi Sayısı</Label>
                      <Input
                        id="workersPresent"
                        type="number"
                        value={newReport.workersPresent}
                        onChange={(e) => setNewReport({...newReport, workersPresent: e.target.value})}
                        placeholder="42"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workersAbsent">Devamsız İşçi Sayısı</Label>
                      <Input
                        id="workersAbsent"
                        type="number"
                        value={newReport.workersAbsent}
                        onChange={(e) => setNewReport({...newReport, workersAbsent: e.target.value})}
                        placeholder="3"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workDescription">Yapılan İşler *</Label>
                    <Textarea
                      id="workDescription"
                      value={newReport.workDescription}
                      onChange={(e) => setNewReport({...newReport, workDescription: e.target.value})}
                      placeholder="Bugün yapılan işleri detaylı olarak açıklayın..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="materials">Kullanılan Malzemeler</Label>
                    <Textarea
                      id="materials"
                      value={newReport.materials}
                      onChange={(e) => setNewReport({...newReport, materials: e.target.value})}
                      placeholder="Bugün kullanılan malzemeleri listeleyin..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="safety">Güvenlik Durumu</Label>
                    <Textarea
                      id="safety"
                      value={newReport.safety}
                      onChange={(e) => setNewReport({...newReport, safety: e.target.value})}
                      placeholder="Güvenlik durumu ve alınan önlemler..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issues">Sorunlar ve Gecikmeler</Label>
                    <Textarea
                      id="issues"
                      value={newReport.issues}
                      onChange={(e) => setNewReport({...newReport, issues: e.target.value})}
                      placeholder="Yaşanan sorunlar, gecikmeler veya dikkat edilmesi gerekenler..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddReportOpen(false);
                    resetForm();
                  }}>
                    İptal
                  </Button>
                  <Button onClick={handleAddReport} className="bg-red-500 hover:bg-red-600">
                    Rapor Oluştur
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
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Rapor</p>
                    <p className="text-lg font-bold text-blue-600">{reports.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Onaylanan</p>
                    <p className="text-lg font-bold text-green-600">
                      {reports.filter(r => r.status === "Onaylandı").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bekleyen</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {reports.filter(r => r.status === "Bekliyor").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Reddedilen</p>
                    <p className="text-lg font-bold text-red-600">
                      {reports.filter(r => r.status === "Reddedildi").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-600">Filtreleme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="statusFilter">Durum</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="Bekliyor">Bekliyor</SelectItem>
                      <SelectItem value="Onaylandı">Onaylandı</SelectItem>
                      <SelectItem value="Reddedildi">Reddedildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFilter">Tarih</Label>
                  <Input
                    id="dateFilter"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="border-red-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-red-600 text-lg">{report.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {report.site}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {report.reporter}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.date).toLocaleDateString('tr-TR')}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant={
                      report.status === "Onaylandı" ? "default" :
                      report.status === "Reddedildi" ? "destructive" :
                      "secondary"
                    }>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Hava Durumu:</p>
                      <p className="text-muted-foreground">{report.weather}</p>
                    </div>
                    <div>
                      <p className="font-medium">Mevcut İşçi:</p>
                      <p className="text-green-600 font-bold">{report.workersPresent}</p>
                    </div>
                    <div>
                      <p className="font-medium">Devamsız:</p>
                      <p className="text-red-600 font-bold">{report.workersAbsent}</p>
                    </div>
                    <div>
                      <p className="font-medium">Toplam:</p>
                      <p className="text-blue-600 font-bold">{report.workersPresent + report.workersAbsent}</p>
                    </div>
                  </div>

                  {/* Work Description */}
                  <div>
                    <p className="font-medium text-sm mb-1">Yapılan İşler:</p>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                      {report.workDescription}
                    </p>
                  </div>

                  {/* Materials */}
                  {report.materials && (
                    <div>
                      <p className="font-medium text-sm mb-1">Kullanılan Malzemeler:</p>
                      <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                        {report.materials}
                      </p>
                    </div>
                  )}

                  {/* Safety */}
                  {report.safety && (
                    <div>
                      <p className="font-medium text-sm mb-1">Güvenlik Durumu:</p>
                      <p className="text-sm text-muted-foreground bg-green-50 p-3 rounded">
                        {report.safety}
                      </p>
                    </div>
                  )}

                  {/* Issues */}
                  {report.issues && report.issues !== "Yok" && (
                    <div>
                      <p className="font-medium text-sm mb-1">Sorunlar:</p>
                      <p className="text-sm text-muted-foreground bg-red-50 p-3 rounded">
                        {report.issues}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewReport(report)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Detay
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditReport(report)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report)}>
                      <Download className="h-4 w-4 mr-1" />
                      İndir
                    </Button>
                    {report.photos.length > 0 && (
                      <Button size="sm" variant="outline" onClick={() => handleViewPhotos(report)}>
                        <Image className="h-4 w-4 mr-1" />
                        Fotoğraflar ({report.photos.length})
                      </Button>
                    )}
                    {report.status === "Bekliyor" && (user?.role === "Yönetici" || user?.role === "Müdür") && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleApproveReport(report.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Onayla
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectReport(report.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reddet
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditReportOpen} onOpenChange={setIsEditReportOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Rapor Düzenle</DialogTitle>
                <DialogDescription>
                  Rapor bilgilerini güncelleyin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-reportTitle">Rapor Başlığı *</Label>
                  <Input
                    id="edit-reportTitle"
                    value={newReport.title}
                    onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                    placeholder="Örn: Günlük Rapor - 25.06.2024"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-reportSite">Şantiye *</Label>
                    <Select value={newReport.site} onValueChange={(value) => setNewReport({...newReport, site: value})}>
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
                    <Label htmlFor="edit-weather">Hava Durumu</Label>
                    <Select value={newReport.weather} onValueChange={(value) => setNewReport({...newReport, weather: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hava durumu" />
                      </SelectTrigger>
                      <SelectContent>
                        {weatherOptions.map((weather) => (
                          <SelectItem key={weather} value={weather}>{weather}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-workersPresent">Mevcut İşçi Sayısı</Label>
                    <Input
                      id="edit-workersPresent"
                      type="number"
                      value={newReport.workersPresent}
                      onChange={(e) => setNewReport({...newReport, workersPresent: e.target.value})}
                      placeholder="42"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-workersAbsent">Devamsız İşçi Sayısı</Label>
                    <Input
                      id="edit-workersAbsent"
                      type="number"
                      value={newReport.workersAbsent}
                      onChange={(e) => setNewReport({...newReport, workersAbsent: e.target.value})}
                      placeholder="3"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-workDescription">Yapılan İşler *</Label>
                  <Textarea
                    id="edit-workDescription"
                    value={newReport.workDescription}
                    onChange={(e) => setNewReport({...newReport, workDescription: e.target.value})}
                    placeholder="Bugün yapılan işleri detaylı olarak açıklayın..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-materials">Kullanılan Malzemeler</Label>
                  <Textarea
                    id="edit-materials"
                    value={newReport.materials}
                    onChange={(e) => setNewReport({...newReport, materials: e.target.value})}
                    placeholder="Bugün kullanılan malzemeleri listeleyin..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-safety">Güvenlik Durumu</Label>
                  <Textarea
                    id="edit-safety"
                    value={newReport.safety}
                    onChange={(e) => setNewReport({...newReport, safety: e.target.value})}
                    placeholder="Güvenlik durumu ve alınan önlemler..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-issues">Sorunlar ve Gecikmeler</Label>
                  <Textarea
                    id="edit-issues"
                    value={newReport.issues}
                    onChange={(e) => setNewReport({...newReport, issues: e.target.value})}
                    placeholder="Yaşanan sorunlar, gecikmeler veya dikkat edilmesi gerekenler..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditReportOpen(false);
                  setSelectedReport(null);
                  resetForm();
                }}>
                  İptal
                </Button>
                <Button onClick={handleUpdateReport} className="bg-red-500 hover:bg-red-600">
                  Güncelle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {filteredReports.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Rapor bulunamadı</h3>
                <p className="text-gray-500">Filtreleme kriterlerinize uygun rapor bulunmuyor.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
