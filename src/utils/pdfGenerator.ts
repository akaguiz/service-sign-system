
import { OS } from '@/contexts/OSContext';

export const generateOSPDF = (os: OS) => {
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
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">ORDEM DE SERVIÇO</div>
        <div>${os.empresa} - Filial: ${os.filial}</div>
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

      <div class="section">
        <div class="section-title">Obrigações do Colaborador</div>
        <div class="content">${os.obrigacoes}</div>
      </div>

      <div class="section">
        <div class="section-title">Proibições</div>
        <div class="content">${os.proibicoes}</div>
      </div>

      <div class="section">
        <div class="section-title">Penalidades</div>
        <div class="content">${os.penalidades}</div>
      </div>

      <div class="section">
        <div class="section-title">Termo de Recebimento e Compromisso</div>
        <div class="content">${os.termoRecebimento}</div>
      </div>

      <div class="section">
        <div class="section-title">Procedimentos em Caso de Acidente</div>
        <div class="content">${os.procedimentosAcidente}</div>
      </div>

      <div class="signature-section">
        <div class="signature-line">
          <div class="line"></div>
          <div>Assinatura do Colaborador</div>
        </div>
        ${os.status === 'assinada' ? `
          <div style="margin-top: 20px; text-align: center;">
            <strong>Documento assinado em: ${os.dataAssinatura ? new Date(os.dataAssinatura).toLocaleDateString('pt-BR') : ''}</strong>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;

  // Criar uma nova janela para impressão
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }
};
