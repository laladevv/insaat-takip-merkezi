
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Users, UserPlus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { user } = useCustomAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    role: "Personel"
  });

  // Get available role options based on current user's role
  const getRoleOptions = () => {
    if (!user) return [];
    
    if (user.role === "Yönetici") {
      return [
        { value: "Yönetici", label: "Yönetici" },
        { value: "Müdür", label: "Müdür" },
        { value: "Şantiye Şefi", label: "Şantiye Şefi" },
        { value: "Personel", label: "Personel" }
      ];
    } else if (user.role === "Müdür") {
      return [
        { value: "Şantiye Şefi", label: "Şantiye Şefi" },
        { value: "Personel", label: "Personel" }
      ];
    } else if (user.role === "Şantiye Şefi") {
      return [
        { value: "Personel", label: "Personel" }
      ];
    }
    return [];
  };

  const roleOptions = getRoleOptions();

  useEffect(() => {
    if (!user || !["Yönetici", "Müdür", "Şantiye Şefi"].includes(user.role)) {
      navigate("/dashboard");
      return;
    }
    
    // Set default role to the first available option
    const options = getRoleOptions();
    if (options.length > 0 && formData.role === "Personel" && !options.find(opt => opt.value === "Personel")) {
      setFormData(prev => ({ ...prev, role: options[0].value }));
    }
    
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kullanıcılar yüklenirken hata oluştu.",
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.name) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Tüm alanları doldurun.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .insert({
          username: formData.username,
          password_hash: await hashPassword(formData.password),
          name: formData.name,
          role: formData.role,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Başarılı!",
        description: "Kullanıcı başarıyla oluşturuldu.",
      });

      setFormData({ username: "", password: "", name: "", role: "Personel" });
      fetchUsers();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message?.includes("unique") 
          ? "Bu kullanıcı adı zaten kullanılıyor."
          : "Kullanıcı oluşturulurken hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const hashPassword = async (password: string) => {
    // Basit hash - gerçek uygulamada bcrypt kullanılmalı
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt123');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  if (!user || !["Yönetici", "Müdür", "Şantiye Şefi"].includes(user.role)) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="h-8 w-8 text-red-600" />
                    Kullanıcı Yönetimi
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Sistem kullanıcılarını yönetin ve yeni kullanıcılar oluşturun
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Yeni Kullanıcı Oluştur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Yeni Kullanıcı Oluştur
                  </CardTitle>
                  <CardDescription>
                    Sisteme yeni kullanıcı ekleyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Kullanıcı Adı</Label>
                      <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Kullanıcı adı girin"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Şifre</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Şifre girin"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ad soyad girin"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Mevcut Kullanıcılar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Mevcut Kullanıcılar
                  </CardTitle>
                  <CardDescription>
                    Sistemdeki tüm kullanıcılar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'Yönetici' ? 'bg-red-100 text-red-800' :
                            user.role === 'Şantiye Şefi' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'Müdür' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(user.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserManagement;
