
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SignatureLogin = () => {
  const [cpf, setCpf] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular busca de OS pelo CPF
    setTimeout(() => {
      if (cpf.length >= 11) {
        toast({
          title: "Documento encontrado!",
          description: "Redirecionando para visualização da OS.",
        });
        navigate(`/signature/view/${cpf}`);
      } else {
        toast({
          title: "CPF não encontrado",
          description: "Não foi encontrada nenhuma OS vinculada a este CPF.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
    
    setCpf(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary-hover mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Acesso ao Documento</CardTitle>
            <CardDescription>
              Digite seu CPF para acessar sua Ordem de Serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccess} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => formatCPF(e.target.value)}
                  maxLength={14}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold"
                disabled={isLoading || cpf.length < 14}
              >
                {isLoading ? "Buscando..." : "Acessar Documento"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
              Digite um CPF válido para acessar sua OS
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignatureLogin;
