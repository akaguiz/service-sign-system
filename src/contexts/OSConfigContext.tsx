
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OSField {
  id: string;
  label: string;
  content: string;
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
  { id: 'riscos', label: 'Riscos Identificados', content: '' },
  { id: 'epis', label: 'Equipamentos de Proteção (EPIs)', content: '' },
  { id: 'obrigacoes', label: 'Obrigações do Colaborador', content: '' },
  { id: 'proibicoes', label: 'Proibições', content: '' },
  { id: 'penalidades', label: 'Penalidades', content: '' },
  { id: 'termoRecebimento', label: 'Termo de Recebimento', content: '' },
  { id: 'procedimentosAcidente', label: 'Procedimentos em Caso de Acidente', content: '' },
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
