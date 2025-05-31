
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, Search, Plus, Settings } from "lucide-react";
import { useOS } from "@/contexts/OSContext";

const AdminDashboard = () => {
  const { osList } = useOS();

  // Calcular estatísticas
  const pendingOS = osList.filter(os => os.status === 'pendente').length;
  const signedOS = osList.filter(os => os.status === 'assinada').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
          <Link to="/">
            <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          {/* Seção OS - Centralizada */}
          <Card className="hover:shadow-lg transition-shadow max-w-md w-full">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Ordens de Serviço</CardTitle>
              <CardDescription>
                Gerenciar e visualizar todas as ordens de serviço
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/os">
                <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Pesquisar OS
                </Button>
              </Link>
              <Link to="/admin/os/new">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-light">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova OS
                </Button>
              </Link>
              <Link to="/admin/os/config">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-light">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar OS
                </Button>
              </Link>
            </CardContent>
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
  );
};

export default AdminDashboard;
