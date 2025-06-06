
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { OSProvider } from "@/contexts/OSContext";
import { OSConfigProvider } from "@/contexts/OSConfigContext";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Admin pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import OSList from "@/pages/admin/OSList";
import OSForm from "@/pages/admin/OSForm";
import OSView from "@/pages/admin/OSView";
import OSConfig from "@/pages/admin/OSConfig";
import CPFSearch from "@/pages/admin/CPFSearch";
import OSMassa from "@/pages/admin/OSMassa";
import OSMassForm from "@/pages/admin/OSMassForm";
import QRCodePage from "@/pages/admin/QRCodePage";

// Signature pages  
import SignatureLogin from "@/pages/signature/SignatureLogin";
import SignatureView from "@/pages/signature/SignatureView";

import "./App.css";

function App() {
  return (
    <OSProvider>
      <OSConfigProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/os" element={<OSList />} />
              <Route path="/admin/cpf-search" element={<CPFSearch />} />
              <Route path="/admin/os/new" element={<OSForm />} />
              <Route path="/admin/os/edit/:id" element={<OSForm />} />
              <Route path="/admin/os/view/:id" element={<OSView />} />
              <Route path="/admin/os/config" element={<OSConfig />} />
              <Route path="/admin/os-massa" element={<OSMassa />} />
              <Route path="/admin/os/mass-form" element={<OSMassForm />} />
              <Route path="/admin/qrcode" element={<QRCodePage />} />
              
              {/* Signature routes */}
              <Route path="/signature" element={<SignatureLogin />} />
              <Route path="/signature/:cpf" element={<SignatureView />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </OSConfigProvider>
    </OSProvider>
  );
}

export default App;
