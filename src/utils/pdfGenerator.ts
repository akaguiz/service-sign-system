
import { OS } from '@/contexts/OSContext';
import { generateQRCodeDataURL, generateSignatureQRCode } from './qrCodeGenerator';

export const generateOSPDF = async (os: OS) => {
  // Gerar QR Code para assinatura
  const signatureUrl = generateSignatureQRCode(os.cpf);
  const qrCodeDataURL = await generateQRCodeDataURL(signatureUrl);

  // Criar o conteúdo HTML para o PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ordem de Serviço - ${os.colaborador}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .os-number {
          font-size: 18px;
          color: #666;
          margin-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-item {
          margin-bottom: 15px;
        }
        .label {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .value {
          border-bottom: 1px solid #ccc;
          padding-bottom: 2px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        .content {
          border: 1px solid #ccc;
          padding: 10px;
          min-height: 60px;
          background-color: #f9f9f9;
        }
        .signature-section {
          margin-top: 50px;
          border-top: 1px solid #333;
          padding-top: 20px;
        }
        .signature-line {
          margin-top: 40px;
          text-align: center;
        }
        .line {
          border-bottom: 1px solid #333;
          width: 300px;
          margin: 0 auto 10px;
          height: 20px;
        }
        .digital-signature {
          border: 2px solid #007bff;
          padding: 15px;
          margin: 20px auto;
          width: 400px;
          text-align: center;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .signature-canvas {
          border: 1px solid #ddd;
          margin: 10px auto;
          display: block;
          background-color: white;
          max-width: 300px;
          max-height: 120px;
          width: auto;
          height: auto;
        }
        .signature-info {
          margin-top: 20px;
          text-align: center;
          color: #28a745;
          font-weight: bold;
        }
        .qr-section {
          margin-top: 30px;
          text-align: center;
          border: 1px solid #ddd;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .qr-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        .qr-image {
          margin: 10px 0;
        }
        .qr-instructions {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
        @media print {
          body { margin: 0; }
          .signature-canvas, .qr-image img {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">ORDEM DE SERVIÇO</div>
        <div class="os-number">Nº ${os.numero || `OS-${String(parseInt(os.id) || 0).padStart(3, '0')}`}</div>
        <div>${os.filial}</div>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="label">Colaborador:</div>
          <div class="value">${os.colaborador}</div>
        </div>
        <div class="info-item">
          <div class="label">CPF:</div>
          <div class="value">${os.cpf}</div>
        </div>
        <div class="info-item">
          <div class="label">Função:</div>
          <div class="value">${os.funcao}</div>
        </div>
        <div class="info-item">
          <div class="label">Data de Emissão:</div>
          <div class="value">${new Date(os.dataEmissao).toLocaleDateString('pt-BR')}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Riscos Identificados</div>
        <div class="content">${os.riscos}</div>
      </div>

      <div class="section">
        <div class="section-title">Equipamentos de Proteção Individual (EPIs)</div>
        <div class="content">${os.epis}</div>
      </div>

      ${os.obrigacoes ? `
        <div class="section">
          <div class="section-title">Obrigações do Colaborador</div>
          <div class="content">${os.obrigacoes}</div>
        </div>
      ` : ''}

      ${os.proibicoes ? `
        <div class="section">
          <div class="section-title">Proibições</div>
          <div class="content">${os.proibicoes}</div>
        </div>
      ` : ''}

      ${os.penalidades ? `
        <div class="section">
          <div class="section-title">Penalidades</div>
          <div class="content">${os.penalidades}</div>
        </div>
      ` : ''}

      ${os.termoRecebimento ? `
        <div class="section">
          <div class="section-title">Termo de Recebimento e Compromisso</div>
          <div class="content">${os.termoRecebimento}</div>
        </div>
      ` : ''}

      ${os.procedimentosAcidente ? `
        <div class="section">
          <div class="section-title">Procedimentos em Caso de Acidente</div>
          <div class="content">${os.procedimentosAcidente}</div>
        </div>
      ` : ''}

      ${qrCodeDataURL ? `
        <div class="qr-section">
          <div class="qr-title">QR Code para Assinatura Digital</div>
          <div class="qr-image">
            <img src="${qrCodeDataURL}" alt="QR Code para Assinatura" style="width: 150px; height: 150px;" />
          </div>
          <div class="qr-instructions">
            Escaneie este QR Code com seu smartphone para acessar o sistema de assinatura digital
          </div>
        </div>
      ` : ''}

      <div class="signature-section">
        ${os.status === 'assinada' && os.assinaturaCanvas ? `
          <div class="digital-signature">
            <div style="font-size: 18px; margin-bottom: 10px; color: #28a745;">✓ DOCUMENTO ASSINADO DIGITALMENTE</div>
            
            <div style="margin: 20px 0; text-align: left;">
              <div style="font-size: 16px; margin-bottom: 8px;"><strong>Colaborador:</strong> ${os.colaborador}</div>
              <div style="font-size: 16px; margin-bottom: 8px;"><strong>Status:</strong> Assinado Digitalmente</div>
              <div style="font-size: 16px; margin-bottom: 15px;"><strong>Data da Assinatura:</strong> ${os.dataAssinatura ? new Date(os.dataAssinatura).toLocaleDateString('pt-BR') : ''}</div>
            </div>
            
            <div style="margin: 15px 0;">
              <strong style="display: block; margin-bottom: 10px; font-size: 16px;">Assinatura Digital:</strong>
              <img src="${os.assinaturaCanvas}" class="signature-canvas" alt="Assinatura do colaborador" style="border: 1px solid #ddd; padding: 5px; background: white;" />
            </div>
          </div>
          <div class="signature-info">
            Este documento foi assinado digitalmente em ${os.dataAssinatura ? new Date(os.dataAssinatura).toLocaleDateString('pt-BR') : ''} por ${os.colaborador}
          </div>
        ` : `
          <div class="signature-line">
            <div class="line"></div>
            <div>Assinatura do Colaborador</div>
          </div>
        `}
      </div>
    </body>
    </html>
  `;

  // Criar uma nova janela para impressão
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Aguardar carregamento completo das imagens antes de imprimir
    printWindow.onload = () => {
      // Pequeno delay para garantir que as imagens sejam carregadas
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }
};
