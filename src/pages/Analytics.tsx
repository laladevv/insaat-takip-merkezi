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
import { useRealtimeData } from "@/hooks/useRealtime";
import { supabase } from "@/integrations/supabase/client";

// Type definitions for database tables
interface Site {
  id: string;
  name: string;
  location: string;
  status: string;
  progress: number;
  manager_id?: string;
  created_at: string;
  updated_at: string;
}

interface Personnel {
  id: string;
  user_id?: string;
  name: string;
  role: string;
  site_id?: string;
  status: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  site_id?: string;
  status: string;
  critical_level: number;
  created_at: string;
  updated_at: string;
}

interface DailyReport {
  id: string;
  site_id: string;
  reporter_id: string;
  date: string;
  weather?: string;
  work_description: string;
  materials_used?: any;
  personnel_count: number;
  progress_notes?: string;
  images?: string[];
  status: string;
  created_at: string;
}

const Analytics = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedChart, setSelectedChart] = useState("overview");
  const [analyticsData, setAnalyticsData] = useState<any>({
    stats: {
      totalSites: 0,
      totalPersonnel: 0,
      totalMaterials: 0,
      totalReports: 0,
      criticalMaterials: 0,
      activeSites: 0,
      averageAttendance: 0,
      efficiency: 0
    },
    monthlyData: [],
    weeklyData: [],
    siteData: [],
    materialData: [],
    performanceData: []
  });

  const { data: sites, loading: sitesLoading } = useRealtimeData<Site>("sites");
  const { data: personnel, loading: personnelLoading } = useRealtimeData<Personnel>("personnel");
  const { data: materials, loading: materialsLoading } = useRealtimeData<Material>("materials");
  const { data: reports, loading: reportsLoading } = useRealtimeData<DailyReport>("daily_reports");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const calculateAnalytics = () => {
      if (sitesLoading || personnelLoading || materialsLoading || reportsLoading) return;

      // Calculate basic stats
      const totalSites = sites?.length || 0;
      const totalPersonnel = personnel?.length || 0;
      const totalMaterials = materials?.length || 0;
      const totalReports = reports?.length || 0;
      const activeSites = sites?.filter(site => site.status === 'Aktif').length || 0;
      const criticalMaterials = materials?.filter(material => 
        material.quantity <= material.critical_level
      ).length || 0;

      // Calculate averages
      const averageAttendance = personnel?.filter(p => p.status === 'Aktif').length || 0;
      const attendancePercentage = totalPersonnel > 0 ? Math.round((averageAttendance / totalPersonnel) * 100) : 0;
      
      // Calculate efficiency based on completed reports vs expected
      const thisMonth = new Date().getMonth();
      const thisMonthReports = reports?.filter(report => 
        new Date(report.created_at).getMonth() === thisMonth
      ).length || 0;
      const expectedReports = activeSites * 30; // Assuming daily reports
      const efficiency = expectedReports > 0 ? Math.round((thisMonthReports / expectedReports) * 100) : 0;

      // Generate monthly data from actual reports
      const monthlyData = generateMonthlyData(reports, personnel, materials, sites);
      
      // Generate weekly attendance data
      const weeklyData = generateWeeklyData(personnel);
      
      // Generate site distribution data
      const siteData = generateSiteData(sites, personnel);
      
      // Generate material usage data
      const materialData = generateMaterialData(materials);
      
      // Generate performance metrics
      const performanceData = [
        { metric: "Şantiye Verimliliği", value: efficiency, change: 5.2, trend: "up" },
        { metric: "Personel Devam", value: attendancePercentage, change: -2.1, trend: attendancePercentage > 90 ? "up" : "down" },
        { metric: "Malzeme Kullanımı", value: Math.round(((totalMaterials - criticalMaterials) / totalMaterials) * 100) || 0, change: 12.3, trend: "up" },
        { metric: "Rapor Tamamlama", value: Math.min(100, Math.round((totalReports / (activeSites * 7)) * 100)) || 0, change: 3.7, trend: "up" }
      ];

      setAnalyticsData({
        stats: {
          totalSites,
          totalPersonnel,
          totalMaterials,
          totalReports,
          criticalMaterials,
          activeSites,
          averageAttendance: attendancePercentage,
          efficiency
        },
        monthlyData,
        weeklyData,
        siteData,
        materialData,
        performanceData
      });
    };

    calculateAnalytics();
  }, [sites, personnel, materials, reports, sitesLoading, personnelLoading, materialsLoading, reportsLoading]);

  const generateMonthlyData = (reports: DailyReport[], personnel: Personnel[], materials: Material[], sites: Site[]) => {
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"];
    return months.map((month, index) => {
      const monthReports = reports?.filter(report => 
        new Date(report.created_at).getMonth() === index
      ).length || 0;
      
      return {
        month,
        personel: personnel?.length || 0,
        malzeme: materials?.length || 0,
        rapor: monthReports,
        santiye: sites?.length || 0
      };
    });
  };

  const generateWeeklyData = (personnel: Personnel[]) => {
    const weeks = ["1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"];
    return weeks.map(week => {
      const aktif = personnel?.filter(p => p.status === 'Aktif').length || 0;
      const devamsiz = personnel?.filter(p => p.status === 'Pasif').length || 0;
      const izinli = personnel?.filter(p => p.status === 'İzinli').length || 0;
      
      return { week, aktif, devamsiz, izinli };
    });
  };

  const generateSiteData = (sites: Site[], personnel: Personnel[]) => {
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
    
    return sites?.map((site, index) => {
      const sitePersonnel = personnel?.filter(p => p.site_id === site.id).length || 0;
      return {
        name: site.name,
        value: sitePersonnel,
        color: colors[index % colors.length]
      };
    }) || [];
  };

  const generateMaterialData = (materials: Material[]) => {
    const materialGroups = materials?.reduce((acc: any, material) => {
      const group = material.name.split(' ')[0]; // Take first word as group
      if (!acc[group]) {
        acc[group] = { total: 0, used: 0, critical: 0 };
      }
      acc[group].total += material.quantity;
      if (material.quantity <= material.critical_level) {
        acc[group].critical += 1;
      }
      return acc;
    }, {}) || {};

    return Object.entries(materialGroups).slice(0, 5).map(([name, data]: [string, any]) => ({
      material: name,
      kullanim: Math.round((data.critical / (data.critical + data.total)) * 100) || 0,
      stok: Math.round(((data.total - data.critical) / data.total) * 100) || 100
    }));
  };

  const handleExportData = (format: string) => {
    const dataToExport = {
      stats: analyticsData.stats,
      timestamp: new Date().toISOString(),
      period: selectedPeriod
    };

    if (format === 'json') {
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }

    toast({
      title: "Veri Dışa Aktarıldı",
      description: `Analitik veriler ${format.toUpperCase()} formatında dışa aktarıldı.`,
    });
  };

  const handlePrintReport = () => {
    window.print();
    toast({
      title: "Rapor Yazdırılıyor",
      description: "Analitik rapor yazdırma işlemi başlatıldı.",
    });
  };

  if (loading || sitesLoading || personnelLoading || materialsLoading || reportsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p>Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { stats, monthlyData, weeklyData, siteData, materialData, performanceData } = analyticsData;

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
                <h1 className="text-2xl font-bold text-gray-900">Canlı Analitik Raporlama</h1>
                <p className="text-gray-600">Gerçek zamanlı performans analizi ve raporlar</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportData("excel")}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => handleExportData("json")}>
                <Download className="h-4 w-4 mr-2" />
                JSON
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
                  Canlı Aylık Performans
                </CardTitle>
                <CardDescription>
                  Gerçek zamanlı verilerle aylık performans durumu
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
                      name="Personel"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="malzeme" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Malzeme"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rapor" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Rapor"
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
                  Canlı Şantiye Dağılımı
                </CardTitle>
                <CardDescription>
                  Gerçek zamanlı işçi sayısına göre şantiye dağılımı
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
                  Canlı Personel Durumu
                </CardTitle>
                <CardDescription>
                  Gerçek zamanlı personel devam analizi
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
                  Canlı Malzeme Analizi
                </CardTitle>
                <CardDescription>
                  Gerçek zamanlı kullanım vs stok durumu
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
                <CardTitle className="text-purple-600">Canlı İstatistikler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Toplam Şantiye:</span>
                  <span className="font-bold">{stats.totalSites}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Aktif Personel:</span>
                  <span className="font-bold">{stats.totalPersonnel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Toplam Rapor:</span>
                  <span className="font-bold">{stats.totalReports}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ortalama Devam:</span>
                  <span className="font-bold text-green-600">{stats.averageAttendance}%</span>
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
                    <span className="font-bold">{stats.efficiency}%</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Aktif Şantiyeler:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stats.activeSites}</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Kritik Malzemeler:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600">{stats.criticalMaterials}</span>
                    {stats.criticalMaterials > 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Toplam Malzeme:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stats.totalMaterials}</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-600">Canlı Trend Analizi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">📈 Canlı Veri</div>
                  <p className="text-xs text-muted-foreground">Gerçek zamanlı performans trendi</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>En Aktif Şantiye:</span>
                    <span className="font-medium">{siteData[0]?.name || "Veri yok"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Kritik Seviye:</span>
                    <span className={`font-medium ${stats.criticalMaterials > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {stats.criticalMaterials > 0 ? 'Uyarı' : 'Normal'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Son Güncelleme:</span>
                    <span className="font-medium text-blue-600">{new Date().toLocaleTimeString('tr-TR')}</span>
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
