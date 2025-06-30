
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Key,
  Save,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    role: string;
    department: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    critical: boolean;
    reports: boolean;
    attendance: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginNotifications: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: string;
    dateFormat: string;
    numberFormat: string;
  };
  system: {
    autoBackup: boolean;
    backupFrequency: string;
    dataRetention: number;
    auditLogs: boolean;
  };
}

const Settings = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: user?.name || "Kullanıcı",
      email: "kullanici@izoefe.com",
      phone: "+90 532 123 4567",
      avatar: "",
      role: user?.role || "Personel",
      department: "İnşaat"
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      critical: true,
      reports: true,
      attendance: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginNotifications: true
    },
    preferences: {
      language: "tr",
      timezone: "Europe/Istanbul",
      theme: "light",
      dateFormat: "DD/MM/YYYY",
      numberFormat: "tr-TR"
    },
    system: {
      autoBackup: true,
      backupFrequency: "daily",
      dataRetention: 365,
      auditLogs: true
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSaveSettings = (section: keyof UserSettings) => {
    toast({
      title: "Ayarlar Kaydedildi",
      description: `${section} ayarları başarıyla güncellendi.`,
    });
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen tüm şifre alanlarını doldurun.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yeni şifreler uyuşmuyor.",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Şifre en az 8 karakter olmalıdır.",
      });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(false);

    toast({
      title: "Şifre Değiştirildi",
      description: "Şifreniz başarıyla güncellendi.",
    });
  };

  const handleAvatarUpload = () => {
    toast({
      title: "Fotoğraf Yükleniyor",
      description: "Profil fotoğrafı yükleme işlemi başlatıldı.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Veri Dışa Aktarılıyor",
      description: "Kişisel verileriniz dışa aktarılıyor...",
    });
  };

  const handleBackupNow = () => {
    setIsBackupDialogOpen(false);
    toast({
      title: "Yedekleme Başlatıldı",
      description: "Sistem verileri yedekleniyor...",
    });
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Tüm ayarları varsayılan değerlere döndürmek istediğinizden emin misiniz?")) {
      toast({
        title: "Ayarlar Sıfırlandı",
        description: "Tüm ayarlar varsayılan değerlere döndürüldü.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
                <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
                <p className="text-gray-600">Sistem ve kullanıcı ayarlarını yönetin</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Veriyi Dışa Aktar
              </Button>
              <Button variant="outline" onClick={handleResetToDefaults}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Varsayılana Sıfırla
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Bildirimler
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Güvenlik
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Tercihler
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Sistem
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Profil Bilgileri</CardTitle>
                  <CardDescription>
                    Kişisel bilgilerinizi güncelleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={settings.profile.avatar} />
                      <AvatarFallback className="bg-red-100 text-red-600 text-xl">
                        {settings.profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button onClick={handleAvatarUpload}>
                        <Upload className="h-4 w-4 mr-2" />
                        Fotoğraf Yükle
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG formatında, maksimum 5MB
                      </p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        value={settings.profile.name}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, name: e.target.value }
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, email: e.target.value }
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={settings.profile.phone}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, phone: e.target.value }
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Departman</Label>
                      <Select 
                        value={settings.profile.department} 
                        onValueChange={(value) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, department: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="İnşaat">İnşaat</SelectItem>
                          <SelectItem value="Mimarlık">Mimarlık</SelectItem>
                          <SelectItem value="İK">İnsan Kaynakları</SelectItem>
                          <SelectItem value="Muhasebe">Muhasebe</SelectItem>
                          <SelectItem value="Güvenlik">Güvenlik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => handleSaveSettings('profile')} className="bg-red-500 hover:bg-red-600">
                      <Save className="h-4 w-4 mr-2" />
                      Kaydet
                    </Button>
                    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Key className="h-4 w-4 mr-2" />
                          Şifre Değiştir
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">Bildirim Ayarları</CardTitle>
                  <CardDescription>
                    Hangi bildirimleri almak istediğinizi belirleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>E-posta Bildirimleri</Label>
                        <p className="text-sm text-muted-foreground">E-posta ile bildirim alın</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Bildirimleri</Label>
                        <p className="text-sm text-muted-foreground">Tarayıcı bildirimleri</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, push: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Bildirimleri</Label>
                        <p className="text-sm text-muted-foreground">Kısa mesaj ile bildirim</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, sms: checked }
                        })}
                      />
                    </div>

                    <hr />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Kritik Uyarılar</Label>
                        <p className="text-sm text-muted-foreground">Acil durumlar için bildiriler</p>
                      </div>
                      <Switch
                        checked={settings.notifications.critical}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, critical: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Rapor Bildirimleri</Label>
                        <p className="text-sm text-muted-foreground">Günlük rapor durumları</p>
                      </div>
                      <Switch
                        checked={settings.notifications.reports}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, reports: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Devam Bildirimleri</Label>
                        <p className="text-sm text-muted-foreground">Devamsızlık uyarıları</p>
                      </div>
                      <Switch
                        checked={settings.notifications.attendance}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, attendance: checked }
                        })}
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSettings('notifications')} className="bg-blue-500 hover:bg-blue-600">
                    <Save className="h-4 w-4 mr-2" />
                    Bildirim Ayarlarını Kaydet
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-600">Güvenlik Ayarları</CardTitle>
                  <CardDescription>
                    Hesap güvenliğinizi artırın
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>İki Faktörlü Doğrulama</Label>
                        <p className="text-sm text-muted-foreground">SMS ile ek güvenlik</p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactor: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Giriş Bildirimleri</Label>
                        <p className="text-sm text-muted-foreground">Yeni giriş yapıldığında bilgilendir</p>
                      </div>
                      <Switch
                        checked={settings.security.loginNotifications}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          security: { ...settings.security, loginNotifications: checked }
                        })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Oturum Zaman Aşımı (dakika)</Label>
                        <Select 
                          value={settings.security.sessionTimeout.toString()} 
                          onValueChange={(value) => setSettings({
                            ...settings,
                            security: { ...settings.security, sessionTimeout: parseInt(value) }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 dakika</SelectItem>
                            <SelectItem value="30">30 dakika</SelectItem>
                            <SelectItem value="60">1 saat</SelectItem>
                            <SelectItem value="120">2 saat</SelectItem>
                            <SelectItem value="240">4 saat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Şifre Değiştirme Süresi (gün)</Label>
                        <Select 
                          value={settings.security.passwordExpiry.toString()} 
                          onValueChange={(value) => setSettings({
                            ...settings,
                            security: { ...settings.security, passwordExpiry: parseInt(value) }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 gün</SelectItem>
                            <SelectItem value="60">60 gün</SelectItem>
                            <SelectItem value="90">90 gün</SelectItem>
                            <SelectItem value="180">180 gün</SelectItem>
                            <SelectItem value="365">1 yıl</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSettings('security')} className="bg-green-500 hover:bg-green-600">
                    <Save className="h-4 w-4 mr-2" />
                    Güvenlik Ayarlarını Kaydet
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Settings */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-600">Kullanıcı Tercihleri</CardTitle>
                  <CardDescription>
                    Kişisel kullanım tercihlerinizi ayarlayın
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dil</Label>
                      <Select 
                        value={settings.preferences.language} 
                        onValueChange={(value) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, language: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tr">Türkçe</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Saat Dilimi</Label>
                      <Select 
                        value={settings.preferences.timezone} 
                        onValueChange={(value) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, timezone: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Istanbul">İstanbul (GMT+3)</SelectItem>
                          <SelectItem value="Europe/London">Londra (GMT+0)</SelectItem>
                          <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tema</Label>
                      <Select 
                        value={settings.preferences.theme} 
                        onValueChange={(value) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, theme: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Açık</SelectItem>
                          <SelectItem value="dark">Koyu</SelectItem>
                          <SelectItem value="auto">Otomatik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tarih Formatı</Label>
                      <Select 
                        value={settings.preferences.dateFormat} 
                        onValueChange={(value) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, dateFormat: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSettings('preferences')} className="bg-purple-500 hover:bg-purple-600">
                    <Save className="h-4 w-4 mr-2" />
                    Tercih Ayarlarını Kaydet
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="space-y-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-600">Sistem Ayarları</CardTitle>
                  <CardDescription>
                    Sistem yedekleme ve veri yönetimi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Otomatik Yedekleme</Label>
                        <p className="text-sm text-muted-foreground">Düzenli sistem yedeklemesi</p>
                      </div>
                      <Switch
                        checked={settings.system.autoBackup}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          system: { ...settings.system, autoBackup: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Denetim Kayıtları</Label>
                        <p className="text-sm text-muted-foreground">Kullanıcı işlemlerini kaydet</p>
                      </div>
                      <Switch
                        checked={settings.system.auditLogs}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          system: { ...settings.system, auditLogs: checked }
                        })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Yedekleme Sıklığı</Label>
                        <Select 
                          value={settings.system.backupFrequency} 
                          onValueChange={(value) => setSettings({
                            ...settings,
                            system: { ...settings.system, backupFrequency: value }
                          })}
                        >
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

                      <div className="space-y-2">
                        <Label>Veri Saklama Süresi (gün)</Label>
                        <Select 
                          value={settings.system.dataRetention.toString()} 
                          onValueChange={(value) => setSettings({
                            ...settings,
                            system: { ...settings.system, dataRetention: parseInt(value) }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90">90 gün</SelectItem>
                            <SelectItem value="180">180 gün</SelectItem>
                            <SelectItem value="365">1 yıl</SelectItem>
                            <SelectItem value="730">2 yıl</SelectItem>
                            <SelectItem value="1095">3 yıl</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={() => handleSaveSettings('system')} className="bg-orange-500 hover:bg-orange-600">
                        <Save className="h-4 w-4 mr-2" />
                        Sistem Ayarlarını Kaydet
                      </Button>
                      
                      <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Database className="h-4 w-4 mr-2" />
                            Şimdi Yedekle
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Password Change Dialog */}
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Şifre Değiştir</DialogTitle>
                <DialogDescription>
                  Güvenliğiniz için güçlü bir şifre seçin
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Güçlü şifre önerileri:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>En az 8 karakter</li>
                      <li>Büyük ve küçük harf</li>
                      <li>Sayı ve özel karakter</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handlePasswordChange}>
                  Şifreyi Değiştir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Backup Dialog */}
          <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sistem Yedekleme</DialogTitle>
                <DialogDescription>
                  Sistem verilerinin yedeğini oluşturmak istediğinizden emin misiniz?
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Database className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Yedeklenecek veriler:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Kullanıcı profilleri</li>
                      <li>Şantiye bilgileri</li>
                      <li>Personel kayıtları</li>
                      <li>Malzeme stok durumu</li>
                      <li>Günlük raporlar</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handleBackupNow} className="bg-blue-500 hover:bg-blue-600">
                  <Database className="h-4 w-4 mr-2" />
                  Yedeklemeyi Başlat
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
