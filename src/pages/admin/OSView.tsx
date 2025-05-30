
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, User, Calendar, CheckCircle, Clock } from "lucide-react";
import { useOS } from "@/contexts/OSContext";

const OSView = () => {
  const { id } = useParams();
  const { getOSById } = useOS();
  
  const osData = id ? getOSById(id) : undefined;

  if (!osData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">OS não encontrada</h2>
            <p className="text-gray-600 mb-4">A ordem de serviço solicitada não foi encontrada.</p>
            <Link to="/admin/os">
              <Button className="bg-primary hover:bg-primary-hover">
                Voltar à lista
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/admin/os" className="mr-4">
            <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Visualizar Ordem de Serviço</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status e informações básicas */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <FileText className="w-6 h-6 mr-2 text-primary" />
                <CardTitle>OS #{osData.id} - {osData.empresa}</CardTitle>
              </div>
              <Badge 
                variant={osData.status === "assinada" ? "default" : "secondary"}
                className={`${osData.status === "assinada" ? "bg-green-600" : "bg-yellow-600"} text-white`}
              >
                {osData.status === "assinada" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Assinada
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-1" />
                    Pendente
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Colaborador</p>
                  <p className="font-semibold">{osData.colaborador}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="font-semibold">{osData.cpf}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Data de Emissão</p>
                  <p className="font-semibold">{new Date(osData.dataEmissao).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
            
            {osData.status === 'assinada' && osData.dataAssinatura && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Assinada em {new Date(osData.dataAssinatura).toLocaleDateString('pt-BR')} por {osData.assinatura}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conteúdo da OS */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Ordem de Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Função</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{osData.funcao}</p>
            </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OSView;
