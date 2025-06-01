
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOSConfig, OSField } from "@/contexts/OSConfigContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const OSConfig = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useOSConfig();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    empresa: "",
    nome: "",
    fields: [] as OSField[]
  });

  const defaultFields: OSField[] = [
    { id: 'colaborador', label: 'Nome do Colaborador', content: '' },
    { id: 'cpf', label: 'CPF', content: '' },
    { id: 'empresa', label: 'Empresa', content: '' },
    { id: 'funcao', label: 'Função', content: '' },
    { id: 'dataEmissao', label: 'Data de Emissão', content: '' },
    { id: 'riscos', label: 'Riscos Identificados', content: '' },
    { id: 'epis', label: 'Equipamentos de Proteção (EPIs)', content: '' },
    { id: 'obrigacoes', label: 'Obrigações do Colaborador', content: '' },
    { id: 'proibicoes', label: 'Proibições', content: '' },
    { id: 'penalidades', label: 'Penalidades', content: '' },
    { id: 'termoRecebimento', label: 'Termo de Recebimento', content: '' },
    { id: 'procedimentosAcidente', label: 'Procedimentos em Caso de Acidente', content: '' },
  ];

  const startCreating = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    setFormData({
      empresa: "",
      nome: "",
      fields: [...defaultFields]
    });
  };

  const startEditing = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate(templateId);
      setIsCreating(false);
      setFormData({
        empresa: template.empresa,
        nome: template.nome,
        fields: [...template.fields]
      });
    }
  };

  const handleFieldContentChange = (fieldId: string, content: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, content } : field
      )
    }));
  };

  const handleSave = () => {
    if (!formData.empresa || !formData.nome) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (editingTemplate) {
      updateTemplate(editingTemplate, formData);
      toast({
        title: "Sucesso",
        description: "Modelo atualizado com sucesso!"
      });
    } else {
      addTemplate(formData);
      toast({
        title: "Sucesso",
        description: "Novo modelo criado com sucesso!"
      });
    }

    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleDelete = (templateId: string) => {
    deleteTemplate(templateId);
    toast({
      title: "Sucesso",
      description: "Modelo removido com sucesso!"
    });
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingTemplate(null);
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
                  <h1 className="text-2xl font-bold text-white">Modelos de Ordens de Serviço</h1>
                </div>
                {!isCreating && !editingTemplate && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-primary border-white hover:bg-white"
                    onClick={startCreating}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Modelo
                  </Button>
                )}
              </div>
            </header>

            <div className="container mx-auto px-4 py-8">
              {(isCreating || editingTemplate) ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-primary" />
                      {editingTemplate ? "Editar" : "Novo"} Modelo de OS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Empresa *</Label>
                        <Input
                          id="empresa"
                          value={formData.empresa}
                          onChange={(e) => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                          placeholder="Nome da empresa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome do Modelo *</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Nome para identificar este modelo"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Configurações dos Campos</h3>
                      <div className="space-y-4">
                        {formData.fields.map((field) => (
                          <div key={field.id} className="space-y-2">
                            <Label htmlFor={`content-${field.id}`} className="font-medium">
                              {field.label}
                            </Label>
                            <Textarea
                              id={`content-${field.id}`}
                              value={field.content}
                              onChange={(e) => handleFieldContentChange(field.id, e.target.value)}
                              placeholder={`Configurações para ${field.label}`}
                              rows={3}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline" onClick={cancelEdit}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
                        {editingTemplate ? "Atualizar" : "Salvar"} Modelo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-primary" />
                      Modelos Existentes ({templates.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {templates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum modelo encontrado. Clique em "Novo Modelo" para criar um.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {templates.map((template) => (
                          <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <h3 className="font-semibold">{template.nome}</h3>
                              <p className="text-gray-600">{template.empresa}</p>
                              <p className="text-sm text-gray-500">
                                {template.fields.filter(f => f.content.trim() !== '').length} campos configurados
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(template.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(template.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default OSConfig;
