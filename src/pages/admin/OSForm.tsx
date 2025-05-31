
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOS } from "@/contexts/OSContext";
import { useOSConfig, OSTemplate } from "@/contexts/OSConfigContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const OSForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addOS, updateOS, getOSById } = useOS();
  const { templates } = useOSConfig();
  const isEditing = !!id;

  const [selectedTemplate, setSelectedTemplate] = useState<OSTemplate | null>(null);
  const [formData, setFormData] = useState({
    empresa: "",
    colaborador: "",
    cpf: "",
    funcao: "",
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
    if (isEditing && id) {
      const os = getOSById(id);
      if (os) {
        setFormData({
          empresa: os.empresa,
          colaborador: os.colaborador,
          cpf: os.cpf,
          funcao: os.funcao,
          riscos: os.riscos,
          epis: os.epis,
          obrigacoes: os.obrigacoes,
          proibicoes: os.proibicoes,
          penalidades: os.penalidades,
          termoRecebimento: os.termoRecebimento,
          procedimentosAcidente: os.procedimentosAcidente,
          dataEmissao: os.dataEmissao
        });
      }
    }
  }, [isEditing, id, getOSById]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData(prev => ({
        ...prev,
        empresa: template.empresa
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
    
    handleInputChange("cpf", formatted);
  };

  const isFieldVisible = (fieldId: string) => {
    if (!selectedTemplate) return true;
    const field = selectedTemplate.fields.find(f => f.id === fieldId);
    return field?.visible !== false;
  };

  const isFieldRequired = (fieldId: string) => {
    if (!selectedTemplate) return false;
    const field = selectedTemplate.fields.find(f => f.id === fieldId);
    return field?.required === true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && id) {
      updateOS(id, formData);
      toast({
        title: "OS atualizada com sucesso!",
        description: "A ordem de serviço foi atualizada no sistema.",
      });
    } else {
      addOS(formData);
      toast({
        title: "OS criada com sucesso!",
        description: "A ordem de serviço foi criada e vinculada ao CPF informado.",
      });
    }
    
    navigate("/admin/os");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-primary shadow-sm">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <SidebarTrigger className="mr-4 text-white hover:bg-white/10" />
                  <h1 className="text-2xl font-bold text-white">
                    {isEditing ? "Editar" : "Nova"} Ordem de Serviço
                  </h1>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Ordem de Serviço</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Seletor de Configuração */}
                    {!isEditing && (
                      <div className="space-y-2">
                        <Label htmlFor="template">Configuração de OS</Label>
                        <Select value={selectedTemplate?.id || ""} onValueChange={handleTemplateSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma configuração existente" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.nome} - {template.empresa}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Dados básicos */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {isFieldVisible('empresa') && (
                        <div className="space-y-2">
                          <Label htmlFor="empresa">
                            Empresa {isFieldRequired('empresa') && '*'}
                          </Label>
                          <Input
                            id="empresa"
                            value={formData.empresa}
                            onChange={(e) => handleInputChange("empresa", e.target.value)}
                            required={isFieldRequired('empresa')}
                          />
                        </div>
                      )}
                      {isFieldVisible('dataEmissao') && (
                        <div className="space-y-2">
                          <Label htmlFor="dataEmissao">
                            Data de Emissão {isFieldRequired('dataEmissao') && '*'}
                          </Label>
                          <Input
                            id="dataEmissao"
                            type="date"
                            value={formData.dataEmissao}
                            onChange={(e) => handleInputChange("dataEmissao", e.target.value)}
                            required={isFieldRequired('dataEmissao')}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {isFieldVisible('colaborador') && (
                        <div className="space-y-2">
                          <Label htmlFor="colaborador">
                            Nome do Colaborador {isFieldRequired('colaborador') && '*'}
                          </Label>
                          <Input
                            id="colaborador"
                            value={formData.colaborador}
                            onChange={(e) => handleInputChange("colaborador", e.target.value)}
                            required={isFieldRequired('colaborador')}
                          />
                        </div>
                      )}
                      {isFieldVisible('cpf') && (
                        <div className="space-y-2">
                          <Label htmlFor="cpf">
                            CPF {isFieldRequired('cpf') && '*'}
                          </Label>
                          <Input
                            id="cpf"
                            value={formData.cpf}
                            onChange={(e) => formatCPF(e.target.value)}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            required={isFieldRequired('cpf')}
                          />
                        </div>
                      )}
                      {isFieldVisible('funcao') && (
                        <div className="space-y-2">
                          <Label htmlFor="funcao">
                            Função {isFieldRequired('funcao') && '*'}
                          </Label>
                          <Input
                            id="funcao"
                            value={formData.funcao}
                            onChange={(e) => handleInputChange("funcao", e.target.value)}
                            required={isFieldRequired('funcao')}
                          />
                        </div>
                      )}
                    </div>

                    {/* Campos de texto */}
                    <div className="space-y-4">
                      {isFieldVisible('riscos') && (
                        <div className="space-y-2">
                          <Label htmlFor="riscos">
                            Riscos {isFieldRequired('riscos') && '*'}
                          </Label>
                          <Textarea
                            id="riscos"
                            value={formData.riscos}
                            onChange={(e) => handleInputChange("riscos", e.target.value)}
                            rows={3}
                            required={isFieldRequired('riscos')}
                          />
                        </div>
                      )}

                      {isFieldVisible('epis') && (
                        <div className="space-y-2">
                          <Label htmlFor="epis">
                            Equipamentos de Proteção (EPIs) {isFieldRequired('epis') && '*'}
                          </Label>
                          <Textarea
                            id="epis"
                            value={formData.epis}
                            onChange={(e) => handleInputChange("epis", e.target.value)}
                            rows={3}
                            required={isFieldRequired('epis')}
                          />
                        </div>
                      )}

                      {isFieldVisible('obrigacoes') && (
                        <div className="space-y-2">
                          <Label htmlFor="obrigacoes">
                            Obrigações do Colaborador {isFieldRequired('obrigacoes') && '*'}
                          </Label>
                          <Textarea
                            id="obrigacoes"
                            value={formData.obrigacoes}
                            onChange={(e) => handleInputChange("obrigacoes", e.target.value)}
                            rows={4}
                            required={isFieldRequired('obrigacoes')}
                          />
                        </div>
                      )}

                      {isFieldVisible('proibicoes') && (
                        <div className="space-y-2">
                          <Label htmlFor="proibicoes">
                            Proibições {isFieldRequired('proibicoes') && '*'}
                          </Label>
                          <Textarea
                            id="proibicoes"
                            value={formData.proibicoes}
                            onChange={(e) => handleInputChange("proibicoes", e.target.value)}
                            rows={4}
                            required={isFieldRequired('proibicoes')}
                          />
                        </div>
                      )}

                      {isFieldVisible('penalidades') && (
                        <div className="space-y-2">
                          <Label htmlFor="penalidades">
                            Penalidades {isFieldRequired('penalidades') && '*'}
                          </Label>
                          <Textarea
                            id="penalidades"
                            value={formData.penalidades}
                            onChange={(e) => handleInputChange("penalidades", e.target.value)}
                            rows={3}
                            required={isFieldRequired('penalidades')}
                          />
                        </div>
                      )}

                      {isFieldVisible('termoRecebimento') && (
                        <div className="space-y-2">
                          <Label htmlFor="termoRecebimento">
                            Termo de Recebimento e Compromisso {isFieldRequired('termoRecebimento') && '*'}
                          </Label>
                          <Textarea
                            id="termoRecebimento"
                            value={formData.termoRecebimento}
                            onChange={(e) => handleInputChange("termoRecebimento", e.target.value)}
                            rows={4}
                            required={isFieldRequired('termoRecebimento')}
                          />
                        </div>
                      )}

                      {isFieldVisible('procedimentosAcidente') && (
                        <div className="space-y-2">
                          <Label htmlFor="procedimentosAcidente">
                            Procedimentos em Caso de Acidente {isFieldRequired('procedimentosAcidente') && '*'}
                          </Label>
                          <Textarea
                            id="procedimentosAcidente"
                            value={formData.procedimentosAcidente}
                            onChange={(e) => handleInputChange("procedimentosAcidente", e.target.value)}
                            rows={4}
                            required={isFieldRequired('procedimentosAcidente')}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/os")}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? "Atualizar" : "Salvar"} OS
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

export default OSForm;
