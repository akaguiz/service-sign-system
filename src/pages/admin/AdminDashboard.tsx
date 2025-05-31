
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Plus, Settings } from "lucide-react";
import { useOS } from "@/contexts/OSContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const AdminDashboard = () => {
  const { osList } = useOS();

  // Calcular estatísticas
  const pendingOS = osList.filter(os => os.status === 'pendente').length;
  const signedOS = osList.filter(os => os.status === 'assinada').length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-primary shadow-sm">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <SidebarTrigger className="mr-4 text-white hover:bg-white/10" />
                  <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-center">
                {/* Seção OS - Centralizada e com tamanho ajustado */}
                <Card className="transition-shadow w-full max-w-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-800">Ordens de Serviço</CardTitle>
                    <CardDescription>
                      Gerencie e visualize todas as ordens de serviço
                    </CardDescription>
                  </CardHeader>
                  {/* <CardContent className="space-y-4 px-8 pb-8">
                    <Link to="/admin/os">
                      <Button className="w-full bg-primary hover:bg-primary-hover text-white h-12">
                        <Search className="w-4 h-4 mr-2" />
                        Pesquisar OS
                      </Button>
                    </Link>
                    <Link to="/admin/os/new">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-light h-12 mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova OS
                      </Button>
                    </Link>
                    <Link to="/admin/os/config">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-light h-12 mt-4">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar OS
                      </Button>
                    </Link>
                  </CardContent> */}
                </Card>
              </div>

              {/* Estatísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">{pendingOS}</div>
                    <div className="text-gray-600">OS Pendentes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600">{signedOS}</div>
                    <div className="text-gray-600">OS Assinadas</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
