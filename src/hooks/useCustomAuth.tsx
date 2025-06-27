
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const CustomAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde oturum kontrol et
    const checkSession = () => {
      const userData = localStorage.getItem("customUser");
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .rpc('authenticate_user', {
          username_input: username,
          password_input: password
        });

      if (error) {
        return { success: false, error: "Sistem hatası oluştu" };
      }

      if (data && data.length > 0 && data[0].success) {
        const userData = {
          id: data[0].user_id,
          username: username,
          name: data[0].user_name,
          role: data[0].user_role
        };
        
        setUser(userData);
        localStorage.setItem("customUser", JSON.stringify(userData));
        
        // Oturum token'ı oluştur (basit)
        const sessionToken = btoa(userData.id + Date.now());
        localStorage.setItem("sessionToken", sessionToken);
        
        return { success: true };
      } else {
        return { success: false, error: "Kullanıcı adı veya şifre hatalı" };
      }
    } catch (error) {
      return { success: false, error: "Bağlantı hatası oluştu" };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("customUser");
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("rememberedCredentials");
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCustomAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useCustomAuth must be used within a CustomAuthProvider");
  }
  return context;
};
