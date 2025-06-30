
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  AlertTriangle,
  CheckCircle,
  Info,
  Mail,
  MessageSquare,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Send,
  Clock,
  User
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  priority: "low" | "medium" | "high" | "critical";
  isRead: boolean;
  sender: string;
  recipient: string;
  site?: string;
  createdAt: string;
  readAt?: string;
}

const Notifications = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Kritik Malzeme Uyarısı",
      message: "İstanbul Konut Projesi'nde çimento stoku kritik seviyede. Acil tedarik gerekli.",
      type: "error",
      priority: "critical",
      isRead: false,
      sender: "Sistem",
      recipient: "Tüm Yöneticiler",
      site: "İstanbul Konut Projesi",
      createdAt: "2024-06-25T14:30:00"
    },
    {
      id: 2,
      title: "Günlük Rapor Onaylandı",
      message: "25.06.2024 tarihli günlük rapor başarıyla onaylandı.",
      type: "success",
      priority: "medium",
      isRead: true,
      sender: "Mehmet Çelik",
      recipient: user?.name || "Kullanıcı",
      site: "İstanbul Konut Projesi",
      createdAt: "2024-06-25T13:15:00",
      readAt: "2024-06-25T13:45:00"
    },
    {
      id: 3,
      title: "Yeni Personel Eklendi",
      message: "Ankara Plaza'ya yeni personel eklendi. Lütfen kontrol edin.",
      type: "info",
      priority: "low",
      isRead: false,
      sender: "Ayşe Demir",
      recipient: "İK Departmanı",
      site: "Ankara Plaza",
      createdAt: "2024-06-25T10:45:00"
    },
    {
      id: 4,
      title: "Güvenlik Uyarısı",
      message: "İzmir Rezidans'ta güvenlik kamerası arızalı. Teknik ekip bilgilendirildi.",
      type: "warning",
      priority: "high",
      isRead: false,
      sender: "Güvenlik Sistemi",
      recipient: "Güvenlik Ekibi",
      site: "İzmir Rezidans",
      createdAt: "2024-06-25T09:30:00"
    }
  ]);

  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterRead, setFilterRead] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as const,
    priority: "medium" as const,
    recipient: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority;
    const matchesRead = filterRead === "all" || 
                       (filterRead === "read" && notification.isRead) || 
                       (filterRead === "unread" && !notification.isRead);
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesPriority && matchesRead && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => n.priority === "critical" && !n.isRead).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "border-green-200 bg-green-50";
      case "warning": return "border-yellow-200 bg-yellow-50";
      case "error": return "border-red-200 bg-red-50";
      default: return "border-blue-200 bg-blue-50";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return <Badge variant="destructive">Kritik</Badge>;
      case "high": return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Yüksek</Badge>;
      case "medium": return <Badge variant="outline">Orta</Badge>;
      case "low": return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Düşük</Badge>;
      default: return <Badge variant="outline">Orta</Badge>;
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
    ));
    toast({
      title: "Okundu olarak işaretlendi",
      description: "Bildirim okundu olarak işaretlendi.",
    });
  };

  const handleMarkAsUnread = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: false, readAt: undefined } : n
    ));
    toast({
      title: "Okunmadı olarak işaretlendi",
      description: "Bildirim okunmadı olarak işaretlendi.",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ 
      ...n, 
      isRead: true, 
      readAt: n.readAt || new Date().toISOString() 
    })));
    toast({
      title: "Tümü okundu",
      description: "Tüm bildirimler okundu olarak işaretlendi.",
    });
  };

  const handleDeleteNotification = (id: number) => {
    if (window.confirm("Bu bildirimi silmek istediğinizden emin misiniz?")) {
      setNotifications(notifications.filter(n => n.id !== id));
      toast({
        title: "Bildirim silindi",
        description: "Bildirim başarıyla silindi.",
      });
    }
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailsOpen(true);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message || !newNotification.recipient) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
      });
      return;
    }

    const notification: Notification = {
      id: Math.max(...notifications.map(n => n.id)) + 1,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      priority: newNotification.priority,
      isRead: false,
      sender: user?.name || "Bilinmeyen",
      recipient: newNotification.recipient,
      createdAt: new Date().toISOString()
    };

    setNotifications([notification, ...notifications]);
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      priority: "medium",
      recipient: ""
    });
    setIsCreateOpen(false);

    toast({
      title: "Bildirim gönderildi",
      description: "Yeni bildirim başarıyla oluşturuldu.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bell className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
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
                <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
                <p className="text-gray-600">
                  {unreadCount} okunmamış bildirim
                  {criticalCount > 0 && ` (${criticalCount} kritik)`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Tümünü Okundu İşaretle
              </Button>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Bildirim
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam</p>
                    <p className="text-lg font-bold text-blue-600">{notifications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Okunmamış</p>
                    <p className="text-lg font-bold text-red-600">{unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kritik</p>
                    <p className="text-lg font-bold text-orange-600">{criticalCount}</p>
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

          {/* Filters */}
          <Card className="mb-6 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-600">Filtreleme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Arama</Label>
                  <Input
                    id="search"
                    placeholder="Başlık, mesaj veya gönderen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="typeFilter">Tür</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="success">Başarı</SelectItem>
                      <SelectItem value="warning">Uyarı</SelectItem>
                      <SelectItem value="error">Hata</SelectItem>
                      <SelectItem value="info">Bilgi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priorityFilter">Öncelik</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="critical">Kritik</SelectItem>
                      <SelectItem value="high">Yüksek</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Düşük</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="readFilter">Durum</Label>
                  <Select value={filterRead} onValueChange={setFilterRead}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="unread">Okunmamış</SelectItem>
                      <SelectItem value="read">Okunmuş</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-red-500' : ''
                } ${getTypeColor(notification.type)}`}
                onClick={() => handleViewDetails(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(notification.type)}
                        <h3 className={`font-medium ${!notification.isRead ? 'font-bold' : ''}`}>
                          {notification.title}
                        </h3>
                        {getPriorityBadge(notification.priority)}
                        {!notification.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            Yeni
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {notification.sender}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(notification.createdAt).toLocaleString('tr-TR')}
                        </span>
                        {notification.site && (
                          <span className="flex items-center gap-1">
                            <span>{notification.site}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          notification.isRead ? 
                            handleMarkAsUnread(notification.id) : 
                            handleMarkAsRead(notification.id);
                        }}
                      >
                        {notification.isRead ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Notification Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Bildirim Oluştur</DialogTitle>
                <DialogDescription>
                  Kullanıcılara bildirim gönderin
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationTitle">Başlık *</Label>
                  <Input
                    id="notificationTitle"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    placeholder="Bildirim başlığı"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notificationMessage">Mesaj *</Label>
                  <Textarea
                    id="notificationMessage"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    placeholder="Bildirim mesajı"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notificationType">Tür</Label>
                    <Select 
                      value={newNotification.type} 
                      onValueChange={(value: any) => setNewNotification({...newNotification, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Bilgi</SelectItem>
                        <SelectItem value="success">Başarı</SelectItem>
                        <SelectItem value="warning">Uyarı</SelectItem>
                        <SelectItem value="error">Hata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notificationPriority">Öncelik</Label>
                    <Select 
                      value={newNotification.priority} 
                      onValueChange={(value: any) => setNewNotification({...newNotification, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Düşük</SelectItem>
                        <SelectItem value="medium">Orta</SelectItem>
                        <SelectItem value="high">Yüksek</SelectItem>
                        <SelectItem value="critical">Kritik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notificationRecipient">Alıcı *</Label>
                  <Input
                    id="notificationRecipient"
                    value={newNotification.recipient}
                    onChange={(e) => setNewNotification({...newNotification, recipient: e.target.value})}
                    placeholder="Alıcı adı veya grubu"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handleCreateNotification} className="bg-red-500 hover:bg-red-600">
                  <Send className="h-4 w-4 mr-2" />
                  Gönder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Notification Details Dialog */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedNotification && getTypeIcon(selectedNotification.type)}
                  {selectedNotification?.title}
                </DialogTitle>
              </DialogHeader>
              
              {selectedNotification && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(selectedNotification.priority)}
                    {!selectedNotification.isRead && (
                      <Badge variant="destructive" className="text-xs">
                        Yeni
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <Label>Mesaj</Label>
                    <p className="mt-1 text-sm">{selectedNotification.message}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Gönderen</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedNotification.sender}</p>
                    </div>
                    <div>
                      <Label>Alıcı</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedNotification.recipient}</p>
                    </div>
                  </div>
                  
                  {selectedNotification.site && (
                    <div>
                      <Label>Şantiye</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedNotification.site}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Oluşturulma</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(selectedNotification.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    {selectedNotification.readAt && (
                      <div>
                        <Label>Okunma</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(selectedNotification.readAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {filteredNotifications.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim bulunamadı</h3>
                <p className="text-gray-500">Filtreleme kriterlerinize uygun bildirim bulunmuyor.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Notifications;
