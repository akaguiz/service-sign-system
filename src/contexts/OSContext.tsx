import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OS {
  id: string;
  numero: string; // Adding the numero property
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
  assinaturaCanvas?: string;
}

export interface Collaborator {
  nome: string;
  cpf: string;
  funcao: string;
  filial?: string;
}

interface OSContextType {
  osList: OS[];
  addOS: (osData: Omit<OS, 'id' | 'status' | 'numero'>) => void;
  updateOS: (id: string, updates: Partial<OS>) => void;
  deleteOS: (id: string) => void;
  getOSById: (id: string) => OS | undefined;
  getOSByCPF: (cpf: string) => OS | undefined;
  getCollaboratorByCPF: (cpf: string) => Collaborator | undefined;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const initialOSList: OS[] = [
  {
    id: '1',
    numero: 'OS-001',
    filial: 'Rio Centro',
    colaborador: 'João da Silva',
    cpf: '123.456.789-00',
    funcao: 'Auxiliar Administrativo',
    riscos: 'Ergonômicos, Queda',
    epis: 'Bota, Luva',
    obrigacoes: 'Cumprir normas',
    proibicoes: 'Fumar',
    penalidades: 'Advertência',
    termoRecebimento: 'Recebi os EPIs',
    procedimentosAcidente: 'Comunicar o superior',
    dataEmissao: '2024-01-20',
    status: 'assinada',
    assinatura: 'hash-assinatura-joao',
    dataAssinatura: '2024-01-21',
    assinaturaCanvas: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+n9UAAAAAAA//8ACPYwVAQAAAABJRU5ErkJggg=='
  },
  {
    id: '2',
    numero: 'OS-002',
    filial: 'Barra da Tijuca',
    colaborador: 'Maria Souza',
    cpf: '987.654.321-00',
    funcao: 'Técnica de Enfermagem',
    riscos: 'Biológicos, Químicos',
    epis: 'Máscara, Luva',
    obrigacoes: 'Seguir protocolos',
    proibicoes: 'Remover EPIs',
    penalidades: 'Suspensão',
    termoRecebimento: 'Estou ciente dos riscos',
    procedimentosAcidente: 'Lavar com água e sabão',
    dataEmissao: '2024-02-15',
    status: 'pendente'
  },
  {
    id: '3',
    numero: 'OS-003',
    filial: 'Copacabana',
    colaborador: 'Carlos Pereira',
    cpf: '456.789.123-00',
    funcao: 'Analista de Sistemas',
    riscos: 'Ergonômicos, Visuais',
    epis: 'Óculos, Suporte',
    obrigacoes: 'Manter postura',
    proibicoes: 'Forçar a visão',
    penalidades: 'Multa',
    termoRecebimento: 'Instruído sobre os riscos',
    procedimentosAcidente: 'Descansar a vista',
    dataEmissao: '2024-03-10',
    status: 'pendente'
  }
];

const initialCollaborators: Collaborator[] = [
  { nome: 'João da Silva', cpf: '123.456.789-00', funcao: 'Auxiliar Administrativo', filial: 'Rio Centro' },
  { nome: 'Maria Souza', cpf: '987.654.321-00', funcao: 'Técnica de Enfermagem', filial: 'Barra da Tijuca' },
  { nome: 'Carlos Pereira', cpf: '456.789.123-00', funcao: 'Analista de Sistemas', filial: 'Copacabana' },
  { nome: 'Ana Paula', cpf: '654.321.987-00', funcao: 'Gerente de Projetos', filial: 'Ipanema' },
  { nome: 'Pedro Alves', cpf: '321.654.987-00', funcao: 'Consultor Financeiro', filial: 'Tijuca' },
  { nome: 'João Silva', cpf: '123.456.789-00', funcao: 'Técnico de Segurança', filial: 'Rio Centro' },
  { nome: 'Maria Santos', cpf: '987.654.321-00', funcao: 'Operadora de Máquinas', filial: 'Barra da Tijuca' },
  { nome: 'Pedro Oliveira', cpf: '111.222.333-44', funcao: 'Soldador', filial: 'Copacabana' },
  { nome: 'Ana Costa', cpf: '555.666.777-88', funcao: 'Técnica em Eletrônica', filial: 'Ipanema' },
  { nome: 'Carlos Mendes', cpf: '999.888.777-66', funcao: 'Operador de Empilhadeira', filial: 'Tijuca' },
  { nome: 'Lucia Ferreira', cpf: '222.333.444-55', funcao: 'Auxiliar de Produção', filial: 'Rio Centro' },
  { nome: 'Roberto Alves', cpf: '444.555.666-77', funcao: 'Mecânico Industrial', filial: 'Barra da Tijuca' },
  { nome: 'Fernanda Lima', cpf: '666.777.888-99', funcao: 'Técnica de Qualidade', filial: 'Copacabana' },
  { nome: 'José Rodrigues', cpf: '333.444.555-66', funcao: 'Eletricista', filial: 'Ipanema' },
  { nome: 'Patricia Sousa', cpf: '777.888.999-00', funcao: 'Supervisora de Produção', filial: 'Tijuca' }
];

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [osList, setOsList] = useState<OS[]>(initialOSList);
  const [collaborators] = useState<Collaborator[]>(initialCollaborators);

  const addOS = (osData: Omit<OS, 'id' | 'status' | 'numero'>) => {
    const newOSNumber = `OS-${String(osList.length + 1).padStart(3, '0')}`;
    const newOS: OS = {
      ...osData,
      id: Date.now().toString(),
      numero: newOSNumber,
      status: 'pendente'
    };
    setOsList(prev => [...prev, newOS]);
  };

  const updateOS = (id: string, updates: Partial<OS>) => {
    setOsList(prev => prev.map(os => 
      os.id === id ? { ...os, ...updates } : os
    ));
  };

  const deleteOS = (id: string) => {
    setOsList(prev => prev.filter(os => os.id !== id));
  };

  const getOSById = (id: string) => {
    return osList.find(os => os.id === id);
  };

  const getOSByCPF = (cpf: string) => {
    const cleanInputCPF = cpf.replace(/\D/g, '');
    console.log('Buscando OS para CPF:', cpf);
    console.log('Lista de OSs disponíveis:', osList.map(os => ({ id: os.id, cpf: os.cpf, colaborador: os.colaborador })));
    
    const foundOS = osList.find(os => {
      const normalizedOSCPF = os.cpf.replace(/\D/g, '');
      console.log('Comparando:', cleanInputCPF, 'com', normalizedOSCPF);
      return normalizedOSCPF === cleanInputCPF;
    });
    
    console.log('OS encontrada:', foundOS);
    return foundOS;
  };

  const getCollaboratorByCPF = (cpf: string) => {
    const cleanInputCPF = cpf.replace(/\D/g, '');
    console.log('Buscando colaborador para CPF:', cpf);
    console.log('Lista de colaboradores disponíveis:', collaborators.map(c => ({ cpf: c.cpf, nome: c.nome, funcao: c.funcao, filial: c.filial })));
    
    const foundCollaborator = collaborators.find(collaborator => {
      const normalizedCollaboratorCPF = collaborator.cpf.replace(/\D/g, '');
      console.log('Comparando colaborador:', cleanInputCPF, 'com', normalizedCollaboratorCPF);
      return normalizedCollaboratorCPF === cleanInputCPF;
    });
    
    console.log('Colaborador encontrado:', foundCollaborator);
    return foundCollaborator;
  };

  return (
    <OSContext.Provider value={{
      osList,
      addOS,
      updateOS,
      deleteOS,
      getOSById,
      getOSByCPF,
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
