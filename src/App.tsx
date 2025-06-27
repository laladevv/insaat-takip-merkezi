
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomAuthProvider } from "@/hooks/useCustomAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import Personnel from "./pages/Personnel";
import Materials from "./pages/Materials";
import Reports from "./pages/Reports";
import Map from "./pages/Map";
import Attendance from "./pages/Attendance";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CustomAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/map" element={<Map />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CustomAuthProvider>
  </QueryClientProvider>
);

export default App;
