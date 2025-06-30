
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Building2,
  Package,
  FileText,
  Calendar,
  Download,
  Printer
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

const Analytics = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedChart, setSelectedChart] = useState("overview");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Sample data for charts
  const monthlyData = [
    { month: "Ocak", personel: 120, malzeme: 85, rapor: 95, santiye: 3 },
    { month: "Şubat", personel: 135, malzeme: 92, rapor: 88, santiye: 3 },
    { month: "Mart", personel: 142, malzeme: 78, rapor: 102, santiye: 4 },
    { month: "Nisan", personel: 158, malzeme: 95, rapor: 115, santiye: 4 },
    { month: "Mayıs", personel: 167, malzeme: 89, rapor: 125, santiye: 5 },
    { month: "Haziran", personel: 175, malzeme: 96, rapor: 132, santiye: 5 }
  ];

  const weeklyData = [
    { week: "1. Hafta", aktif: 45, devamsiz: 5, izinli: 3 },
    { week: "2. Hafta", aktif: 48, devamsiz: 2, izinli: 4 },
    { week: "3. Hafta", aktif: 43, devamsiz: 7, izinli: 2 },
    { week: "4. Hafta", aktif: 50, devamsiz: 3, izinli: 1 }
  ];

  const siteData = [
    { name: "İstanbul Konut", value: 45, color: "#ef4444" },
    { name: "Ankara Plaza", value: 32, color: "#3b82f6" },
    { name: "İzmir Rezidans", value: 18, color: "#10b981" },
    { name: "Bursa AVM", value: 25, color: "#f59e0b" }
  ];

  const materialData = [
    { material: "Çimento", kullanim: 85, stok: 65 },
    { material: "Demir", kullanim: 78, stok: 45 },
    { material: "Boya", kullanim: 45, stok: 80 },
    { material: "Cam", kullanim: 32, stok: 90 },
    { material: "Seramik", kullanim: 67, stok: 55 }
  ];

  const performanceData = [
    { metric: "Şantiye Verimliliği", value: 87, change: 5.2, trend: "up" },
    { metric: "Personel Devam", value: 92, change: -2.1, trend: "down" },
    { metric: "Malzeme Kullanımı", value: 78, change: 12.3, trend: "up" },
    { metric: "Rapor Tamamlama", value: 95, change: 3.7, trend: "up" }
  ];

  const handleExportData = (format: string) => {
    toast({
      title: "Veri Dışa Aktarılıyor",
      description: `Analitik veriler ${format.toUpperCase()} formatında dışa aktarılıyor...`,
    });
  };

  const handlePrintReport = () => {
    window.print();
    toast({
      title: "Rapor Yazdırılıyor",
      description: "Analitik rapor yazdırma işlemi başlatıldı.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
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
                <h1 className="text-2xl font-bold text-gray-900">Analitik Raporlama</h1>
                <p className="text-gray-600">Detaylı performans analizi ve raporlar</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportData("excel")}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => handleExportData("pdf")}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={handlePrintReport}>
                <Printer className="h-4 w-4 mr-2" />
                Yazdır
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Bu Hafta</SelectItem>
                <SelectItem value="month">Bu Ay</SelectItem>
                <SelectItem value="quarter">Bu Çeyrek</SelectItem>
                <SelectItem value="year">Bu Yıl</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedChart} onValueChange={setSelectedChart}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Genel Bakış</SelectItem>
                <SelectItem value="personnel">Personel Analizi</SelectItem>
                <SelectItem value="materials">Malzeme Analizi</SelectItem>
                <SelectItem value="sites">Şantiye Analizi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {performanceData.map((metric, index) => (
              <Card key={index} className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-xs ${
                          metric.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {Math.abs(metric.change)}%
                        </span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Activity className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Overview Chart */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Aylık Performans
                </CardTitle>
                <CardDescription>
                  Son 6 ayın genel performans durumu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="personel" 
                      stackId="1"
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="malzeme" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rapor" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Site Distribution */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Şantiye Dağılımı
                </CardTitle>
                <CardDescription>
                  İşçi sayısına göre şantiye dağılımı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={siteData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {siteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Attendance & Material Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Weekly Attendance */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Haftalık Devam Durumu
                </CardTitle>
                <CardDescription>
                  Son 4 haftanın devam analizi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="aktif" fill="#10b981" name="Aktif" />
                    <Bar dataKey="devamsiz" fill="#ef4444" name="Devamsız" />
                    <Bar dataKey="izinli" fill="#f59e0b" name="İzinli" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Material Usage */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-600 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Malzeme Kullanım Analizi
                </CardTitle>
                <CardDescription>
                  Kullanım vs stok durumu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={materialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="kullanim" fill="#f59e0b" name="Kullanım %" />
                    <Bar dataKey="stok" fill="#10b981" name="Stok %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-600">Özet İstatistikler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Toplam Şantiye:</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Aktif Personel:</span>
                  <span className="font-bold">175</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bu Ay Rapor:</span>
                  <span className="font-bold">132</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ortalama Devam:</span>
                  <span className="font-bold text-green-600">92%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-600">Performans Göstergeleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Verimlilik:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">87%</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Kalite Skoru:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">94%</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Güvenlik:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">99%</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maliyet Kontrolü:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">82%</span>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-600">Trend Analizi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">↗️ Yükseliş</div>
                  <p className="text-xs text-muted-foreground">Genel performans trendi</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>En İyi Performans:</span>
                    <span className="font-medium">İstanbul Konut</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>İyileştirme Gereken:</span>
                    <span className="font-medium">İzmir Rezidans</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Kritik Malzeme:</span>
                    <span className="font-medium text-red-600">Demir</span>
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
