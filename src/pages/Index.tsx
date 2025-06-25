
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Shield, Users, Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Geçici kullanıcı verileri - gerçek projede Supabase authentication kullanılacak
const users = [
  { email: "admin@izoefe.com", password: "admin123", role: "Yönetici", name: "Ahmet Yönetici" },
  { email: "mudur@izoefe.com", password: "mudur123", role: "Müdür", name: "Mehmet Müdür" },
  { email: "sef@izoefe.com", password: "sef123", role: "Şantiye Şefi", name: "Ali Şef" },
  { email: "personel@izoefe.com", password: "personel123", role: "Personel", name: "Ayşe Personel" }
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Geçici giriş kontrolü
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem("user", JSON.stringify(user));
      
      toast({
        title: "Giriş Başarılı",
        description: `Hoş geldiniz, ${user.name}!`,
      });
      
      // Role göre yönlendirme
      navigate("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Giriş Hatası",
        description: "Email veya şifre hatalı!",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IzoEFE</h1>
          <p className="text-gray-600">Şantiye Yönetim Sistemi</p>
        </div>

        {/* Giriş Formu */}
        <Card className="shadow-lg border-2 border-red-100">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Sisteme Giriş</CardTitle>
            <CardDescription className="text-center">
              Email ve şifrenizi girerek sisteme giriş yapın
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Hesapları */}
        <Card className="mt-6 bg-gradient-to-br from-blue-50 to-red-50 border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="text-sm text-blue-600">Demo Hesapları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center space-x-2 p-2 bg-white rounded border border-red-100">
                <Shield className="h-4 w-4 text-red-500" />
                <div>
                  <div className="font-medium">Yönetici</div>
                  <div className="text-gray-600">admin@izoefe.com / admin123</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border border-blue-100">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">Müdür</div>
                  <div className="text-gray-600">mudur@izoefe.com / mudur123</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border border-red-100">
                <Building2 className="h-4 w-4 text-red-500" />
                <div>
                  <div className="font-medium">Şantiye Şefi</div>
                  <div className="text-gray-600">sef@izoefe.com / sef123</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border border-blue-100">
                <Clipboard className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">Personel</div>
                  <div className="text-gray-600">personel@izoefe.com / personel123</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
