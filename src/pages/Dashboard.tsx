
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Clipboard, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  LogOut,
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
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
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

  // Role göre farklı kartlar
  const getStatsCards = () => {
    switch (user.role) {
      case "Yönetici":
        return [
          { title: "Aktif Şantiyeler", value: "12", icon: Building2, color: "bg-blue-500" },
          { title: "Toplam Personel", value: "84", icon: Users, color: "bg-green-500" },
          { title: "Bekleyen Raporlar", value: "7", icon: Clipboard, color: "bg-orange-500" },
          { title: "Kritik Stok", value: "3", icon: AlertTriangle, color: "bg-red-500" },
        ];
      case "Müdür":
        return [
          { title: "Yönettiğim Şantiyeler", value: "5", icon: Building2, color: "bg-blue-500" },
          { title: "Ekibim", value: "32", icon: Users, color: "bg-green-500" },
          { title: "Bugünkü Raporlar", value: "15", icon: Clipboard, color: "bg-orange-500" },
          { title: "Malzeme Talepleri", value: "8", icon: Package, color: "bg-purple-500" },
        ];
      case "Şantiye Şefi":
        return [
          { title: "Şantiyem", value: "1", icon: Building2, color: "bg-blue-500" },
          { title: "Ekip Mevcudu", value: "12", icon: Users, color: "bg-green-500" },
          { title: "Bugünkü Görevler", value: "8", icon: Clipboard, color: "bg-orange-500" },
          { title: "Malzeme Durumu", value: "İyi", icon: CheckCircle, color: "bg-green-500" },
        ];
      case "Personel":
        return [
          { title: "Bugünkü Görevlerim", value: "3", icon: Clipboard, color: "bg-orange-500" },
          { title: "Tamamlanan", value: "2", icon: CheckCircle, color: "bg-green-500" },
          { title: "Bekleyen", value: "1", icon: Clock, color: "bg-yellow-500" },
          { title: "Bu Ay Çalışma", value: "22 gün", icon: Users, color: "bg-blue-500" },
        ];
      default:
        return [];
    }
  };

  const getRecentActivities = () => {
    switch (user.role) {
      case "Yönetici":
        return [
          "Yeni personel kaydı: Mehmet Çelik",
          "Şantiye raporu onaylandı: Batıkent Projesi",
          "Malzeme talebi: 100 ton çimento",
          "Devamsızlık bildirimi: İstanbul Şantiyesi"
        ];
      case "Müdür":
        return [
          "Yeni görev atandı: Kalite kontrol",
          "Malzeme talebi onaylandı",
          "Şantiye ilerlemesi güncellendi",
          "Personel devam durumu güncellendi"
        ];
      case "Şantiye Şefi":
        return [
          "Günlük rapor gönderildi",
          "Malzeme talebi oluşturuldu",
          "Ekip toplantısı planlandı",
          "Kalite kontrol tamamlandı"
        ];
      case "Personel":
        return [
          "Yeni görev alındı: Betonarme işleri",
          "Rapor gönderildi",
          "Vardiya tamamlandı",
          "Güvenlik eğitimi hatırlatması"
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-orange-500 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">IzoEFE</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hoş geldiniz, {user.name}
            </h2>
            <p className="text-gray-600">
              {user.role} paneline erişiminiz bulunmaktadır.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {getStatsCards().map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>
                  Sistemdeki son hareketler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentActivities().map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-sm text-gray-700">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
                <CardDescription>
                  Sık kullanılan özellikler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {user.role === "Yönetici" && (
                    <>
                      <Button variant="outline" className="h-20 flex-col">
                        <Users className="h-5 w-5 mb-2" />
                        Personel Ekle
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Building2 className="h-5 w-5 mb-2" />
                        Şantiye Oluştur
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Clipboard className="h-5 w-5 mb-2" />
                        Raporları Görüntüle
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Package className="h-5 w-5 mb-2" />
                        Malzeme Yönetimi
                      </Button>
                    </>
                  )}
                  {user.role === "Müdür" && (
                    <>
                      <Button variant="outline" className="h-20 flex-col">
                        <Building2 className="h-5 w-5 mb-2" />
                        Şantiyelerim
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Users className="h-5 w-5 mb-2" />
                        Ekip Yönetimi
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Clipboard className="h-5 w-5 mb-2" />
                        Rapor Onayı
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Package className="h-5 w-5 mb-2" />
                        Malzeme Talepleri
                      </Button>
                    </>
                  )}
                  {user.role === "Şantiye Şefi" && (
                    <>
                      <Button variant="outline" className="h-20 flex-col">
                        <Clipboard className="h-5 w-5 mb-2" />
                        Günlük Rapor
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Package className="h-5 w-5 mb-2" />
                        Malzeme Talebi
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Users className="h-5 w-5 mb-2" />
                        Ekip Durumu
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <CheckCircle className="h-5 w-5 mb-2" />
                        Görev Takibi
                      </Button>
                    </>
                  )}
                  {user.role === "Personel" && (
                    <>
                      <Button variant="outline" className="h-20 flex-col">
                        <Clipboard className="h-5 w-5 mb-2" />
                        Rapor Gönder
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Clock className="h-5 w-5 mb-2" />
                        Görevlerim
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <CheckCircle className="h-5 w-5 mb-2" />
                        Vardiya Giriş
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Users className="h-5 w-5 mb-2" />
                        Profil
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
