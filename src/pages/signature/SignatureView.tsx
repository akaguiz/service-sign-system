
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SignatureView = () => {
  const { cpf } = useParams();
  const [confirmRead, setConfirmRead] = useState(false);
  const [signature, setSignature] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  // Dados de exemplo da OS
  const osData = {
    empresa: "Empresa A Ltda",
    colaborador: "João Silva",
    cpf: cpf,
    funcao: "Técnico de Segurança",
    riscos: "Trabalho em altura, exposição a ruído, manuseio de equipamentos",
    epis: "Capacete, óculos de proteção, luvas, calçado de segurança, protetor auricular",
    obrigacoes: "Utilizar EPIs obrigatórios, seguir procedimentos de segurança, reportar incidentes",
    proibicoes: "Não utilizar equipamentos sem treinamento, não remover proteções de segurança",
    penalidades: "Advertência verbal, advertência escrita, suspensão, demissão por justa causa",
    termoRecebimento: "Declaro ter recebido e compreendido todas as orientações de segurança",
    procedimentosAcidente: "Comunicar imediatamente o supervisor, buscar atendimento médico se necessário",
    dataEmissao: "2024-05-30"
  };

  const handleSign = async () => {
    if (!confirmRead || !signature.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Confirme a leitura do documento e adicione sua assinatura.",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);

    // Simular processo de assinatura
    setTimeout(() => {
      toast({
        title: "Documento assinado com sucesso!",
        description: "Sua assinatura foi registrada no sistema.",
      });
      setIsSigning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/signature" className="mr-4">
            <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Ordem de Serviço</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-primary" />
              Ordem de Serviço - {osData.empresa}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cabeçalho do documento */}
            <div className="border-b pb-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Colaborador:</strong> {osData.colaborador}</p>
                  <p><strong>CPF:</strong> {osData.cpf}</p>
                </div>
                <div>
                  <p><strong>Função:</strong> {osData.funcao}</p>
                  <p><strong>Data de Emissão:</strong> {new Date(osData.dataEmissao).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>

            {/* Conteúdo da OS */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Riscos Identificados</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{osData.riscos}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Equipamentos de Proteção Individual (EPIs)</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{osData.epis}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Obrigações do Colaborador</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{osData.obrigacoes}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Proibições</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{osData.proibicoes}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Penalidades</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{osData.penalidades}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Termo de Recebimento e Compromisso</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{osData.termoRecebimento}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Procedimentos em Caso de Acidente</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{osData.procedimentosAcidente}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de assinatura */}
        <Card>
          <CardHeader>
            <CardTitle>Assinatura Digital</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="confirmRead" 
                checked={confirmRead}
                onCheckedChange={(checked) => setConfirmRead(checked as boolean)}
              />
              <Label htmlFor="confirmRead" className="text-sm">
                Confirmo que li e compreendi todas as informações contidas neste documento
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature">Assinatura Digital</Label>
              <Input
                id="signature"
                placeholder="Digite seu nome completo como assinatura"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                disabled={!confirmRead}
              />
            </div>

            <Button 
              onClick={handleSign}
              disabled={!confirmRead || !signature.trim() || isSigning}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold"
              size="lg"
            >
              {isSigning ? "Processando..." : "Assinar e Enviar"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignatureView;
