
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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

interface User {
  email: string;
  role: string;
  name: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız.",
    });
    navigate("/");
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
                <h1 className="text-2xl font-bold text-gray-900">IzoEFE Dashboard</h1>
                <p className="text-gray-600">Hoş geldiniz, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-red-500 text-red-600">
                {user.role}
              </Badge>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
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
                <div className="text-2xl font-bold text-red-600">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 geçen aydan
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Personel</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">154</div>
                <p className="text-xs text-muted-foreground">
                  +12 geçen aydan
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bekleyen Talepler</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">7</div>
                <p className="text-xs text-muted-foreground">
                  Kritik: 2 adet
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Günlük Raporlar</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">23</div>
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
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Yeni şantiye eklendi: Ankara Projesi</p>
                        <p className="text-xs text-muted-foreground">2 saat önce</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Malzeme talebi onaylandı</p>
                        <p className="text-xs text-muted-foreground">4 saat önce</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Günlük rapor teslim edildi</p>
                        <p className="text-xs text-muted-foreground">6 saat önce</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Hızlı İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start bg-red-500 hover:bg-red-600" size="lg">
                      <Building2 className="mr-2 h-4 w-4" />
                      Yeni Şantiye Ekle
                    </Button>
                    <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600" size="lg">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Personel Kaydet
                    </Button>
                    <Button className="w-full justify-start bg-red-500 hover:bg-red-600" size="lg">
                      <Package className="mr-2 h-4 w-4" />
                      Malzeme Talebi
                    </Button>
                    <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600" size="lg">
                      <FileText className="mr-2 h-4 w-4" />
                      Günlük Rapor
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

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
                    {[
                      { name: "İstanbul Konut Projesi", location: "Kadıköy, İstanbul", status: "Aktif", progress: 75 },
                      { name: "Ankara Plaza", location: "Çankaya, Ankara", status: "Aktif", progress: 45 },
                      { name: "İzmir Rezidans", location: "Bornova, İzmir", status: "Planlama", progress: 15 }
                    ].map((site, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-red-100 rounded-lg">
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personnel">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">Personel Yönetimi</CardTitle>
                  <CardDescription>
                    Personel bilgilerini görüntüleyin ve yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Mehmet Çelik", role: "Şantiye Şefi", site: "İstanbul Konut Projesi", status: "Aktif" },
                      { name: "Ayşe Demir", role: "Mimar", site: "Ankara Plaza", status: "Aktif" },
                      { name: "Ali Yılmaz", role: "İnşaat Mühendisi", site: "İzmir Rezidans", status: "İzinli" }
                    ].map((person, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-blue-100 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{person.name}</h3>
                          <p className="text-sm text-muted-foreground">{person.role}</p>
                          <p className="text-xs text-muted-foreground">{person.site}</p>
                        </div>
                        <Badge variant={person.status === "Aktif" ? "default" : "secondary"}>
                          {person.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Malzeme Yönetimi</CardTitle>
                  <CardDescription>
                    Malzeme stoklarını ve taleplerini yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Çimento", quantity: 150, unit: "ton", status: "Normal", critical: false },
                      { name: "Demir", quantity: 25, unit: "ton", status: "Kritik", critical: true },
                      { name: "Tuğla", quantity: 5000, unit: "adet", status: "Normal", critical: false }
                    ].map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-red-100 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{material.name}</h3>
                          <p className="text-sm text-muted-foreground">{material.quantity} {material.unit}</p>
                        </div>
                        <Badge variant={material.critical ? "destructive" : "default"}>
                          {material.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">Günlük Raporlar</CardTitle>
                  <CardDescription>
                    Son günlük raporları görüntüleyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: "25.06.2024", site: "İstanbul Konut Projesi", reporter: "Mehmet Çelik", status: "Onaylandı" },
                      { date: "25.06.2024", site: "Ankara Plaza", reporter: "Ayşe Demir", status: "Bekliyor" },
                      { date: "24.06.2024", site: "İzmir Rezidans", reporter: "Ali Yılmaz", status: "Onaylandı" }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-blue-100 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{report.site}</h3>
                          <p className="text-sm text-muted-foreground">Rapor eden: {report.reporter}</p>
                          <p className="text-xs text-muted-foreground">{report.date}</p>
                        </div>
                        <Badge variant={report.status === "Onaylandı" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                      </div>
                    ))}
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
