
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, User, Calendar, CheckCircle, Clock } from "lucide-react";
import { useOS } from "@/contexts/OSContext";
import { useOSConfig } from "@/contexts/OSConfigContext";
import { generateOSPDF } from "@/utils/pdfGenerator";

const OSView = () => {
  const { id } = useParams();
  const { getOSById } = useOS();
  const { getTemplateByFilial } = useOSConfig();
  
  const osData = id ? getOSById(id) : undefined;
  const template = osData ? getTemplateByFilial(osData.filial) : undefined;

  if (!osData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
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

  const getFieldLabel = (fieldId: string) => {
    const field = template?.fields.find(f => f.id === fieldId);
    return field?.label || fieldId;
  };

  const isFieldVisible = (fieldId: string) => {
    if (!template) return true; // Se não há template, mostra todos os campos
    const field = template?.fields.find(f => f.id === fieldId);
    // Se o campo tem conteúdo configurado no template, ele é visível
    return field?.content && field.content.trim() !== '';
  };

  const renderField = (fieldId: string, value: any, icon?: React.ReactNode) => {
    if (!isFieldVisible(fieldId) || !value) return null;

    return (
      <div className="flex items-center">
        {icon}
        <div>
          <p className="text-sm text-gray-500">{getFieldLabel(fieldId)}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </div>
    );
  };

  const renderDetailField = (fieldId: string, value: string) => {
    if (!isFieldVisible(fieldId) || !value) return null;

    return (
      <div>
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{getFieldLabel(fieldId)}</h3>
        <p className="text-gray-700 bg-gray-50 p-3 rounded">{value}</p>
      </div>
    );
  };

  const handlePrint = () => {
    generateOSPDF(osData);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="bg-primary shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/os" className="mr-4">
              <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Visualizar Ordem de Serviço</h1>
          </div>
          <Button onClick={handlePrint} variant="outline" size="sm" className="text-primary border-white hover:bg-white">
            <FileText className="w-4 h-4 mr-2" />
            Gerar PDF
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status e informações básicas */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <FileText className="w-6 h-6 mr-2 text-primary" />
                <CardTitle>OS #{osData.numero} - {osData.filial}</CardTitle>
              </div>
              <Badge 
                variant={osData.status === "assinada" ? "default" : "warning"}
                className={osData.status === "assinada" ? "bg-green-600 text-white" : ""}
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
              {renderField('colaborador', osData.colaborador, <User className="w-5 h-5 mr-2 text-gray-500" />)}
              {renderField('cpf', osData.cpf, <FileText className="w-5 h-5 mr-2 text-gray-500" />)}
              {renderField('dataEmissao', new Date(osData.dataEmissao).toLocaleDateString('pt-BR'), <Calendar className="w-5 h-5 mr-2 text-gray-500" />)}
            </div>
            
            {osData.status === 'assinada' && osData.dataAssinatura && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Assinada em {new Date(osData.dataAssinatura).toLocaleDateString('pt-BR')} por {osData.colaborador}
                </p>
                {osData.assinaturaCanvas && (
                  <div className="mt-3">
                    <p className="text-sm text-green-700 mb-2">Assinatura:</p>
                    <img 
                      src={osData.assinaturaCanvas} 
                      alt="Assinatura do colaborador" 
                      className="border border-green-200 rounded bg-white max-w-xs h-auto"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conteúdo da OS */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Ordem de Serviço</CardTitle>
            {template && (
              <p className="text-sm text-gray-500">
                Configuração: {template.nome}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {renderDetailField('funcao', osData.funcao)}
            {renderDetailField('riscos', osData.riscos)}
            {renderDetailField('epis', osData.epis)}
            {renderDetailField('obrigacoes', osData.obrigacoes)}
            {renderDetailField('proibicoes', osData.proibicoes)}
            {renderDetailField('penalidades', osData.penalidades)}
            {renderDetailField('termoRecebimento', osData.termoRecebimento)}
            {renderDetailField('procedimentosAcidente', osData.procedimentosAcidente)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OSView;
