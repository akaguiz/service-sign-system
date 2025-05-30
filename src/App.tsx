
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OSProvider } from "@/contexts/OSContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OSList from "./pages/admin/OSList";
import OSForm from "./pages/admin/OSForm";
import OSView from "./pages/admin/OSView";
import ModelsList from "./pages/admin/ModelsList";
import ModelsForm from "./pages/admin/ModelsForm";
import SignatureLogin from "./pages/signature/SignatureLogin";
import SignatureView from "./pages/signature/SignatureView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OSProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/os" element={<OSList />} />
            <Route path="/admin/os/new" element={<OSForm />} />
            <Route path="/admin/os/edit/:id" element={<OSForm />} />
            <Route path="/admin/os/view/:id" element={<OSView />} />
            <Route path="/admin/models" element={<ModelsList />} />
            <Route path="/admin/models/new" element={<ModelsForm />} />
            <Route path="/admin/models/edit/:id" element={<ModelsForm />} />
            <Route path="/signature" element={<SignatureLogin />} />
            <Route path="/signature/view/:cpf" element={<SignatureView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </OSProvider>
  </QueryClientProvider>
);

export default App;
