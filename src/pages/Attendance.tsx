
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
import { Calendar } from "@/components/ui/calendar";
import { 
  UserCheck, 
  UserX,
  Clock,
  Calendar as CalendarIcon,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

interface User {
  email: string;
  role: string;
  name: string;
}

interface AttendanceRecord {
  id: number;
  personnelName: string;
  site: string;
  date: string;
  status: "Mevcut" | "Devamsız" | "İzinli" | "Geç Geldi";
  checkInTime?: string;
  checkOutTime?: string;
  reason?: string;
}

const Attendance = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterSite, setFilterSite] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 1,
      personnelName: "Mehmet Çelik",
      site: "İstanbul Konut Projesi",
      date: "2024-06-25",
      status: "Mevcut",
      checkInTime: "08:00",
      checkOutTime: "17:30"
    },
    {
      id: 2,
      personnelName: "Ayşe Demir",
      site: "Ankara Plaza",
      date: "2024-06-25",
      status: "Mevcut",
      checkInTime: "08:15",
      checkOutTime: "17:45"
    },
    {
      id: 3,
      personnelName: "Ali Yılmaz",
      site: "İzmir Rezidans",
      date: "2024-06-25",
      status: "İzinli",
      reason: "Rapor izni"
    },
    {
      id: 4,
      personnelName: "Fatma Kaya",
      site: "İstanbul Konut Projesi",
      date: "2024-06-25",
      status: "Geç Geldi",
      checkInTime: "09:30",
      checkOutTime: "17:30",
      reason: "Trafik"
    },
    {
      id: 5,
      personnelName: "Mustafa Demir",
      site: "Ankara Plaza",
      date: "2024-06-25",
      status: "Devamsız",
      reason: "Bildirim yok"
    },
    // Önceki günler için örnek veriler
    {
      id: 6,
      personnelName: "Mehmet Çelik",
      site: "İstanbul Konut Projesi",
      date: "2024-06-24",
      status: "Mevcut",
      checkInTime: "07:55",
      checkOutTime: "17:35"
    },
    {
      id: 7,
      personnelName: "Ayşe Demir",
      site: "Ankara Plaza",
      date: "2024-06-24",
      status: "Mevcut",
      checkInTime: "08:10",
      checkOutTime: "17:40"
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

  const sites = ["İstanbul Konut Projesi", "Ankara Plaza", "İzmir Rezidans"];
  
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDateString;
    const matchesSite = filterSite === "all" || record.site === filterSite;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    const matchesSearch = record.personnelName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesSite && matchesStatus && matchesSearch;
  });

  const todayStats = {
    total: filteredRecords.length,
    present: filteredRecords.filter(r => r.status === "Mevcut").length,
    absent: filteredRecords.filter(r => r.status === "Devamsız").length,
    leave: filteredRecords.filter(r => r.status === "İzinli").length,
    late: filteredRecords.filter(r => r.status === "Geç Geldi").length
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
                <h1 className="text-2xl font-bold text-gray-900">Devamsızlık Takibi</h1>
                <p className="text-gray-600">Personel devam durumlarını takip edin</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar and Filters */}
            <div className="space-y-6">
              {/* Calendar */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Tarih Seçimi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">Filtreler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Personel Ara</Label>
                    <Input
                      id="search"
                      placeholder="İsim ile ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteFilter">Şantiye</Label>
                    <Select value={filterSite} onValueChange={setFilterSite}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {sites.map((site) => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="statusFilter">Durum</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="Mevcut">Mevcut</SelectItem>
                        <SelectItem value="Devamsız">Devamsız</SelectItem>
                        <SelectItem value="İzinli">İzinli</SelectItem>
                        <SelectItem value="Geç Geldi">Geç Geldi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Toplam</p>
                        <p className="text-lg font-bold text-blue-600">{todayStats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Mevcut</p>
                        <p className="text-lg font-bold text-green-600">{todayStats.present}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Devamsız</p>
                        <p className="text-lg font-bold text-red-600">{todayStats.absent}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Geç / İzinli</p>
                        <p className="text-lg font-bold text-yellow-600">{todayStats.late + todayStats.leave}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Selected Date Info */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">
                    {selectedDate.toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} - Devam Durumu
                  </CardTitle>
                  <CardDescription>
                    Seçilen tarihe ait personel devam kayıtları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredRecords.length > 0 ? (
                    <div className="space-y-3">
                      {filteredRecords.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              {record.status === "Mevcut" && <UserCheck className="h-5 w-5 text-green-500" />}
                              {record.status === "Devamsız" && <UserX className="h-5 w-5 text-red-500" />}
                              {record.status === "İzinli" && <Clock className="h-5 w-5 text-blue-500" />}
                              {record.status === "Geç Geldi" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                              
                              <div className="flex-1">
                                <h3 className="font-medium">{record.personnelName}</h3>
                                <p className="text-sm text-muted-foreground">{record.site}</p>
                              </div>
                            </div>
                            
                            {(record.checkInTime || record.checkOutTime) && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                {record.checkInTime && `Giriş: ${record.checkInTime}`}
                                {record.checkInTime && record.checkOutTime && " - "}
                                {record.checkOutTime && `Çıkış: ${record.checkOutTime}`}
                              </div>
                            )}
                            
                            {record.reason && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                <span className="font-medium">Neden:</span> {record.reason}
                              </div>
                            )}
                          </div>
                          
                          <Badge variant={
                            record.status === "Mevcut" ? "default" :
                            record.status === "Devamsız" ? "destructive" :
                            record.status === "İzinli" ? "secondary" :
                            "outline"
                          }>
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Kayıt bulunamadı</h3>
                      <p className="text-gray-500">
                        Seçilen tarih ve filtrelere uygun devam kaydı bulunmuyor.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary Report */}
              {filteredRecords.length > 0 && (
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Günlük Özet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{todayStats.present}</div>
                        <div className="text-sm text-muted-foreground">Mevcut</div>
                        <div className="text-xs text-muted-foreground">
                          %{Math.round((todayStats.present / todayStats.total) * 100)}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{todayStats.absent}</div>
                        <div className="text-sm text-muted-foreground">Devamsız</div>
                        <div className="text-xs text-muted-foreground">
                          %{Math.round((todayStats.absent / todayStats.total) * 100)}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{todayStats.leave}</div>
                        <div className="text-sm text-muted-foreground">İzinli</div>
                        <div className="text-xs text-muted-foreground">
                          %{Math.round((todayStats.leave / todayStats.total) * 100)}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{todayStats.late}</div>
                        <div className="text-sm text-muted-foreground">Geç Geldi</div>
                        <div className="text-xs text-muted-foreground">
                          %{Math.round((todayStats.late / todayStats.total) * 100)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Attendance;
