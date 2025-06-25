
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { 
  Bell, 
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  MarkAsRead,
  Trash2,
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  email: string;
  role: string;
  name: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  timestamp: string;
  priority: "low" | "medium" | "high";
  source: string;
}

const Notifications = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Kritik Stok Uyarısı",
      message: "Demir stoğu kritik seviyeye düştü. Ankara Plaza şantiyesinde sadece 25 ton demir kaldı.",
      type: "warning",
      isRead: false,
      timestamp: "2024-06-25T14:30:00",
      priority: "high",
      source: "Malzeme Yönetimi"
    },
    {
      id: 2,
      title: "Yeni Rapor Onayı",
      message: "Mehmet Çelik tarafından İstanbul Konut Projesi için günlük rapor teslim edildi.",
      type: "info",
      isRead: false,
      timestamp: "2024-06-25T13:15:00",
      priority: "medium",
      source: "Rapor Sistemi"
    },
    {
      id: 3,
      title: "Malzeme Talebi Onaylandı",
      message: "50 ton çimento talebi onaylandı ve tedarikçiye iletildi.",
      type: "success",
      isRead: true,
      timestamp: "2024-06-25T11:45:00",
      priority: "medium",
      source: "Malzeme Yönetimi"
    },
    {
      id: 4,
      title: "Güvenlik Uyarısı",
      message: "İzmir Rezidans şantiyesinde güvenlik ekipmanı kontrolü yapılması gerekiyor.",
      type: "warning",
      isRead: false,
      timestamp: "2024-06-25T10:20:00",
      priority: "high",
      source: "Güvenlik"
    },
    {
      id: 5,
      title: "Personel Devamsızlığı",
      message: "Mustafa Demir bugün İstanbul Konut Projesi'nde devamsız. Bildirim yapılmadı.",
      type: "error",
      isRead: false,
      timestamp: "2024-06-25T09:30:00",
      priority: "medium",
      source: "Devamsızlık Takibi"
    },
    {
      id: 6,
      title: "Proje İlerleme Güncellendi",
      message: "İstanbul Konut Projesi %75 tamamlandı. Hedeflenen sürede ilerliyor.",
      type: "success",
      isRead: true,
      timestamp: "2024-06-24T16:00:00",
      priority: "low",
      source: "Proje Yönetimi"
    },
    {
      id: 7,
      title: "Hava Durumu Uyarısı",
      message: "Yarın Ankara Plaza bölgesinde yağmur bekleniyor. Dış çalışmalar planlanmalı.",
      type: "info",
      isRead: true,
      timestamp: "2024-06-24T15:30:00",
      priority: "low",
      source: "Hava Durumu"
    }
  ]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high" && !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-yellow-200";
      case "success":
        return "border-green-200";
      case "error":
        return "border-red-200";
      default:
        return "border-blue-200";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
    toast({
      title: "Başarılı",
      description: "Bildirim okundu olarak işaretlendi.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    toast({
      title: "Başarılı",
      description: "Tüm bildirimler okundu olarak işaretlendi.",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast({
      title: "Başarılı",
      description: "Bildirim silindi.",
    });
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else {
      return `${diffDays} gün önce`;
    }
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
                  <Bell className="h-7 w-7 text-red-600" />
                  Bildirimler
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-600">Sistem bildirimleri ve uyarılar</p>
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Tümünü Okundu İşaretle
                </Button>
              )}
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Bildirim Ayarları
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Bildirim</p>
                    <p className="text-lg font-bold text-blue-600">{notifications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MarkAsRead className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Okunmamış</p>
                    <p className="text-lg font-bold text-yellow-600">{unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Yüksek Öncelik</p>
                    <p className="text-lg font-bold text-red-600">{highPriorityCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Okundu</p>
                    <p className="text-lg font-bold text-green-600">
                      {notifications.length - unreadCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`${getNotificationBorderColor(notification.type)} ${
                    !notification.isRead ? 'bg-white shadow-md' : 'bg-gray-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={
                              notification.priority === "high" ? "destructive" :
                              notification.priority === "medium" ? "secondary" :
                              "outline"
                            }>
                              {notification.priority === "high" ? "Yüksek" :
                               notification.priority === "medium" ? "Orta" : "Düşük"}
                            </Badge>
                          </div>
                        </div>

                        <p className={`text-sm mb-3 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(notification.timestamp)}
                            </span>
                            <span>{notification.source}</span>
                          </div>

                          <div className="flex gap-2">
                            {!notification.isRead && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Okundu
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim bulunmuyor</h3>
                  <p className="text-gray-500">Henüz herhangi bir bildirim bulunmuyor.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Notifications;
