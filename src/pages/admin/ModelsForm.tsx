
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ModelsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    empresa: "",
    nomeModelo: "",
    obrigacoes: "",
    proibicoes: "",
    penalidades: "",
    termoCompromisso: "",
    procedimentos: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular salvamento
    toast({
      title: isEditing ? "Modelo atualizado com sucesso!" : "Modelo criado com sucesso!",
      description: "O modelo foi salvo no sistema.",
    });
    
    navigate("/admin/models");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/models" className="mr-4">
              <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? "Editar" : "Novo"} Modelo
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Modelo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dados básicos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => handleInputChange("empresa", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeModelo">Nome do Modelo *</Label>
                  <Input
                    id="nomeModelo"
                    value={formData.nomeModelo}
                    onChange={(e) => handleInputChange("nomeModelo", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campos de texto */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="obrigacoes">Obrigações</Label>
                  <Textarea
                    id="obrigacoes"
                    value={formData.obrigacoes}
                    onChange={(e) => handleInputChange("obrigacoes", e.target.value)}
                    rows={5}
                    placeholder="Descreva as obrigações do colaborador..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proibicoes">Proibições</Label>
                  <Textarea
                    id="proibicoes"
                    value={formData.proibicoes}
                    onChange={(e) => handleInputChange("proibicoes", e.target.value)}
                    rows={5}
                    placeholder="Descreva as proibições..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="penalidades">Penalidades</Label>
                  <Textarea
                    id="penalidades"
                    value={formData.penalidades}
                    onChange={(e) => handleInputChange("penalidades", e.target.value)}
                    rows={4}
                    placeholder="Descreva as penalidades aplicáveis..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termoCompromisso">Termo de Compromisso</Label>
                  <Textarea
                    id="termoCompromisso"
                    value={formData.termoCompromisso}
                    onChange={(e) => handleInputChange("termoCompromisso", e.target.value)}
                    rows={5}
                    placeholder="Texto do termo de compromisso..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procedimentos">Procedimentos</Label>
                  <Textarea
                    id="procedimentos"
                    value={formData.procedimentos}
                    onChange={(e) => handleInputChange("procedimentos", e.target.value)}
                    rows={5}
                    placeholder="Descreva os procedimentos a serem seguidos..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link to="/admin/models">
                  <Button variant="outline">Cancelar</Button>
                </Link>
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Atualizar" : "Salvar"} Modelo
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ModelsForm;
