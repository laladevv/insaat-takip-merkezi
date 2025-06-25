
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
  Key,
  Mail,
  Phone
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  email: string;
  role: string;
  name: string;
}

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "IzoEFE İnşaat",
    position: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    criticalAlerts: true,
    materialAlerts: true,
    reportAlerts: true,
    attendanceAlerts: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    sessionTimeout: "8"
  });

  const [systemSettings, setSystemSettings] = useState({
    language: "tr",
    timezone: "Europe/Istanbul",
    dateFormat: "dd/mm/yyyy",
    currency: "TRY",
    autoBackup: true,
    backupFrequency: "daily"
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setProfileData({
        name: userData.name,
        email: userData.email,
        phone: "",
        company: "IzoEFE İnşaat",
        position: userData.role
      });
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleProfileSave = () => {
    // Profil bilgilerini kaydet
    const updatedUser = { ...user, name: profileData.name, email: profileData.email };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Başarılı",
      description: "Profil bilgileri güncellendi.",
    });
  };

  const handlePasswordChange = () => {
    if (!securitySettings.currentPassword || !securitySettings.newPassword) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen tüm şifre alanlarını doldurun.",
      });
      return;
    }

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
      });
      return;
    }

    if (securitySettings.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Şifre en az 6 karakter olmalıdır.",
      });
      return;
    }

    // Şifre değiştirme işlemi
    setSecuritySettings({
      ...securitySettings,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    toast({
      title: "Başarılı",
      description: "Şifre başarıyla değiştirildi.",
    });
  };

  const handleNotificationSave = () => {
    toast({
      title: "Başarılı",
      description: "Bildirim ayarları güncellendi.",
    });
  };

  const handleSystemSave = () => {
    toast({
      title: "Başarılı",
      description: "Sistem ayarları güncellendi.",
    });
  };

  if (!user) {
    return <div>Yükleniyor...</div>;
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
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <SettingsIcon className="h-7 w-7 text-red-600" />
                  Ayarlar
                </h1>
                <p className="text-gray-600">Sistem ve hesap ayarlarını yönetin</p>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-red-100">
              <TabsTrigger value="profile" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                Profil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Bildirimler
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                Güvenlik
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Sistem
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profil Bilgileri
                  </CardTitle>
                  <CardDescription>
                    Kişisel bilgilerinizi görüntüleyin ve düzenleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="0532 123 45 67"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Pozisyon</Label>
                      <Input
                        id="position"
                        value={profileData.position}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Şirket</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleProfileSave} className="bg-red-500 hover:bg-red-600">
                      <Save className="h-4 w-4 mr-2" />
                      Kaydet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Bildirim Ayarları
                  </CardTitle>
                  <CardDescription>
                    Bildirim tercihlerinizi yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Genel Bildirimler</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">Email Bildirimleri</p>
                          <p className="text-sm text-muted-foreground">Email ile bildirim al</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium">SMS Bildirimleri</p>
                          <p className="text-sm text-muted-foreground">SMS ile bildirim al</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="font-medium">Push Bildirimleri</p>
                          <p className="text-sm text-muted-foreground">Tarayıcı bildirimleri</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: checked
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Özel Bildirimler</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Kritik Uyarılar</p>
                        <p className="text-sm text-muted-foreground">Acil durumlar ve güvenlik uyarıları</p>
                      </div>
                      <Switch
                        checked={notificationSettings.criticalAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          criticalAlerts: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Malzeme Uyarıları</p>
                        <p className="text-sm text-muted-foreground">Stok ve malzeme talepleri</p>
                      </div>
                      <Switch
                        checked={notificationSettings.materialAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          materialAlerts: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rapor Bildirimleri</p>
                        <p className="text-sm text-muted-foreground">Günlük rapor onayları</p>
                      </div>
                      <Switch
                        checked={notificationSettings.reportAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          reportAlerts: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Devamsızlık Uyarıları</p>
                        <p className="text-sm text-muted-foreground">Personel devamsızlık bildirimleri</p>
                      </div>
                      <Switch
                        checked={notificationSettings.attendanceAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          attendanceAlerts: checked
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleNotificationSave} className="bg-blue-500 hover:bg-blue-600">
                      <Save className="h-4 w-4 mr-2" />
                      Kaydet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Şifre Değiştir
                    </CardTitle>
                    <CardDescription>
                      Hesap şifrenizi güvenli bir şifre ile değiştirin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          currentPassword: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Yeni Şifre</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          newPassword: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          confirmPassword: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handlePasswordChange} className="bg-red-500 hover:bg-red-600">
                        <Save className="h-4 w-4 mr-2" />
                        Şifreyi Değiştir
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Güvenlik Ayarları
                    </CardTitle>
                    <CardDescription>
                      Hesap güvenlik ayarlarını yönetin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">İki Faktörlü Doğrulama</p>
                        <p className="text-sm text-muted-foreground">Ekstra güvenlik katmanı ekle</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({
                          ...securitySettings,
                          twoFactorAuth: checked
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (saat)</Label>
                      <Select value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: value
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Saat</SelectItem>
                          <SelectItem value="4">4 Saat</SelectItem>
                          <SelectItem value="8">8 Saat</SelectItem>
                          <SelectItem value="24">24 Saat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Sistem Ayarları
                  </CardTitle>
                  <CardDescription>
                    Genel sistem ayarlarını yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Dil</Label>
                      <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({
                        ...systemSettings,
                        language: value
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tr">Türkçe</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Saat Dilimi</Label>
                      <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({
                        ...systemSettings,
                        timezone: value
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Istanbul">İstanbul (GMT+3)</SelectItem>
                          <SelectItem value="Europe/London">Londra (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Tarih Formatı</Label>
                      <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({
                        ...systemSettings,
                        dateFormat: value
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd/mm/yyyy">GG/AA/YYYY</SelectItem>
                          <SelectItem value="mm/dd/yyyy">AA/GG/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-AA-GG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Para Birimi</Label>
                      <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({
                        ...systemSettings,
                        currency: value
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRY">TRY (₺)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Yedekleme Ayarları</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Otomatik Yedekleme</p>
                        <p className="text-sm text-muted-foreground">Verileri otomatik olarak yedekle</p>
                      </div>
                      <Switch
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => setSystemSettings({
                          ...systemSettings,
                          autoBackup: checked
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Yedekleme Sıklığı</Label>
                      <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings({
                        ...systemSettings,
                        backupFrequency: value
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Saatlik</SelectItem>
                          <SelectItem value="daily">Günlük</SelectItem>
                          <SelectItem value="weekly">Haftalık</SelectItem>
                          <SelectItem value="monthly">Aylık</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSystemSave} className="bg-blue-500 hover:bg-blue-600">
                      <Save className="h-4 w-4 mr-2" />
                      Kaydet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
