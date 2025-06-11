
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Search, Plus, Eye, Edit, Printer, Trash2, QrCode, X } from "lucide-react";
import { useOS } from "@/contexts/OSContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { generateOSPDF } from "@/utils/pdfGenerator";
import { generateQRCodeDataURL, generateSignatureQRCode } from "@/utils/qrCodeGenerator";
import { toast } from "@/hooks/use-toast";

const filiais = ["Rio Centro", "Barra da Tijuca", "Ipanema"];

const OSList = () => {
  const [searchName, setSearchName] = useState("");
  const [searchCpf, setSearchCpf] = useState("");
  const [searchFilial, setSearchFilial] = useState("all");
  const [searchStatus, setSearchStatus] = useState("all");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState("");
  const [currentOS, setCurrentOS] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { osList, deleteOS } = useOS();

  const recordsPerPage = 10;

  const filteredOS = osList.filter(os => {
    const nameMatch = searchName === "" || os.colaborador.toLowerCase().includes(searchName.toLowerCase());
    const cpfMatch = searchCpf === "" || os.cpf.includes(searchCpf);
    const filialMatch = searchFilial === "all" || os.filial === searchFilial;
    const statusMatch = searchStatus === "all" || os.status === searchStatus;
    
    return nameMatch && cpfMatch && filialMatch && statusMatch;
  });

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredOS.length / recordsPerPage);

  // Obter registros da página atual
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredOS.slice(startIndex, endIndex);

  // Reset da página quando os filtros mudam
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handlePrint = (os: any) => {
    generateOSPDF(os);
  };

  const handleDelete = (os: any) => {
    if (os.status === 'assinada') {
      toast({
        title: "Erro",
        description: "Não é possível excluir uma OS já assinada.",
        variant: "destructive"
      });
      return;
    }

    if (confirm(`Tem certeza que deseja excluir a OS ${os.numero} de ${os.colaborador}?`)) {
      deleteOS(os.id);
      toast({
        title: "OS excluída",
        description: "A ordem de serviço foi excluída com sucesso."
      });
    }
  };

  const handleShowQRCode = async (os: any) => {
    const signatureUrl = generateSignatureQRCode(os.cpf);
    const qrCode = await generateQRCodeDataURL(signatureUrl);
    
    if (qrCode) {
      setCurrentQRCode(qrCode);
      setCurrentOS(os);
      setQrModalOpen(true);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Primeira página
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Ellipsis se necessário
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Páginas do meio
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Ellipsis se necessário
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Última página
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
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
                  <h1 className="text-2xl font-bold text-white">Ordens de Serviço</h1>
                </div>
                <Link to="/admin/cpf-search">
                  <Button variant="outline" size="sm" className="text-primary border-white hover:bg-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova OS
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
                    Pesquisar OS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="searchName">Nome do Colaborador</Label>
                      <Input
                        id="searchName"
                        placeholder="Digite o nome do colaborador"
                        value={searchName}
                        onChange={(e) => {
                          setSearchName(e.target.value);
                          handleFilterChange();
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchCpf">CPF</Label>
                      <Input
                        id="searchCpf"
                        placeholder="Digite o CPF"
                        value={searchCpf}
                        onChange={(e) => {
                          setSearchCpf(e.target.value);
                          handleFilterChange();
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchFilial">Filial</Label>
                      <Select value={searchFilial} onValueChange={(value) => {
                        setSearchFilial(value);
                        handleFilterChange();
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a filial" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as filiais</SelectItem>
                          {filiais.map((filial) => (
                            <SelectItem key={filial} value={filial}>
                              {filial}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchStatus">Status</Label>
                      <Select value={searchStatus} onValueChange={(value) => {
                        setSearchStatus(value);
                        handleFilterChange();
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os status</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="assinada">Assinada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabela de Resultados */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Resultados ({filteredOS.length}) - Página {currentPage} de {totalPages}
                    </CardTitle>
                    <div className="text-sm text-gray-600">
                      Exibindo {startIndex + 1} a {Math.min(endIndex, filteredOS.length)} de {filteredOS.length} registros
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Nº OS</th>
                          <th className="text-left py-3 px-4 font-semibold">Colaborador</th>
                          <th className="text-left py-3 px-4 font-semibold">Função</th>
                          <th className="text-left py-3 px-4 font-semibold">CPF</th>
                          <th className="text-left py-3 px-4 font-semibold">Filial</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.map((os) => (
                          <tr key={os.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono">{os.numero || `OS-${String(parseInt(os.id) || 0).padStart(3, '0')}`}</td>
                            <td className="py-3 px-4">{os.colaborador}</td>
                            <td className="py-3 px-4">{os.funcao}</td>
                            <td className="py-3 px-4">{os.cpf}</td>
                            <td className="py-3 px-4">{os.filial}</td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant={os.status === "assinada" ? "default" : "warning"}
                                className={os.status === "assinada" ? "bg-green-600" : ""}
                              >
                                {os.status === "assinada" ? "Assinada" : "Pendente"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Link to={`/admin/os/view/${os.id}`}>
                                  <Button size="sm" variant="outline" title="Visualizar">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Link to={`/admin/os/edit/${os.id}`}>
                                  <Button size="sm" variant="outline" title="Editar">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  title="Imprimir"
                                  onClick={() => handlePrint(os)}
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  title="QR Code"
                                  onClick={() => handleShowQRCode(os)}
                                >
                                  <QrCode className="w-4 h-4" />
                                </Button>
                                {os.status === 'pendente' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    title="Excluir"
                                    onClick={() => handleDelete(os)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {currentRecords.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Nenhuma OS encontrada com os filtros aplicados.
                      </div>
                    )}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {renderPaginationItems()}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Modal do QR Code */}
              <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">QR Code para Assinatura</DialogTitle>
                  </DialogHeader>
                  <div className="text-center space-y-4 py-4">
                    {currentOS && (
                      <>
                        <div className="space-y-2">
                          <p className="font-semibold">OS: {currentOS.numero || `OS-${String(parseInt(currentOS.id) || 0).padStart(3, '0')}`}</p>
                          <p><strong>Colaborador:</strong> {currentOS.colaborador}</p>
                          <p><strong>CPF:</strong> {currentOS.cpf}</p>
                        </div>
                        {currentQRCode && (
                          <div className="flex justify-center">
                            <img src={currentQRCode} alt="QR Code" className="w-48 h-48" />
                          </div>
                        )}
                        <p className="text-sm text-gray-600">
                          Escaneie para acessar a assinatura digital
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Button onClick={() => setQrModalOpen(false)} variant="outline">
                      Fechar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default OSList;
