
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, Plus, Edit, Trash } from "lucide-react";

const ModelsList = () => {
  const [searchEmpresa, setSearchEmpresa] = useState("");

  // Dados de exemplo
  const modelsList = [
    {
      id: 1,
      nome: "Modelo Padrão Construção",
      empresa: "Empresa A"
    },
    {
      id: 2,
      nome: "Modelo Industrial",
      empresa: "Empresa B"
    }
  ];

  const filteredModels = modelsList.filter(model => 
    model.empresa.toLowerCase().includes(searchEmpresa.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-white">Modelos</h1>
          </div>
          <Link to="/admin/models/new">
            <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Modelo
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros de Pesquisa */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-primary" />
              Pesquisar Modelos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <div className="space-y-2">
                <Label htmlFor="searchEmpresa">Empresa</Label>
                <Input
                  id="searchEmpresa"
                  placeholder="Digite o nome da empresa"
                  value={searchEmpresa}
                  onChange={(e) => setSearchEmpresa(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados ({filteredModels.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Nome do Modelo</th>
                    <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                    <th className="text-left py-3 px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModels.map((model) => (
                    <tr key={model.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{model.nome}</td>
                      <td className="py-3 px-4">{model.empresa}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link to={`/admin/models/edit/${model.id}`}>
                            <Button size="sm" variant="outline" title="Editar">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" title="Excluir" className="text-red-600 hover:text-red-700">
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredModels.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum modelo encontrado com os filtros aplicados.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelsList;
