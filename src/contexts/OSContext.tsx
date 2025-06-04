import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OS {
  id: string;
  numero: string; // Adicionar numeração de 4 dígitos
  filial: string;
  colaborador: string;
  cpf: string;
  funcao: string;
  riscos: string;
  epis: string;
  obrigacoes: string;
  proibicoes: string;
  penalidades: string;
  termoRecebimento: string;
  procedimentosAcidente: string;
  dataEmissao: string;
  status: 'pendente' | 'assinada';
  assinatura?: string;
  dataAssinatura?: string;
}

interface OSContextType {
  osList: OS[];
  addOS: (os: Omit<OS, 'id' | 'status' | 'numero'>) => void;
  updateOS: (id: string, os: Partial<OS>) => void;
  deleteOS: (id: string) => void;
  getOSById: (id: string) => OS | undefined;
  getOSByCPF: (cpf: string) => OS | undefined;
  searchOS: (colaborador: string, cpf: string) => OS[];
  getCollaboratorByCPF: (cpf: string) => { nome: string; funcao: string; filial?: string } | undefined;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

// Base expandida de colaboradores
const colaboradores = [
  { cpf: '123.456.789-00', nome: 'João Silva', funcao: 'Técnico de Segurança', filial: 'Rio Centro' },
  { cpf: '987.654.321-00', nome: 'Maria Santos', funcao: 'Operadora de Máquinas', filial: 'Barra da Tijuca' },
  { cpf: '111.222.333-44', nome: 'Pedro Oliveira', funcao: 'Soldador', filial: 'Copacabana' },
  { cpf: '555.666.777-88', nome: 'Ana Costa', funcao: 'Técnica em Eletrônica', filial: 'Ipanema' },
  { cpf: '999.888.777-66', nome: 'Carlos Mendes', funcao: 'Operador de Empilhadeira', filial: 'Tijuca' },
  { cpf: '222.333.444-55', nome: 'Lucia Ferreira', funcao: 'Auxiliar de Produção', filial: 'Vila Isabel' },
  { cpf: '444.555.666-77', nome: 'Roberto Alves', funcao: 'Mecânico Industrial', filial: 'Méier' },
  { cpf: '666.777.888-99', nome: 'Fernanda Lima', funcao: 'Técnica de Qualidade', filial: 'Campo Grande' },
  { cpf: '333.444.555-66', nome: 'José Rodrigues', funcao: 'Eletricista', filial: 'Rio Centro' },
  { cpf: '777.888.999-00', nome: 'Patricia Sousa', funcao: 'Supervisora de Produção', filial: 'Barra da Tijuca' }
];

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [osList, setOSList] = useState<OS[]>([
    {
      id: '1',
      numero: '0001',
      filial: 'Rio Centro',
      colaborador: 'João Silva',
      cpf: '123.456.789-00',
      funcao: 'Técnico de Segurança',
      riscos: 'Trabalho em altura, exposição a ruído, manuseio de equipamentos',
      epis: 'Capacete, óculos de proteção, luvas, calçado de segurança, protetor auricular',
      obrigacoes: 'Utilizar EPIs obrigatórios, seguir procedimentos de segurança, reportar incidentes',
      proibicoes: 'Não utilizar equipamentos sem treinamento, não remover proteções de segurança',
      penalidades: 'Advertência verbal, advertência escrita, suspensão, demissão por justa causa',
      termoRecebimento: 'Declaro ter recebido e compreendido todas as orientações de segurança',
      procedimentosAcidente: 'Comunicar imediatamente o supervisor, buscar atendimento médico se necessário',
      dataEmissao: '2024-05-30',
      status: 'pendente'
    },
    {
      id: '2',
      numero: '0002',
      filial: 'Barra da Tijuca',
      colaborador: 'Maria Santos',
      cpf: '987.654.321-00',
      funcao: 'Operadora de Máquinas',
      riscos: 'Operação de equipamentos pesados, ruído industrial',
      epis: 'Capacete, protetor auricular, luvas de segurança, calçado de segurança',
      obrigacoes: 'Seguir procedimentos operacionais, manter equipamentos limpos',
      proibicoes: 'Não operar equipamentos sob efeito de substâncias, não burlar proteções',
      penalidades: 'Advertência, suspensão, demissão por justa causa conforme gravidade',
      termoRecebimento: 'Confirmo o recebimento e entendimento das normas de segurança',
      procedimentosAcidente: 'Parar atividades, comunicar supervisor, procurar atendimento médico',
      dataEmissao: '2024-05-29',
      status: 'assinada',
      assinatura: 'Maria Santos',
      dataAssinatura: '2024-05-29'
    }
  ]);

  const generateOSNumber = () => {
    const maxNumber = osList.reduce((max, os) => {
      const num = parseInt(os.numero);
      return num > max ? num : max;
    }, 0);
    return (maxNumber + 1).toString().padStart(4, '0');
  };

  const addOS = (osData: Omit<OS, 'id' | 'status' | 'numero'>) => {
    const newOS: OS = {
      ...osData,
      id: Date.now().toString(),
      numero: generateOSNumber(),
      status: 'pendente'
    };
    console.log('Adicionando nova OS:', newOS);
    setOSList(prev => [...prev, newOS]);
  };

  const updateOS = (id: string, updates: Partial<OS>) => {
    setOSList(prev => prev.map(os => 
      os.id === id ? { ...os, ...updates } : os
    ));
  };

  const deleteOS = (id: string) => {
    setOSList(prev => prev.filter(os => os.id !== id));
  };

  const getOSById = (id: string) => {
    return osList.find(os => os.id === id);
  };

  const getOSByCPF = (cpf: string) => {
    console.log('Buscando OS para CPF:', cpf);
    console.log('Lista de OSs disponíveis:', osList.map(os => ({ id: os.id, cpf: os.cpf, colaborador: os.colaborador })));
    
    // Normalizar CPF removendo formatação
    const normalizedSearchCPF = cpf.replace(/\D/g, '');
    
    const foundOS = osList.find(os => {
      const normalizedOSCPF = os.cpf.replace(/\D/g, '');
      console.log(`Comparando: ${normalizedSearchCPF} com ${normalizedOSCPF}`);
      return normalizedOSCPF === normalizedSearchCPF;
    });

    console.log('OS encontrada:', foundOS);
    return foundOS;
  };

  const getCollaboratorByCPF = (cpf: string) => {
    console.log('Buscando colaborador para CPF:', cpf);
    console.log('Lista de colaboradores disponíveis:', colaboradores.map(col => ({ cpf: col.cpf, nome: col.nome, funcao: col.funcao, filial: col.filial })));
    
    const normalizedSearchCPF = cpf.replace(/\D/g, '');
    const foundCollaborator = colaboradores.find(col => {
      const normalizedColCPF = col.cpf.replace(/\D/g, '');
      console.log(`Comparando colaborador: ${normalizedSearchCPF} com ${normalizedColCPF}`);
      return normalizedColCPF === normalizedSearchCPF;
    });
    
    console.log('Colaborador encontrado:', foundCollaborator);
    return foundCollaborator;
  };

  const searchOS = (colaborador: string, cpf: string) => {
    return osList.filter(os => 
      os.colaborador.toLowerCase().includes(colaborador.toLowerCase()) &&
      os.cpf.includes(cpf)
    );
  };

  return (
    <OSContext.Provider value={{
      osList,
      addOS,
      updateOS,
      deleteOS,
      getOSById,
      getOSByCPF,
      searchOS,
      getCollaboratorByCPF
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
