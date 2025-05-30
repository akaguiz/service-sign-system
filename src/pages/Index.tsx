
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
            Gerenciador de Ordem de Serviço
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema completo para criação, gerenciamento e assinatura digital de ordens de serviço
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Módulo Administrador</CardTitle>
              <CardDescription className="text-gray-600">
                Gerenciar ordens de serviço, colaboradores e modelos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/admin/login">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Acessar Administração
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Módulo Assinatura</CardTitle>
              <CardDescription className="text-gray-600">
                Visualizar e assinar digitalmente sua ordem de serviço
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/signature">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Assinar Documento
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500">
            Sistema desenvolvido para automatizar a geração, edição e assinatura de Ordens de Serviço
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
