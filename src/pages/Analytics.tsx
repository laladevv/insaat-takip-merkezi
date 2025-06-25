
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Package
} from "lucide-react";

interface User {
  email: string;
  role: string;
  name: string;
}

const Analytics = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedSite, setSelectedSite] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const sites = ["İstanbul Konut Projesi", "Ankara Plaza", "İzmir Rezidans"];
  const periods = [
    { value: "thisWeek", label: "Bu Hafta" },
    { value: "thisMonth", label: "Bu Ay" },
    { value: "lastMonth", label: "Geçen Ay" },
    { value: "thisYear", label: "Bu Yıl" }
  ];

  // Örnek veriler
  const overallStats = {
    totalRevenue: 2450000,
    totalCosts: 1890000,
    totalWorkers: 105,
    completedProjects: 3,
    activeProjects: 3,
    profitMargin: 22.9
  };

  const projectProgress = [
    { name: "İstanbul Konut Projesi", progress: 75, budget: 1200000, spent: 900000 },
    { name: "Ankara Plaza", progress: 45, budget: 850000, spent: 383000 },
    { name: "İzmir Rezidans", progress: 15, budget: 650000, spent: 98000 }
  ];

  const weeklyData = [
    { day: "Pzt", workers: 98, materials: 45000, efficiency: 85 },
    { day: "Sal", workers: 102, materials: 52000, efficiency: 88 },
    { day: "Çar", workers: 105, materials: 48000, efficiency: 90 },
    { day: "Per", workers: 103, materials: 55000, efficiency: 87 },
    { day: "Cum", workers: 108, materials: 61000, efficiency: 92 },
    { day: "Cmt", workers: 75, materials: 25000, efficiency: 78 },
    { day: "Paz", workers: 45, materials: 15000, efficiency: 70 }
  ];

  const materialUsage = [
    { name: "Çimento", used: 125, total: 200, cost: 106250 },
    { name: "Demir", used: 85, total: 120, cost: 1572500 },
    { name: "Tuğla", used: 15000, total: 20000, cost: 37500 },
    { name: "Kablo", used: 2200, total: 3000, cost: 55000 }
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Raporlama ve Analiz</h1>
                <p className="text-gray-600">Detaylı raporlar ve analiz sonuçları</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Rapor İndir
              </Button>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Gelir</p>
                    <p className="text-lg font-bold text-green-600">
                      {overallStats.totalRevenue.toLocaleString('tr-TR')} TL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Gider</p>
                    <p className="text-lg font-bold text-red-600">
                      {overallStats.totalCosts.toLocaleString('tr-TR')} TL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kar Marjı</p>
                    <p className="text-lg font-bold text-blue-600">%{overallStats.profitMargin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam İşçi</p>
                    <p className="text-lg font-bold text-purple-600">{overallStats.totalWorkers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Aktif Proje</p>
                    <p className="text-lg font-bold text-orange-600">{overallStats.activeProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-indigo-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tamamlanan</p>
                    <p className="text-lg font-bold text-indigo-600">{overallStats.completedProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Project Progress */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Proje İlerlemeleri
                </CardTitle>
                <CardDescription>Aktif projelerin bütçe ve ilerleme durumu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectProgress.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{project.name}</span>
                      <span className="text-sm text-muted-foreground">%{project.progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Harcanan: {project.spent.toLocaleString('tr-TR')} TL</span>
                      <span>Bütçe: {project.budget.toLocaleString('tr-TR')} TL</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Performance */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Haftalık Performans
                </CardTitle>
                <CardDescription>Son 7 günün performans verileri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{day.day}</div>
                        <div className="text-sm text-muted-foreground">
                          {day.workers} işçi • {day.materials.toLocaleString('tr-TR')} TL malzeme
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">%{day.efficiency}</div>
                        <div className="text-xs text-muted-foreground">verimlilik</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Material Usage */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Malzeme Kullanımı
                </CardTitle>
                <CardDescription>Malzeme tüketim analizi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {materialUsage.map((material, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{material.name}</span>
                      <span className="text-sm text-green-600 font-bold">
                        {material.cost.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(material.used / material.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Kullanılan: {material.used.toLocaleString('tr-TR')}</span>
                      <span>Toplam: {material.total.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Charts Placeholder */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-600 flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Grafik Analizi
                </CardTitle>
                <CardDescription>Detaylı grafik analizleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chart placeholder */}
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">Grafik Entegrasyonu</h3>
                      <p className="text-sm text-gray-600">
                        Recharts kütüphanesi ile detaylı grafikler burada görüntülenecek
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-600">85%</div>
                      <div className="text-xs text-muted-foreground">Ortalama Verimlilik</div>
                    </div>
                    <div className="p-3 bg-pink-50 rounded">
                      <div className="text-lg font-bold text-pink-600">12</div>
                      <div className="text-xs text-muted-foreground">Aktif Görev</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
