
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileTemplate, LogOut, Search, Plus } from "lucide-react";

const AdminDashboard = () => {
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
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Seção OS */}
          <Card className="hover:shadow-lg transition-shadow">
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
            </CardContent>
          </Card>

          {/* Seção Modelos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileTemplate className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Modelos</CardTitle>
              <CardDescription>
                Criar e gerenciar modelos de ordens de serviço
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/models">
                <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Pesquisar Modelos
                </Button>
              </Link>
              <Link to="/admin/models/new">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-light">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Modelo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-gray-600">OS Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-gray-600">OS Assinadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-gray-600">Modelos Criados</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
