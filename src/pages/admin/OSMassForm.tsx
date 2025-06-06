
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOS, Collaborator } from "@/contexts/OSContext";
import { useOSConfig, OSTemplate } from "@/contexts/OSConfigContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const OSMassForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const collaboratorsParam = searchParams.get('collaborators');
  const { addOS, getCollaboratorByCPF } = useOS();
  const { templates } = useOSConfig();

  const [selectedTemplate, setSelectedTemplate] = useState<OSTemplate | null>(null);
  const [selectedCollaborators, setSelectedCollaborators] = useState<Collaborator[]>([]);
  const [formData, setFormData] = useState({
    riscos: "",
    epis: "",
    obrigacoes: "",
    proibicoes: "",
    penalidades: "",
    termoRecebimento: "",
    procedimentosAcidente: "",
    dataEmissao: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (collaboratorsParam) {
      const cpfs = collaboratorsParam.split(',');
      const collaborators = cpfs.map(cpf => getCollaboratorByCPF(cpf)).filter(Boolean) as Collaborator[];
      setSelectedCollaborators(collaborators);
    }
  }, [collaboratorsParam, getCollaboratorByCPF]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      const newFormData = { ...formData };
      
      template.fields.forEach(field => {
        if (field.active && field.content.trim() !== '' && field.id !== 'cpf' && field.id !== 'colaborador' && field.id !== 'funcao') {
          newFormData[field.id as keyof typeof newFormData] = field.content;
        }
      });
      
      setFormData(newFormData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const removeCollaborator = (cpf: string) => {
    setSelectedCollaborators(prev => prev.filter(c => c.cpf !== cpf));
  };

  const isFieldFromTemplate = (fieldId: string) => {
    if (!selectedTemplate) return false;
    const field = selectedTemplate.fields.find(f => f.id === fieldId);
    return field ? field.active && field.content.trim() !== '' : false;
  };

  const shouldShowField = (fieldId: string) => {
    if (!selectedTemplate) return true;
    const field = selectedTemplate.fields.find(f => f.id === fieldId);
    return field ? field.active : true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCollaborators.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum colaborador selecionado.",
        variant: "destructive"
      });
      return;
    }

    // Criar uma OS para cada colaborador selecionado
    let successCount = 0;
    selectedCollaborators.forEach(collaborator => {
      const osData = {
        ...formData,
        colaborador: collaborator.nome,
        cpf: collaborator.cpf,
        funcao: collaborator.funcao,
        filial: collaborator.filial || ""
      };
      
      try {
        addOS(osData);
        successCount++;
      } catch (error) {
        console.error(`Erro ao criar OS para ${collaborator.nome}:`, error);
      }
    });

    toast({
      title: "OS criadas com sucesso!",
      description: `${successCount} ordens de serviço foram criadas em massa.`,
    });
    
    navigate("/admin/os");
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
                <h1 className="text-2xl font-bold text-white">
                  Criar OS em Massa
                </h1>
              </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Ordem de Serviço em Massa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Colaboradores Selecionados - moved to first position */}
                    <div className="space-y-2">
                      <Label>Colaboradores Selecionados ({selectedCollaborators.length})</Label>
                      <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-gray-50 min-h-[100px]">
                        {selectedCollaborators.map((collaborator) => (
                          <Badge key={collaborator.cpf} variant="secondary" className="text-sm py-1 px-3">
                            {collaborator.nome} - {collaborator.funcao}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => removeCollaborator(collaborator.cpf)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                        {selectedCollaborators.length === 0 && (
                          <p className="text-gray-500">Nenhum colaborador selecionado</p>
                        )}
                      </div>
                    </div>

                    {/* Seletor de Modelo - moved to second position */}
                    <div className="space-y-2">
                      <Label htmlFor="template">Modelo de OS</Label>
                      <Select value={selectedTemplate?.id || ""} onValueChange={handleTemplateSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um modelo existente" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Data de Emissão */}
                    <div className="space-y-2">
                      <Label htmlFor="dataEmissao">Data de Emissão *</Label>
                      <Input
                        id="dataEmissao"
                        type="date"
                        value={formData.dataEmissao}
                        onChange={(e) => handleInputChange("dataEmissao", e.target.value)}
                        required
                        className="max-w-xs"
                      />
                    </div>

                    {/* Campos de texto */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="riscos">Riscos Identificados *</Label>
                        <Textarea
                          id="riscos"
                          value={formData.riscos}
                          onChange={(e) => handleInputChange("riscos", e.target.value)}
                          rows={3}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="epis">Equipamentos de Proteção (EPIs) *</Label>
                        <Textarea
                          id="epis"
                          value={formData.epis}
                          onChange={(e) => handleInputChange("epis", e.target.value)}
                          rows={3}
                          required
                        />
                      </div>

                      {shouldShowField('obrigacoes') && (
                        <div className="space-y-2">
                          <Label htmlFor="obrigacoes">
                            Obrigações do Colaborador
                            {isFieldFromTemplate('obrigacoes') && <span className="text-sm text-gray-500 ml-2">(do modelo)</span>}
                          </Label>
                          <Textarea
                            id="obrigacoes"
                            value={formData.obrigacoes}
                            onChange={(e) => handleInputChange("obrigacoes", e.target.value)}
                            rows={4}
                            disabled={isFieldFromTemplate('obrigacoes')}
                            className={isFieldFromTemplate('obrigacoes') ? "bg-gray-100" : ""}
                          />
                        </div>
                      )}

                      {shouldShowField('proibicoes') && (
                        <div className="space-y-2">
                          <Label htmlFor="proibicoes">
                            Proibições
                            {isFieldFromTemplate('proibicoes') && <span className="text-sm text-gray-500 ml-2">(do modelo)</span>}
                          </Label>
                          <Textarea
                            id="proibicoes"
                            value={formData.proibicoes}
                            onChange={(e) => handleInputChange("proibicoes", e.target.value)}
                            rows={4}
                            disabled={isFieldFromTemplate('proibicoes')}
                            className={isFieldFromTemplate('proibicoes') ? "bg-gray-100" : ""}
                          />
                        </div>
                      )}

                      {shouldShowField('penalidades') && (
                        <div className="space-y-2">
                          <Label htmlFor="penalidades">
                            Penalidades
                            {isFieldFromTemplate('penalidades') && <span className="text-sm text-gray-500 ml-2">(do modelo)</span>}
                          </Label>
                          <Textarea
                            id="penalidades"
                            value={formData.penalidades}
                            onChange={(e) => handleInputChange("penalidades", e.target.value)}
                            rows={3}
                            disabled={isFieldFromTemplate('penalidades')}
                            className={isFieldFromTemplate('penalidades') ? "bg-gray-100" : ""}
                          />
                        </div>
                      )}

                      {shouldShowField('termoRecebimento') && (
                        <div className="space-y-2">
                          <Label htmlFor="termoRecebimento">
                            Termo de Recebimento e Compromisso
                            {isFieldFromTemplate('termoRecebimento') && <span className="text-sm text-gray-500 ml-2">(do modelo)</span>}
                          </Label>
                          <Textarea
                            id="termoRecebimento"
                            value={formData.termoRecebimento}
                            onChange={(e) => handleInputChange("termoRecebimento", e.target.value)}
                            rows={4}
                            disabled={isFieldFromTemplate('termoRecebimento')}
                            className={isFieldFromTemplate('termoRecebimento') ? "bg-gray-100" : ""}
                          />
                        </div>
                      )}

                      {shouldShowField('procedimentosAcidente') && (
                        <div className="space-y-2">
                          <Label htmlFor="procedimentosAcidente">
                            Procedimentos em Caso de Acidente
                            {isFieldFromTemplate('procedimentosAcidente') && <span className="text-sm text-gray-500 ml-2">(do modelo)</span>}
                          </Label>
                          <Textarea
                            id="procedimentosAcidente"
                            value={formData.procedimentosAcidente}
                            onChange={(e) => handleInputChange("procedimentosAcidente", e.target.value)}
                            rows={4}
                            disabled={isFieldFromTemplate('procedimentosAcidente')}
                            className={isFieldFromTemplate('procedimentosAcidente') ? "bg-gray-100" : ""}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/os-massa")}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-white"
                        disabled={selectedCollaborators.length === 0}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Criar {selectedCollaborators.length} OS
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default OSMassForm;
