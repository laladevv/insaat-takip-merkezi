
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Package,
  FileText,
  Settings,
  Home,
  Bell,
  BarChart3,
  MapPin,
  UserCheck,
  LogOut,
  UserPlus
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomAuth } from "@/hooks/useCustomAuth";

// Rol bazlı menü öğeleri
const getMenuItems = (role: string) => {
  const baseItems = [
    {
      title: "Ana Sayfa",
      url: "/dashboard",
      icon: Home,
    }
  ];

  const allItems = [
    {
      title: "Şantiye Yönetimi",
      url: "/sites",
      icon: Building2,
    },
    {
      title: "Personel Yönetimi", 
      url: "/personnel",
      icon: Users,
    },
    {
      title: "Malzeme Yönetimi",
      url: "/materials",
      icon: Package,
    },
    {
      title: "Günlük Raporlar",
      url: "/reports",
      icon: FileText,
    },
    {
      title: "Harita Görünümü",
      url: "/map",
      icon: MapPin,
    },
    {
      title: "Devamsızlık Takibi",
      url: "/attendance",
      icon: UserCheck,
    },
    {
      title: "Raporlama",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Bildirimler",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Ayarlar",
      url: "/settings",
      icon: Settings,
    }
  ];

  // Kullanıcı Yönetimi menü öğesi
  const userManagementItem = {
    title: "Kullanıcı Yönetimi",
    url: "/user-management", 
    icon: UserPlus,
  };

  switch (role) {
    case "Yönetici":
      return [...baseItems, ...allItems, userManagementItem];
    case "Müdür":
      return [...baseItems, ...allItems.slice(0, 7), userManagementItem]; // Ayarlar hariç
    case "Şantiye Şefi":
      return [...baseItems, allItems[2], allItems[3], allItems[4], allItems[7], userManagementItem]; // Malzeme, Raporlar, Harita, Bildirimler + Kullanıcı Yönetimi
    case "Personel":
      return [...baseItems, allItems[3], allItems[7]]; // Sadece Raporlar ve Bildirimler
    default:
      return baseItems;
  }
};

export function AppSidebar() {
  const { user, signOut } = useCustomAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/auth");
  };

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const menuItems = user ? getMenuItems(user.role) : [];

  return (
    <Sidebar className="border-r-2 border-red-100">
      <SidebarHeader className="border-b border-red-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-red-600">IzoEFE</h2>
            <p className="text-xs text-muted-foreground">Şantiye Yönetimi</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-red-600">Navigasyon</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.url)}
                    className="hover:bg-red-50 hover:text-red-600 data-[state=open]:bg-red-100 cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-red-100 p-4">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <Badge variant="outline" className="text-xs border-red-500 text-red-600">
                  {user.role}
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
