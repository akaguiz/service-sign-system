
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const cpfFromUrl = searchParams.get('cpf');
  const { addOS, updateOS, getOSById, getOSByCPF, getCollaboratorByCPF } = useOS();
  const { templates, getFiliais } = useOSConfig();
  const isEditing = !!id;

  const [selectedTemplate, setSelectedTemplate] = useState<OSTemplate | null>(null);
  const [isDataFromExistingSource, setIsDataFromExistingSource] = useState(false);
  const [formData, setFormData] = useState({
    filial: "",
    colaborador: "",
    cpf: cpfFromUrl || "",
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

  // Preencher dados do colaborador quando CPF for fornecido
  useEffect(() => {
    if (cpfFromUrl && !isEditing) {
      console.log('Iniciando busca de dados para CPF:', cpfFromUrl);
      
      // 1. Primeiro, busca se já existe uma OS para esse CPF
      const osExistente = getOSByCPF(cpfFromUrl);
      
      if (osExistente) {
        console.log('OS existente encontrada, preenchendo dados da OS');
        setFormData(prev => ({
          ...prev,
          colaborador: osExistente.colaborador,
          funcao: osExistente.funcao,
          filial: osExistente.filial
        }));
        setIsDataFromExistingSource(true);
      } else {
        // 2. Se não existe OS, busca na base de colaboradores
        console.log('Nenhuma OS encontrada, buscando na base de colaboradores');
        const colaborador = getCollaboratorByCPF(cpfFromUrl);
        
        if (colaborador) {
          console.log('Colaborador encontrado na base, preenchendo dados');
          setFormData(prev => ({
            ...prev,
            colaborador: colaborador.nome,
            funcao: colaborador.funcao,
            filial: colaborador.filial || ""
          }));
          setIsDataFromExistingSource(true);
        } else {
          // 3. Se não encontra nem OS nem colaborador, deixa campos vazios
          console.log('CPF não localizado, deixando campos vazios');
          setFormData(prev => ({
            ...prev,
            colaborador: "",
            funcao: "",
            filial: ""
          }));
          setIsDataFromExistingSource(false);
        }
      }
    }
  }, [cpfFromUrl, isEditing, getOSByCPF, getCollaboratorByCPF]);

  useEffect(() => {
    if (isEditing && id) {
      const os = getOSById(id);
      if (os) {
        setFormData({
          filial: os.filial || "",
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
      // Preencher campos com conteúdo do modelo
      const newFormData = { ...formData };
      
      template.fields.forEach(field => {
        if (field.content.trim() !== '' && field.id !== 'cpf' && field.id !== 'colaborador' && field.id !== 'funcao') {
          newFormData[field.id as keyof typeof newFormData] = field.content;
        }
      });
      
      setFormData(newFormData);
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
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-gray-50 w-full">
            {/* Header */}
            <header className="bg-primary shadow-sm">
              <div className="container mx-auto px-4 py-4 flex items-center">
                <SidebarTrigger className="mr-4 text-white hover:bg-white/10" />
                <h1 className="text-2xl font-bold text-white">
                  {isEditing ? "Editar" : "Nova"} Ordem de Serviço
                </h1>
              </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Ordem de Serviço</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Seletor de Modelo */}
                    {!isEditing && (
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
                    )}

                    {/* Dados básicos */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="filial">Filial *</Label>
                        <Select 
                          value={formData.filial} 
                          onValueChange={(value) => handleInputChange("filial", value)}
                          disabled={isDataFromExistingSource}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a filial" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFiliais().map((filial) => (
                              <SelectItem key={filial} value={filial}>
                                {filial}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataEmissao">Data de Emissão *</Label>
                        <Input
                          id="dataEmissao"
                          type="date"
                          value={formData.dataEmissao}
                          onChange={(e) => handleInputChange("dataEmissao", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="colaborador">Nome do Colaborador *</Label>
                        <Input
                          id="colaborador"
                          value={formData.colaborador}
                          onChange={(e) => handleInputChange("colaborador", e.target.value)}
                          placeholder="Nome completo do colaborador"
                          required
                          disabled={isDataFromExistingSource}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          value={formData.cpf}
                          onChange={(e) => formatCPF(e.target.value)}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          required
                          disabled={!!cpfFromUrl}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="funcao">Função *</Label>
                        <Input
                          id="funcao"
                          value={formData.funcao}
                          onChange={(e) => handleInputChange("funcao", e.target.value)}
                          placeholder="Função do colaborador"
                          required
                          disabled={isDataFromExistingSource}
                        />
                      </div>
                    </div>

                    {/* Campos de texto */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="riscos">Riscos</Label>
                        <Textarea
                          id="riscos"
                          value={formData.riscos}
                          onChange={(e) => handleInputChange("riscos", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="epis">Equipamentos de Proteção (EPIs)</Label>
                        <Textarea
                          id="epis"
                          value={formData.epis}
                          onChange={(e) => handleInputChange("epis", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="obrigacoes">Obrigações do Colaborador</Label>
                        <Textarea
                          id="obrigacoes"
                          value={formData.obrigacoes}
                          onChange={(e) => handleInputChange("obrigacoes", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="proibicoes">Proibições</Label>
                        <Textarea
                          id="proibicoes"
                          value={formData.proibicoes}
                          onChange={(e) => handleInputChange("proibicoes", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="penalidades">Penalidades</Label>
                        <Textarea
                          id="penalidades"
                          value={formData.penalidades}
                          onChange={(e) => handleInputChange("penalidades", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="termoRecebimento">Termo de Recebimento e Compromisso</Label>
                        <Textarea
                          id="termoRecebimento"
                          value={formData.termoRecebimento}
                          onChange={(e) => handleInputChange("termoRecebimento", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="procedimentosAcidente">Procedimentos em Caso de Acidente</Label>
                        <Textarea
                          id="procedimentosAcidente"
                          value={formData.procedimentosAcidente}
                          onChange={(e) => handleInputChange("procedimentosAcidente", e.target.value)}
                          rows={4}
                        />
                      </div>
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
