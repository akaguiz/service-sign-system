import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOS } from "@/contexts/OSContext";
import SignatureCanvas from "@/components/SignatureCanvas";

const SignatureView = () => {
  const { cpf } = useParams();
  const { getOSByCPF, updateOS } = useOS();
  const [confirmRead, setConfirmRead] = useState(false);
  const [signature, setSignature] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const osData = cpf ? getOSByCPF(cpf) : undefined;

  if (!osData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">OS não encontrada</h2>
            <p className="text-gray-600 mb-4">Não foi encontrada nenhuma OS vinculada a este CPF.</p>
            <Link to="/signature">
              <Button className="bg-primary hover:bg-primary-hover">
                Voltar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (osData.status === 'assinada') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Documento já assinado</h2>
            <p className="text-gray-600 mb-4">Esta OS já foi assinada em {osData.dataAssinatura ? new Date(osData.dataAssinatura).toLocaleDateString('pt-BR') : 'data não informada'}.</p>
            <Link to="/signature">
              <Button className="bg-primary hover:bg-primary-hover">
                Voltar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      updateOS(osData.id, {
        status: 'assinada',
        assinatura: signature,
        dataAssinatura: new Date().toISOString().split('T')[0]
      });

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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/signature" className="mr-4">
              <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Ordem de Serviço</h1>
              <p className="text-white/80">Filial: {osData.filial}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-primary" />
              Ordem de Serviço - {osData.filial}
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
              <label htmlFor="confirmRead" className="text-sm">
                Confirmo que li e compreendi todas as informações contidas neste documento
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assinatura Digital</label>
              <SignatureCanvas 
                onSignatureChange={setSignature}
                width={400}
                height={150}
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
