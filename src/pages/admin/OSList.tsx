
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Edit, Printer, Trash2, QrCode } from "lucide-react";
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
  const { osList, deleteOS } = useOS();

  const filteredOS = osList.filter(os => {
    const nameMatch = searchName === "" || os.colaborador.toLowerCase().includes(searchName.toLowerCase());
    const cpfMatch = searchCpf === "" || os.cpf.includes(searchCpf);
    const filialMatch = searchFilial === "all" || os.filial === searchFilial;
    const statusMatch = searchStatus === "all" || os.status === searchStatus;
    
    return nameMatch && cpfMatch && filialMatch && statusMatch;
  });

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
      // Abrir uma janela com o QR Code
      const qrWindow = window.open('', '_blank', 'width=400,height=500');
      if (qrWindow) {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>QR Code - ${os.colaborador}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                text-align: center;
                background: #f5f5f5;
              }
              .container {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: inline-block;
              }
              .title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
              }
              .info {
                font-size: 14px;
                color: #666;
                margin: 10px 0;
              }
              .qr-image {
                margin: 15px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="title">QR Code para Assinatura</div>
              <div class="info"><strong>OS:</strong> ${os.numero}</div>
              <div class="info"><strong>Colaborador:</strong> ${os.colaborador}</div>
              <div class="info"><strong>CPF:</strong> ${os.cpf}</div>
              <div class="qr-image">
                <img src="${qrCode}" alt="QR Code" style="width: 200px; height: 200px;" />
              </div>
              <div class="info" style="font-size: 12px;">
                Escaneie para acessar a assinatura digital
              </div>
            </div>
          </body>
          </html>
        `;
        
        qrWindow.document.write(htmlContent);
        qrWindow.document.close();
      }
    }
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
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                    </div>
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
                      <Label htmlFor="searchFilial">Filial</Label>
                      <Select value={searchFilial} onValueChange={setSearchFilial}>
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
                      <Select value={searchStatus} onValueChange={setSearchStatus}>
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
                  <CardTitle>Resultados ({filteredOS.length})</CardTitle>
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
                        {filteredOS.map((os) => (
                          <tr key={os.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono">{os.numero || `OS-${String(parseInt(os.id) || 0).padStart(3, '0')}`}</td>
                            <td className="py-3 px-4">{os.colaborador}</td>
                            <td className="py-3 px-4">{os.funcao}</td>
                            <td className="py-3 px-4">{os.cpf}</td>
                            <td className="py-3 px-4">{os.filial}</td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant={os.status === "assinada" ? "default" : "secondary"}
                                className={os.status === "assinada" ? "bg-green-600" : "bg-yellow-600"}
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
                    {filteredOS.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Nenhuma OS encontrada com os filtros aplicados.
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

export default OSList;
