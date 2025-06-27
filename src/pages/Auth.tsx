
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Building2, User, Lock } from "lucide-react";
import { useCustomAuth } from "@/hooks/useCustomAuth";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useCustomAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Kaydedilmiş kullanıcı bilgilerini yükle
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      const { username: savedUsername, password: savedPassword } = JSON.parse(savedCredentials);
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const saveCredentials = (username: string, password: string) => {
    if (rememberMe) {
      localStorage.setItem("rememberedCredentials", JSON.stringify({ username, password }));
    } else {
      localStorage.removeItem("rememberedCredentials");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kullanıcı adı ve şifre gerekli.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(username, password);
      
      if (result.success) {
        saveCredentials(username, password);
        toast({
          title: "Başarılı!",
          description: "Giriş yapıldı. Yönlendiriliyorsunuz...",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Giriş Hatası",
          description: result.error || "Kullanıcı adı veya şifre hatalı.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Demo yönetici hesabı ile hızlı giriş
  const handleAdminLogin = async () => {
    setUsername("ozgur");
    setPassword("1234");
    setLoading(true);
    
    try {
      const result = await signIn("ozgur", "1234");
      
      if (result.success) {
        saveCredentials("ozgur", "1234");
        toast({
          title: "Yönetici Girişi",
          description: "Yönetici olarak giriş yapıldı!",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: result.error || "Yönetici girişi başarısız.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">IzoEFE</CardTitle>
          <CardDescription>Şantiye Yönetim Sistemi - Giriş</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-username">Kullanıcı Adı</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signin-username"
                  type="text"
                  placeholder="Kullanıcı adınızı girin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">Beni Hatırla</Label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600"
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={handleAdminLogin}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              disabled={loading}
            >
              👨‍💼 Yönetici Hesabı ile Giriş
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              K.Adı: ozgur | Şifre: 1234
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
