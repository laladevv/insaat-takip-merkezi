
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeData } from "@/hooks/useRealtime";
import { 
  Building2, 
  Users, 
  Package, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  UserPlus,
  LogOut,
  Settings,
  Bell,
  Plus
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { data: sites, loading: sitesLoading } = useRealtimeData("sites");
  const { data: personnel, loading: personnelLoading } = useRealtimeData("personnel");
  const { data: materials, loading: materialsLoading } = useRealtimeData("materials");
  const { data: reports, loading: reportsLoading } = useRealtimeData("daily_reports");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    // Kaydedilmiş şifreleri temizle
    localStorage.removeItem("rememberedCredentials");
    await signOut();
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız.",
    });
    navigate("/");
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: "Yönlendiriliyor",
      description: `${action} sayfasına yönlendiriliyorsunuz...`,
    });
    navigate(`/${action.toLowerCase()}`);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const activeSites = Array.isArray(sites) ? sites.filter((site: any) => site.status === "Aktif").length : 0;
  const totalPersonnel = Array.isArray(personnel) ? personnel.length : 0;
  const criticalMaterials = Array.isArray(materials) ? materials.filter((material: any) => material.status === "Kritik").length : 0;
  const todayReports = Array.isArray(reports) ? reports.filter((report: any) => {
    const today = new Date().toISOString().split('T')[0];
    return report.date === today;
  }).length : 0;

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
                <h1 className="text-2xl font-bold text-gray-900">IzoEFE Dashboard</h1>
                <p className="text-gray-600">
                  Hoş geldiniz, {user.user_metadata?.name || user.email}
                  {user.email === "muharremcotur@izoefe.com" && " (Yönetici)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-red-500 text-red-600">
                {user.email === "muharremcotur@izoefe.com" ? "Yönetici" : user.user_metadata?.role || "Personel"}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => handleQuickAction("notifications")}>
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickAction("settings")}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="border-red-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickAction("sites")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktif Şantiyeler</CardTitle>
                <Building2 className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {sitesLoading ? "..." : activeSites}
                </div>
                <p className="text-xs text-muted-foreground">
                  Toplam {Array.isArray(sites) ? sites.length : 0} şantiye
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickAction("personnel")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Personel</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {personnelLoading ? "..." : totalPersonnel}
                </div>
                <p className="text-xs text-muted-foreground">
                  Aktif çalışanlar
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickAction("materials")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kritik Malzemeler</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {materialsLoading ? "..." : criticalMaterials}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dikkat gerekiyor
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickAction("reports")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Günlük Raporlar</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {reportsLoading ? "..." : todayReports}
                </div>
                <p className="text-xs text-muted-foreground">
                  Bugün teslim edilen
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-red-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Genel Bakış</TabsTrigger>
              <TabsTrigger value="sites" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Şantiyeler</TabsTrigger>
              <TabsTrigger value="personnel" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Personel</TabsTrigger>
              <TabsTrigger value="materials" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Malzeme</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Raporlar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Son Aktiviteler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.isArray(reports) && reports.slice(0, 3).map((report: any) => (
                      <div key={report.id} className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Yeni rapor teslim edildi</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.created_at).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {Array.isArray(sites) && sites.slice(0, 2).map((site: any) => (
                      <div key={site.id} className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Şantiye güncellendi: {site.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(site.updated_at).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!Array.isArray(reports) || reports.length === 0) && (!Array.isArray(sites) || sites.length === 0) && (
                      <p className="text-muted-foreground text-center py-4">Henüz aktivite yok</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Hızlı İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full justify-start bg-red-500 hover:bg-red-600" 
                      size="lg"
                      onClick={() => handleQuickAction("sites")}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Şantiyeleri Görüntüle
                    </Button>
                    <Button 
                      className="w-full justify-start bg-blue-500 hover:bg-blue-600" 
                      size="lg"
                      onClick={() => handleQuickAction("personnel")}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Personel Yönetimi
                    </Button>
                    <Button 
                      className="w-full justify-start bg-red-500 hover:bg-red-600" 
                      size="lg"
                      onClick={() => handleQuickAction("materials")}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Malzeme Durumu
                    </Button>
                    <Button 
                      className="w-full justify-start bg-blue-500 hover:bg-blue-600" 
                      size="lg"
                      onClick={() => handleQuickAction("reports")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Günlük Raporlar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sites">
              <Card className="border-red-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-red-600">Şantiye Yönetimi</CardTitle>
                    <CardDescription>
                      Aktif şantiyeleri görüntüleyin ve yönetin
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleQuickAction("sites")} className="bg-red-500 hover:bg-red-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Şantiye
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sitesLoading ? (
                      <p>Yükleniyor...</p>
                    ) : Array.isArray(sites) && sites.length > 0 ? (
                      sites.slice(0, 3).map((site: any) => (
                        <div key={site.id} className="flex items-center justify-between p-4 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                          <div className="flex-1">
                            <h3 className="font-medium">{site.name}</h3>
                            <p className="text-sm text-muted-foreground">{site.location}</p>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full" 
                                  style={{ width: `${site.progress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">%{site.progress} tamamlandı</p>
                            </div>
                          </div>
                          <Badge variant={site.status === "Aktif" ? "default" : "secondary"}>
                            {site.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz şantiye bulunmuyor.</p>
                        <Button 
                          onClick={() => handleQuickAction("sites")} 
                          className="mt-4 bg-red-500 hover:bg-red-600"
                        >
                          İlk Şantiyeyi Ekle
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personnel">
              <Card className="border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-600">Personel Yönetimi</CardTitle>
                    <CardDescription>
                      Şantiye personelini görüntüleyin ve yönetin
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleQuickAction("personnel")} className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Personel
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personnelLoading ? (
                      <p>Yükleniyor...</p>
                    ) : Array.isArray(personnel) && personnel.length > 0 ? (
                      personnel.slice(0, 3).map((person: any) => (
                        <div key={person.id} className="flex items-center justify-between p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                          <div className="flex-1">
                            <h3 className="font-medium">{person.name}</h3>
                            <p className="text-sm text-muted-foreground">{person.role}</p>
                            {person.phone && (
                              <p className="text-xs text-muted-foreground">{person.phone}</p>
                            )}
                          </div>
                          <Badge variant={person.status === "Aktif" ? "default" : "secondary"}>
                            {person.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz personel bulunmuyor.</p>
                        <Button 
                          onClick={() => handleQuickAction("personnel")} 
                          className="mt-4 bg-blue-500 hover:bg-blue-600"
                        >
                          İlk Personeli Ekle
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials">
              <Card className="border-red-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-red-600">Malzeme Durumu</CardTitle>
                    <CardDescription>
                      Şantiye malzemelerini takip edin
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleQuickAction("materials")} className="bg-red-500 hover:bg-red-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Malzeme
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {materialsLoading ? (
                      <p>Yükleniyor...</p>
                    ) : Array.isArray(materials) && materials.length > 0 ? (
                      materials.slice(0, 3).map((material: any) => (
                        <div key={material.id} className="flex items-center justify-between p-4 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                          <div className="flex-1">
                            <h3 className="font-medium">{material.name}</h3>
                            <p className="text-sm text-muted-foreground">{material.quantity} {material.unit}</p>
                          </div>
                          <Badge variant={material.status === "Kritik" ? "destructive" : "default"}>
                            {material.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz malzeme kaydı bulunmuyor.</p>
                        <Button 
                          onClick={() => handleQuickAction("materials")} 
                          className="mt-4 bg-red-500 hover:bg-red-600"
                        >
                          İlk Malzemeyi Ekle
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card className="border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-600">Günlük Raporlar</CardTitle>
                    <CardDescription>
                      Şantiye günlük raporlarını görüntüleyin
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleQuickAction("reports")} className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Rapor
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsLoading ? (
                      <p>Yükleniyor...</p>
                    ) : Array.isArray(reports) && reports.length > 0 ? (
                      reports.slice(0, 3).map((report: any) => (
                        <div key={report.id} className="flex items-center justify-between p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                          <div className="flex-1">
                            <h3 className="font-medium">Günlük Rapor</h3>
                            <p className="text-sm text-muted-foreground">{new Date(report.date).toLocaleDateString('tr-TR')}</p>
                            <p className="text-xs text-muted-foreground">{report.work_description?.substring(0, 100)}...</p>
                          </div>
                          <Badge variant={report.status === "Onaylandı" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz rapor bulunmuyor.</p>
                        <Button 
                          onClick={() => handleQuickAction("reports")} 
                          className="mt-4 bg-blue-500 hover:bg-blue-600"
                        >
                          İlk Raporu Oluştur
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
