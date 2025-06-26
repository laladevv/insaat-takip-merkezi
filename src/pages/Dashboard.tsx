
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
  Bell
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
    await signOut();
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız.",
    });
    navigate("/");
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

  const activeSites = sites.filter((site: any) => site.status === "Aktif").length;
  const totalPersonnel = personnel.length;
  const criticalMaterials = materials.filter((material: any) => material.status === "Kritik").length;
  const todayReports = reports.filter((report: any) => {
    const today = new Date().toISOString().split('T')[0];
    return report.date === today;
  }).length;

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
                <p className="text-gray-600">Hoş geldiniz, {user.user_metadata?.name || user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-red-500 text-red-600">
                {user.user_metadata?.role || "Personel"}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => navigate("/notifications")}>
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktif Şantiyeler</CardTitle>
                <Building2 className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {sitesLoading ? "..." : activeSites}
                </div>
                <p className="text-xs text-muted-foreground">
                  Toplam {sites.length} şantiye
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
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

            <Card className="border-red-200 hover:shadow-lg transition-shadow">
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

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
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
                    {reports.slice(0, 3).map((report: any, index) => (
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
                    {sites.slice(0, 2).map((site: any, index) => (
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
                      onClick={() => navigate("/sites")}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Şantiyeleri Görüntüle
                    </Button>
                    <Button 
                      className="w-full justify-start bg-blue-500 hover:bg-blue-600" 
                      size="lg"
                      onClick={() => navigate("/personnel")}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Personel Yönetimi
                    </Button>
                    <Button 
                      className="w-full justify-start bg-red-500 hover:bg-red-600" 
                      size="lg"
                      onClick={() => navigate("/materials")}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Malzeme Durumu
                    </Button>
                    <Button 
                      className="w-full justify-start bg-blue-500 hover:bg-blue-600" 
                      size="lg"
                      onClick={() => navigate("/reports")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Günlük Raporlar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Diğer tab content'ler gerçek verilerle */}
            <TabsContent value="sites">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Şantiye Yönetimi</CardTitle>
                  <CardDescription>
                    Aktif şantiyeleri görüntüleyin ve yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sitesLoading ? (
                      <p>Yükleniyor...</p>
                    ) : sites.length > 0 ? (
                      sites.slice(0, 3).map((site: any) => (
                        <div key={site.id} className="flex items-center justify-between p-4 border border-red-100 rounded-lg">
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
                      <p className="text-muted-foreground">Henüz şantiye bulunmuyor.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Diğer TabContent'ler benzer şekilde real data ile doldurulacak */}
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
