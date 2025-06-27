
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Package, FileText, BarChart3, MapPin, Bell, Calendar } from "lucide-react";
import { useCustomAuth } from "@/hooks/useCustomAuth";

const Index = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

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

  const features = [
    {
      icon: Building2,
      title: "Şantiye Yönetimi",
      description: "Tüm şantiyelerinizi tek yerden yönetin, ilerleme durumlarını takip edin."
    },
    {
      icon: Users,
      title: "Personel Takibi",
      description: "Çalışanlarınızı organize edin, görevlerini ve durumlarını izleyin."
    },
    {
      icon: Package,
      title: "Malzeme Kontrolü",
      description: "Stok durumunu takip edin, kritik seviyelerde otomatik uyarılar alın."
    },
    {
      icon: FileText,
      title: "Günlük Raporlar",
      description: "Şantiye ilerlemelerini günlük raporlarla detaylı şekilde kaydedin."
    },
    {
      icon: BarChart3,
      title: "Analiz ve İstatistik",
      description: "Performans analizleri ile projelerinizi optimize edin."
    },
    {
      icon: MapPin,
      title: "Harita Entegrasyonu",
      description: "Şantiye lokasyonlarını harita üzerinde görüntüleyin."
    },
    {
      icon: Bell,
      title: "Anlık Bildirimler",
      description: "Önemli gelişmelerden gerçek zamanlı haberdar olun."
    },
    {
      icon: Calendar,
      title: "Devam Takibi",
      description: "Personel devam durumlarını takip edin ve analiz edin."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Building2 className="h-20 w-20 text-red-600" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            IzoEFE
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Şantiye Yönetim Sistemi
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            İnşaat projelerinizi dijital ortamda yönetin. Şantiye operasyonlarınızı 
            optimize edin, verimliliği artırın.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
              onClick={() => navigate("/auth")}
            >
              Hemen Başlayın
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50 px-8 py-4 text-lg"
              onClick={() => navigate("/auth")}
            >
              Giriş Yap
            </Button>
          </div>

          <div className="mt-8 p-4 bg-white/70 rounded-lg max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 mb-2">🔑 Demo Hesap</h3>
            <p className="text-sm text-gray-600">
              <strong>Kullanıcı Adı:</strong> ozgur<br />
              <strong>Şifre:</strong> 1234
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-white/50 bg-white/70">
              <CardHeader className="text-center">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-red-600" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/70 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Neden IzoEFE?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">%40</div>
              <p className="text-gray-600">Zaman Tasarrufu</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">%60</div>
              <p className="text-gray-600">Verimlilik Artışı</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">7/24</div>
              <p className="text-gray-600">Gerçek Zamanlı Monitoring</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-red-500 to-blue-500 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Hemen Başlayın!</CardTitle>
              <CardDescription className="text-white/90">
                Şantiye yönetiminizi dijitalleştirin ve farkı yaşayın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-red-600 hover:bg-gray-100"
                onClick={() => navigate("/auth")}
              >
                Ücretsiz Deneyin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-gray-600">
            © 2024 IzoEFE Şantiye Yönetim Sistemi. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
