
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Users, 
  Package, 
  FileText, 
  Bell, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSites: 0,
    totalPersonnel: 0,
    totalMaterials: 0,
    totalReports: 0,
    criticalMaterials: 0,
    activeSites: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      console.log("Fetching stats...");
      
      // Şantiyeler
      const { data: sites, error: sitesError } = await supabase
        .from("sites")
        .select("*");
      
      if (sitesError) {
        console.error("Sites error:", sitesError);
      }
      
      // Personel
      const { data: personnel, error: personnelError } = await supabase
        .from("personnel")
        .select("*");
      
      if (personnelError) {
        console.error("Personnel error:", personnelError);
      }
      
      // Malzemeler
      const { data: materials, error: materialsError } = await supabase
        .from("materials")
        .select("*");
      
      if (materialsError) {
        console.error("Materials error:", materialsError);
      }
      
      // Raporlar
      const { data: reports, error: reportsError } = await supabase
        .from("daily_reports")
        .select("*");
      
      if (reportsError) {
        console.error("Reports error:", reportsError);
      }

      // Kritik seviyedeki malzemeler
      const criticalMaterials = materials?.filter(m => m.quantity <= m.critical_level) || [];
      
      // Aktif şantiyeler
      const activeSites = sites?.filter(s => s.status === "Aktif") || [];

      setStats({
        totalSites: sites?.length || 0,
        totalPersonnel: personnel?.length || 0,
        totalMaterials: materials?.length || 0,
        totalReports: reports?.length || 0,
        criticalMaterials: criticalMaterials.length,
        activeSites: activeSites.length
      });

      console.log("Stats updated:", {
        totalSites: sites?.length || 0,
        totalPersonnel: personnel?.length || 0,
        totalMaterials: materials?.length || 0,
        totalReports: reports?.length || 0,
        criticalMaterials: criticalMaterials.length,
        activeSites: activeSites.length
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleNavigateToPage = (path: string) => {
    navigate(path);
  };

  const handleRefreshStats = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickStats = [
    {
      title: "Toplam Şantiye",
      value: stats.totalSites,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => handleNavigateToPage("/sites")
    },
    {
      title: "Aktif Şantiye",
      value: stats.activeSites,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      onClick: () => handleNavigateToPage("/sites")
    },
    {
      title: "Toplam Personel",
      value: stats.totalPersonnel,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: () => handleNavigateToPage("/personnel")
    },
    {
      title: "Toplam Malzeme",
      value: stats.totalMaterials,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: () => handleNavigateToPage("/materials")
    },
    {
      title: "Günlük Rapor",
      value: stats.totalReports,
      icon: FileText,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      onClick: () => handleNavigateToPage("/reports")
    },
    {
      title: "Kritik Malzeme",
      value: stats.criticalMaterials,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      onClick: () => handleNavigateToPage("/materials")
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Hoş Geldiniz, {user.name}!
                  </h1>
                  <p className="text-gray-600 mt-1">
                    IzoEFE Şantiye Yönetim Sistemi Dashboard
                  </p>
                  <Badge variant="outline" className="mt-2 border-red-500 text-red-600">
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshStats}
                  className="hover:bg-gray-100"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigateToPage("/notifications")}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  {stats.criticalMaterials > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-5 h-5">
                      {stats.criticalMaterials}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={stat.onClick}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigateToPage("/sites")}>
                <CardHeader className="text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-red-600" />
                  <CardTitle className="text-lg">Şantiye Yönetimi</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Şantiyelerinizi yönetin ve durumlarını takip edin
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigateToPage("/personnel")}>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <CardTitle className="text-lg">Personel Yönetimi</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Çalışanlarınızı organize edin ve takip edin
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigateToPage("/materials")}>
                <CardHeader className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                  <CardTitle className="text-lg">Malzeme Yönetimi</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Stok durumunu kontrol edin ve yönetin
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigateToPage("/reports")}>
                <CardHeader className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <CardTitle className="text-lg">Günlük Raporlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Günlük aktiviteleri raporlayın
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {stats.criticalMaterials > 0 && (
              <Card className="border-red-200 bg-red-50 mb-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-red-800">Kritik Uyarı</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-red-700">
                    {stats.criticalMaterials} adet malzeme kritik seviyede. 
                    <Button 
                      variant="link" 
                      className="text-red-600 p-0 ml-2 h-auto"
                      onClick={() => handleNavigateToPage("/materials")}
                    >
                      Hemen kontrol edin →
                    </Button>
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
