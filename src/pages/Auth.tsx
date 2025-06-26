
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, Lock } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    // Kaydedilmiş kullanıcı bilgilerini yükle
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
    
    checkUser();
  }, [navigate]);

  const saveCredentials = (email: string, password: string) => {
    if (rememberMe) {
      localStorage.setItem("rememberedCredentials", JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem("rememberedCredentials");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "E-posta ve şifre gerekli.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Giriş Hatası",
          description: "E-posta veya şifre hatalı.",
        });
      } else {
        saveCredentials(email, password);
        toast({
          title: "Başarılı!",
          description: "Giriş yapıldı. Yönlendiriliyorsunuz...",
        });
        navigate("/dashboard");
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
    setEmail("muharremcotur@izoefe.com");
    setPassword("efenaz55");
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "muharremcotur@izoefe.com",
        password: "efenaz55",
      });

      if (error) {
        // Eğer hesap yoksa oluştur
        const { error: signUpError } = await supabase.auth.signUp({
          email: "muharremcotur@izoefe.com",
          password: "efenaz55",
          options: {
            data: { 
              name: "Muharrem Cotur",
              role: "Yönetici"
            }
          }
        });

        if (signUpError) {
          toast({
            variant: "destructive",
            title: "Hata",
            description: "Yönetici hesabı oluşturulamadı: " + signUpError.message,
          });
        } else {
          toast({
            title: "Yönetici Hesabı Oluşturuldu",
            description: "Yönetici hesabı oluşturuldu ve giriş yapıldı!",
          });
          navigate("/dashboard");
        }
      } else {
        saveCredentials("muharremcotur@izoefe.com", "efenaz55");
        toast({
          title: "Yönetici Girişi",
          description: "Yönetici olarak giriş yapıldı!",
        });
        navigate("/dashboard");
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
              <Label htmlFor="signin-email">E-posta</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              K.Adı: muharremcotur@izoefe.com | Şifre: efenaz55
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
