
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OSField {
  id: string;
  label: string;
  content: string;
  active: boolean;
}

export interface OSTemplate {
  id: string;
  filial: string;
  nome: string;
  fields: OSField[];
  createdAt: string;
}

interface OSConfigContextType {
  templates: OSTemplate[];
  addTemplate: (template: Omit<OSTemplate, 'id' | 'createdAt'>) => void;
  updateTemplate: (id: string, updates: Partial<OSTemplate>) => void;
  getTemplateByFilial: (filial: string) => OSTemplate | undefined;
  deleteTemplate: (id: string) => void;
  getFiliais: () => string[];
}

const defaultFields: OSField[] = [
  { id: 'obrigacoes', label: 'Obrigações do Colaborador', content: '', active: true },
  { id: 'proibicoes', label: 'Proibições', content: '', active: true },
  { id: 'penalidades', label: 'Penalidades', content: '', active: true },
  { id: 'termoRecebimento', label: 'Termo de Recebimento', content: '', active: true },
  { id: 'procedimentosAcidente', label: 'Procedimentos em Caso de Acidente', content: '', active: true },
];

const filiais = [
  'Rio Centro',
  'Barra da Tijuca',
  'Copacabana',
  'Ipanema',
  'Tijuca',
  'Vila Isabel',
  'Méier',
  'Campo Grande'
];

const OSConfigContext = createContext<OSConfigContextType | undefined>(undefined);

export const OSConfigProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<OSTemplate[]>([
    {
      id: '1',
      filial: 'Rio Centro',
      nome: 'Modelo Padrão - Rio Centro',
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

  const getTemplateByFilial = (filial: string) => {
    return templates.find(template => template.filial === filial);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const getFiliais = () => {
    return filiais;
  };

  return (
    <OSConfigContext.Provider value={{
      templates,
      addTemplate,
      updateTemplate,
      getTemplateByFilial,
      deleteTemplate,
      getFiliais
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
