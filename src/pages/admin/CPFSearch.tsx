
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const CPFSearch = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
    
    setCpf(formatted);
  };

  const handleSearch = () => {
    if (!cpf.trim()) {
      toast({
        title: "CPF obrigatório",
        description: "Por favor, digite um CPF para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Validação básica de CPF
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, digite um CPF válido com 11 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    // Simular busca
    setTimeout(() => {
      setIsSearching(false);
      toast({
        title: "CPF localizado!",
        description: "Redirecionando para criação da OS...",
      });
      // Redirecionar para o formulário de OS com o CPF
      navigate(`/admin/os/new?cpf=${encodeURIComponent(cpf)}`);
    }, 1500);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-gray-50 w-full">
            {/* Header */}
            <header className="bg-primary shadow-sm">
              <div className="container mx-auto px-4 py-4 flex items-center">
                <SidebarTrigger className="mr-4 text-white hover:bg-white/10" />
                <h1 className="text-2xl font-bold text-white">Nova Ordem de Serviço</h1>
              </div>
            </header>

            <div className="container mx-auto px-4 py-16 flex items-center justify-center">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Localizar Colaborador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-lg font-medium">
                      DIGITE SEU CPF
                    </Label>
                    <Input
                      id="cpf"
                      value={cpf}
                      onChange={(e) => formatCPF(e.target.value)}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="text-lg h-12"
                      autoFocus
                    />
                  </div>

                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching || !cpf.trim()}
                    className="w-full bg-primary hover:bg-primary-hover text-white h-12 text-lg"
                  >
                    {isSearching ? (
                      <>
                        <Search className="w-5 h-5 mr-2 animate-spin" />
                        Localizando...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        LOCALIZAR
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Digite o CPF do colaborador para criar uma nova OS
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CPFSearch;
