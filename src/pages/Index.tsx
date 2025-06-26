
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Package, 
  FileText, 
  BarChart3, 
  MapPin,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-red-600">IzoEFE</h1>
          </div>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
              Giriş Yap / Kayıt Ol
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 border-red-500 text-red-600">
            Şantiye Yönetim Sistemi
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Modern <span className="text-red-600">Şantiye</span> Yönetimi
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            İnşaat projelerinizi dijital platformda yönetin. Personel takibi, malzeme yönetimi, 
            günlük raporlama ve gerçek zamanlı analitik özelliklerle şantiyelerinizi daha verimli hale getirin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
                Hemen Başla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Demo İzle
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Güçlü Özellikler</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            İnşaat projelerinizi yönetmek için ihtiyacınız olan tüm araçlar bir arada
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building2 className="h-10 w-10 text-red-500 mb-2" />
              <CardTitle className="text-red-600">Şantiye Yönetimi</CardTitle>
              <CardDescription>
                Tüm şantiyelerinizi tek yerden görüntüleyin ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Proje takibi</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />İlerleme raporları</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Lokasyon yönetimi</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle className="text-blue-600">Personel Takibi</CardTitle>
              <CardDescription>
                Çalışanlarınızı takip edin ve devamsızlık durumlarını yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Devamsızlık takibi</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Vardiya yönetimi</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Performans analizi</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Package className="h-10 w-10 text-red-500 mb-2" />
              <CardTitle className="text-red-600">Malzeme Yönetimi</CardTitle>
              <CardDescription>
                Stok durumunu takip edin ve malzeme taleplerini yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Stok takibi</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Kritik seviye uyarıları</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Tedarikçi yönetimi</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle className="text-blue-600">Günlük Raporlama</CardTitle>
              <CardDescription>
                Şantiyelerden günlük raporlar alın ve onaylayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Dijital raporlar</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Fotoğraf ekleme</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Onay sistemi</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-red-500 mb-2" />
              <CardTitle className="text-red-600">Analitik & Raporlar</CardTitle>
              <CardDescription>
                Detaylı analitikler ile projelerinizi optimize edin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Performans metrikleri</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Maliyet analizi</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Trend raporları</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <MapPin className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle className="text-blue-600">Konum Takibi</CardTitle>
              <CardDescription>
                Şantiyelerinizi harita üzerinde görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Harita entegrasyonu</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />GPS koordinatları</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Rota planlaması</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl mx-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden IzoEFE?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Modern inşaat yönetimi için tasarlanmış, kullanıcı dostu arayüz ve güvenilir altyapı
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hızlı ve Verimli</h3>
            <p className="text-gray-600">
              Gerçek zamanlı veri senkronizasyonu ile anında güncellemeler alın
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenli</h3>
            <p className="text-gray-600">
              Verileriniz enterprise seviyesinde güvenlik ile korunur
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Kullanıcı Dostu</h3>
            <p className="text-gray-600">
              Sezgisel arayüz ile herkes kolayca kullanabilir
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Şantiyelerinizi Dijitalleştirin
          </h2>
          <p className="text-gray-600 mb-8">
            Hemen başlayın ve inşaat projelerinizi daha verimli yönetin
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
              Ücretsiz Deneyin
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Building2 className="h-8 w-8 text-red-500" />
            <h3 className="text-2xl font-bold">IzoEFE</h3>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 IzoEFE. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
