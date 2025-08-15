import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreateUser from "./pages/CreateUser";
import Login from "./pages/Login";
import SalesmanDashboard from "./pages/dashboards/SalesmanDashboard";
import StoreManagerDashboard from "./pages/dashboards/StoreManagerDashboard";
import ZonalManagerDashboard from "./pages/dashboards/ZonalManagerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/salesman" element={<SalesmanDashboard />} />
          <Route path="/dashboard/store_manager" element={<StoreManagerDashboard />} />
          <Route path="/dashboard/zonal_manager" element={<ZonalManagerDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
