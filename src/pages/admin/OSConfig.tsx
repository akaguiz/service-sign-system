
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Settings, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOSConfig, OSField } from "@/contexts/OSConfigContext";

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
    { id: 'colaborador', label: 'Nome do Colaborador', required: true, visible: true },
    { id: 'cpf', label: 'CPF', required: true, visible: true },
    { id: 'empresa', label: 'Empresa', required: true, visible: true },
    { id: 'funcao', label: 'Função', required: true, visible: true },
    { id: 'dataEmissao', label: 'Data de Emissão', required: true, visible: true },
    { id: 'riscos', label: 'Riscos Identificados', required: false, visible: true },
    { id: 'epis', label: 'Equipamentos de Proteção (EPIs)', required: false, visible: true },
    { id: 'obrigacoes', label: 'Obrigações do Colaborador', required: false, visible: true },
    { id: 'proibicoes', label: 'Proibições', required: false, visible: true },
    { id: 'penalidades', label: 'Penalidades', required: false, visible: true },
    { id: 'termoRecebimento', label: 'Termo de Recebimento', required: false, visible: true },
    { id: 'procedimentosAcidente', label: 'Procedimentos em Caso de Acidente', required: false, visible: true },
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

  const handleFieldChange = (fieldId: string, property: 'visible' | 'required', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, [property]: value } : field
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
        description: "Configuração atualizada com sucesso!"
      });
    } else {
      addTemplate(formData);
      toast({
        title: "Sucesso",
        description: "Nova configuração criada com sucesso!"
      });
    }

    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleDelete = (templateId: string) => {
    deleteTemplate(templateId);
    toast({
      title: "Sucesso",
      description: "Configuração removida com sucesso!"
    });
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="mr-4">
              <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Configuração de Ordens de Serviço</h1>
          </div>
          {!isCreating && !editingTemplate && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-primary border-white hover:bg-white"
              onClick={startCreating}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Configuração
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
                {editingTemplate ? "Editar" : "Nova"} Configuração de OS
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
                  <Label htmlFor="nome">Nome da Configuração *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome para identificar esta configuração"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Campos da Ordem de Serviço</h3>
                <div className="space-y-3">
                  {formData.fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{field.label}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`visible-${field.id}`}
                            checked={field.visible}
                            onCheckedChange={(checked) => 
                              handleFieldChange(field.id, 'visible', checked as boolean)
                            }
                          />
                          <Label htmlFor={`visible-${field.id}`}>Visível</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`required-${field.id}`}
                            checked={field.required}
                            onCheckedChange={(checked) => 
                              handleFieldChange(field.id, 'required', checked as boolean)
                            }
                            disabled={field.id === 'colaborador' || field.id === 'cpf' || field.id === 'empresa'}
                          />
                          <Label htmlFor={`required-${field.id}`}>Obrigatório</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
                  {editingTemplate ? "Atualizar" : "Salvar"} Configuração
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Configurações Existentes ({templates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma configuração encontrada. Clique em "Nova Configuração" para criar uma.
                </div>
              ) : (
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h3 className="font-semibold">{template.nome}</h3>
                        <p className="text-gray-600">{template.empresa}</p>
                        <p className="text-sm text-gray-500">
                          {template.fields.filter(f => f.visible).length} campos visíveis
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
  );
};

export default OSConfig;
