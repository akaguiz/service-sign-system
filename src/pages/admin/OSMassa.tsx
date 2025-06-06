import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, ChevronRight } from "lucide-react";
import { useOS, Collaborator } from "@/contexts/OSContext";
import { useOSConfig } from "@/contexts/OSConfigContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const OSMassa = () => {
  const navigate = useNavigate();
  const { getCollaboratorByCPF } = useOS();
  const { getFiliais } = useOSConfig();
  
  // Lista de colaboradores (usando a mesma do contexto)
  const allCollaborators: Collaborator[] = [
    { nome: 'João da Silva', cpf: '123.456.789-00', funcao: 'Auxiliar Administrativo', filial: 'Rio Centro' },
    { nome: 'Maria Souza', cpf: '987.654.321-00', funcao: 'Técnica de Enfermagem', filial: 'Barra da Tijuca' },
    { nome: 'Carlos Pereira', cpf: '456.789.123-00', funcao: 'Analista de Sistemas', filial: 'Copacabana' },
    { nome: 'Ana Paula', cpf: '654.321.987-00', funcao: 'Gerente de Projetos', filial: 'Ipanema' },
    { nome: 'Pedro Alves', cpf: '321.654.987-00', funcao: 'Consultor Financeiro', filial: 'Tijuca' },
    { nome: 'João Silva', cpf: '123.456.789-01', funcao: 'Técnico de Segurança', filial: 'Rio Centro' },
    { nome: 'Maria Santos', cpf: '987.654.321-01', funcao: 'Operadora de Máquinas', filial: 'Barra da Tijuca' },
    { nome: 'Pedro Oliveira', cpf: '111.222.333-44', funcao: 'Soldador', filial: 'Copacabana' },
    { nome: 'Ana Costa', cpf: '555.666.777-88', funcao: 'Técnica em Eletrônica', filial: 'Ipanema' },
    { nome: 'Carlos Mendes', cpf: '999.888.777-66', funcao: 'Operador de Empilhadeira', filial: 'Tijuca' },
    { nome: 'Lucia Ferreira', cpf: '222.333.444-55', funcao: 'Auxiliar de Produção', filial: 'Rio Centro' },
    { nome: 'Roberto Alves', cpf: '444.555.666-77', funcao: 'Mecânico Industrial', filial: 'Barra da Tijuca' },
    { nome: 'Fernanda Lima', cpf: '666.777.888-99', funcao: 'Técnica de Qualidade', filial: 'Copacabana' },
    { nome: 'José Rodrigues', cpf: '333.444.555-66', funcao: 'Eletricista', filial: 'Ipanema' },
    { nome: 'Patricia Sousa', cpf: '777.888.999-00', funcao: 'Supervisora de Produção', filial: 'Tijuca' }
  ];

  // Lista única de funções para o dropdown
  const uniqueFuncoes = [...new Set(allCollaborators.map(c => c.funcao))].sort();

  const [searchCpf, setSearchCpf] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchFuncao, setSearchFuncao] = useState("all");
  const [searchFilial, setSearchFilial] = useState("all");
  const [selectedCollaborators, setSelectedCollaborators] = useState<Collaborator[]>([]);

  const filteredCollaborators = allCollaborators.filter(collaborator => {
    const cpfMatch = searchCpf === "" || collaborator.cpf.includes(searchCpf);
    const nameMatch = searchName === "" || collaborator.nome.toLowerCase().includes(searchName.toLowerCase());
    const funcaoMatch = searchFuncao === "all" || collaborator.funcao === searchFuncao;
    const filialMatch = searchFilial === "all" || (collaborator.filial && collaborator.filial === searchFilial);
    
    return cpfMatch && nameMatch && funcaoMatch && filialMatch;
  });

  const handleSelectCollaborator = (collaborator: Collaborator, checked: boolean) => {
    if (checked) {
      setSelectedCollaborators(prev => [...prev, collaborator]);
    } else {
      setSelectedCollaborators(prev => prev.filter(c => c.cpf !== collaborator.cpf));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCollaborators(filteredCollaborators);
    } else {
      setSelectedCollaborators([]);
    }
  };

  const isSelected = (collaborator: Collaborator) => {
    return selectedCollaborators.some(c => c.cpf === collaborator.cpf);
  };

  const handleCreateMassOS = () => {
    if (selectedCollaborators.length === 0) {
      alert("Selecione pelo menos um colaborador.");
      return;
    }
    
    // Navegar para o formulário de OS em massa
    const cpfs = selectedCollaborators.map(c => c.cpf).join(',');
    navigate(`/admin/os/mass-form?collaborators=${encodeURIComponent(cpfs)}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-primary shadow-sm">
              <div className="container mx-auto px-4 py-4 flex items-center">
                <SidebarTrigger className="mr-4 text-white hover:bg-white/10" />
                <h1 className="text-2xl font-bold text-white">OS em Massa</h1>
              </div>
            </header>

            <div className="container mx-auto px-4 py-8">
              {/* Filtros de Pesquisa */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="w-5 h-5 mr-2 text-primary" />
                    Filtros de Busca
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="searchCpf">CPF</Label>
                      <Input
                        id="searchCpf"
                        placeholder="Digite o CPF"
                        value={searchCpf}
                        onChange={(e) => setSearchCpf(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchName">Nome</Label>
                      <Input
                        id="searchName"
                        placeholder="Digite o nome"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchFuncao">Função</Label>
                      <Input
                        id="searchFuncao"
                        placeholder="Digite a função"
                        value={searchFuncao}
                        onChange={(e) => setSearchFuncao(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchFilial">Filial</Label>
                      <Select value={searchFilial} onValueChange={setSearchFilial}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a filial" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as filiais</SelectItem>
                          {getFiliais().map(filial => (
                            <SelectItem key={filial} value={filial}>{filial}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seleção e Resultados */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Colaboradores ({filteredCollaborators.length}) - {selectedCollaborators.length} selecionados
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="selectAll"
                          checked={selectedCollaborators.length === filteredCollaborators.length && filteredCollaborators.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <Label htmlFor="selectAll">Marcar/Desmarcar Todos</Label>
                      </div>
                      <Button 
                        onClick={handleCreateMassOS}
                        disabled={selectedCollaborators.length === 0}
                        className="bg-primary hover:bg-primary-hover"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Criar OS em Massa ({selectedCollaborators.length})
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold w-16">
                            <Checkbox
                              checked={selectedCollaborators.length === filteredCollaborators.length && filteredCollaborators.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">CPF</th>
                          <th className="text-left py-3 px-4 font-semibold">Nome</th>
                          <th className="text-left py-3 px-4 font-semibold">Função</th>
                          <th className="text-left py-3 px-4 font-semibold">Filial</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCollaborators.map((collaborator, index) => (
                          <tr key={collaborator.cpf} className={`border-b hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="py-3 px-4">
                              <Checkbox
                                checked={isSelected(collaborator)}
                                onCheckedChange={(checked) => handleSelectCollaborator(collaborator, !!checked)}
                              />
                            </td>
                            <td className="py-3 px-4 font-mono">{collaborator.cpf}</td>
                            <td className="py-3 px-4">{collaborator.nome}</td>
                            <td className="py-3 px-4">{collaborator.funcao}</td>
                            <td className="py-3 px-4">{collaborator.filial}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredCollaborators.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum colaborador encontrado com os filtros aplicados.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default OSMassa;
