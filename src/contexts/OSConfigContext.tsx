
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OSField {
  id: string;
  label: string;
  required: boolean;
  visible: boolean;
}

export interface OSTemplate {
  id: string;
  empresa: string;
  nome: string;
  fields: OSField[];
  createdAt: string;
}

interface OSConfigContextType {
  templates: OSTemplate[];
  addTemplate: (template: Omit<OSTemplate, 'id' | 'createdAt'>) => void;
  updateTemplate: (id: string, updates: Partial<OSTemplate>) => void;
  getTemplateByEmpresa: (empresa: string) => OSTemplate | undefined;
  deleteTemplate: (id: string) => void;
}

const defaultFields: OSField[] = [
  { id: 'colaborador', label: 'Nome do Colaborador', required: true, visible: true },
  { id: 'cpf', label: 'CPF', required: true, visible: true },
  { id: 'empresa', label: 'Empresa', required: true, visible: true },
  { id: 'funcao', label: 'Função', required: true, visible: true },
  { id: 'dataEmissao', label: 'Data de Emissão', required: true, visible: true },
  { id: 'riscos', label: 'Riscos Identificados', required: false, visible: true },
  { id: 'epis', label: 'Equipamentos de Proteção (EPIs)', required: false, visible: true },
  { id: 'obrigacoes', label: 'Obrigações do Colaborador', required: false, visible: true },
  { id: 'proibicoes', label: 'Proibições', required: false, visible: true },
  { id: 'penalidades', label: 'Penalidades', required: false, visible: true },
  { id: 'termoRecebimento', label: 'Termo de Recebimento', required: false, visible: true },
  { id: 'procedimentosAcidente', label: 'Procedimentos em Caso de Acidente', required: false, visible: true },
];

const OSConfigContext = createContext<OSConfigContextType | undefined>(undefined);

export const OSConfigProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<OSTemplate[]>([
    {
      id: '1',
      empresa: 'Empresa A Ltda',
      nome: 'Modelo Padrão - Empresa A',
      fields: defaultFields,
      createdAt: '2024-05-30'
    }
  ]);

  const addTemplate = (templateData: Omit<OSTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: OSTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<OSTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, ...updates } : template
    ));
  };

  const getTemplateByEmpresa = (empresa: string) => {
    return templates.find(template => template.empresa === empresa);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  return (
    <OSConfigContext.Provider value={{
      templates,
      addTemplate,
      updateTemplate,
      getTemplateByEmpresa,
      deleteTemplate
    }}>
      {children}
    </OSConfigContext.Provider>
  );
};

export const useOSConfig = () => {
  const context = useContext(OSConfigContext);
  if (!context) {
    throw new Error('useOSConfig must be used within an OSConfigProvider');
  }
  return context;
};
