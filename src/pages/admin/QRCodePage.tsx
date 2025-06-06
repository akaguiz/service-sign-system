
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, QrCode } from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { generateQRCodeDataURL, generateSignatureQRCode } from "@/utils/qrCodeGenerator";

const QRCodePage = () => {
  const [cpf, setCpf] = useState("");
  const [qrCodeDataURL, setQrCodeDataURL] = useState("");

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
    
    setCpf(formatted);
  };

  const generateQRCode = async () => {
    if (cpf.trim() === "") {
      alert("Por favor, insira um CPF válido.");
      return;
    }

    // Usar o CPF formatado para a URL
    const signatureUrl = generateSignatureQRCode(cpf);
    console.log('URL gerada para QR Code:', signatureUrl);
    const qrCode = await generateQRCodeDataURL(signatureUrl);
    setQrCodeDataURL(qrCode);
  };

  const handlePrint = () => {
    if (!qrCodeDataURL) {
      alert("Gere o QR Code primeiro.");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>QR Code - Assinatura Digital</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 40px;
              text-align: center;
              background: white;
            }
            .qr-container {
              display: inline-block;
              padding: 40px;
              border: 2px solid #333;
              border-radius: 10px;
              background: white;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #333;
            }
            .qr-image {
              margin: 20px 0;
            }
            .instructions {
              font-size: 16px;
              color: #666;
              margin-top: 20px;
              max-width: 400px;
              line-height: 1.5;
            }
            .cpf-info {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              margin: 15px 0;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 20px;
              }
              .qr-container {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="title">QR Code - Assinatura Digital</div>
            <div class="cpf-info">CPF: ${cpf}</div>
            <div class="qr-image">
              <img src="${qrCodeDataURL}" alt="QR Code para Assinatura" style="width: 300px; height: 300px;" />
            </div>
            <div class="instructions">
              Escaneie este QR Code com seu smartphone para acessar o sistema de assinatura digital da Ordem de Serviço.
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    }
  };

  // Gerar QR Code automaticamente quando o componente carregar com um CPF padrão
  useEffect(() => {
    if (cpf === "") {
      setCpf("123.456.789-00"); // CPF padrão para demonstração
    }
  }, []);

  useEffect(() => {
    if (cpf.length === 14) { // CPF formatado completo
      generateQRCode();
    }
  }, [cpf]);

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
                <h1 className="text-2xl font-bold text-white">QR Code - Assinatura Digital</h1>
              </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2 text-primary" />
                    Gerar QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF do Colaborador</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="cpf"
                          value={cpf}
                          onChange={(e) => formatCPF(e.target.value)}
                          placeholder="000.000.000-00"
                          maxLength={14}
                        />
                        <Button onClick={generateQRCode} className="bg-primary hover:bg-primary-hover">
                          Gerar QR Code
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {qrCodeDataURL && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>QR Code Gerado</CardTitle>
                      <Button onClick={handlePrint} variant="outline">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="inline-block p-6 border-2 border-gray-300 rounded-lg bg-white">
                        <img 
                          src={qrCodeDataURL} 
                          alt="QR Code para Assinatura" 
                          className="w-80 h-80 mx-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">CPF: {cpf}</p>
                        <p className="text-gray-600 max-w-md mx-auto">
                          Escaneie este QR Code com seu smartphone para acessar o sistema de assinatura digital da Ordem de Serviço.
                        </p>
                        <p className="text-sm text-gray-500">
                          Link: {generateSignatureQRCode(cpf)}
                        </p>
                      </div>
                    </div>
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

export default QRCodePage;
