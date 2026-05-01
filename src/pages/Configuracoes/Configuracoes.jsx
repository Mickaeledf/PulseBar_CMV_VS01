import React, { useState } from 'react';
import { 
  User, Shield, Users, MapPin, Bell, 
  Palette, Lock, HelpCircle, Info, Cloud, BarChart2 
} from 'lucide-react';

import ContaPerfil from './components/ContaPerfil';
import Seguranca from './components/Seguranca';
import UsuariosPermissoes from './components/UsuariosPermissoes';
import MultiUnidades from './components/MultiUnidades';
import Notificacoes from './components/Notificacoes';
import TemaAparencia from './components/TemaAparencia';
import PrivacidadeDados from './components/PrivacidadeDados';
import Suporte from './components/Suporte';
import SobreApp from './components/SobreApp';
import Sincronizacao from './components/Sincronizacao';
import RelatoriosDesempenho from './components/RelatoriosDesempenho';

const TABS = [
  { id: 'conta', label: 'Conta e Perfil', icon: User },
  { id: 'seguranca', label: 'Segurança', icon: Shield },
  { id: 'usuarios', label: 'Usuários e Permissões', icon: Users },
  { id: 'unidades', label: 'Multi Unidades', icon: MapPin },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'tema', label: 'Tema e Aparência', icon: Palette },
  { id: 'privacidade', label: 'Privacidade e Dados', icon: Lock },
  { id: 'suporte', label: 'Suporte', icon: HelpCircle },
  { id: 'sobre', label: 'Sobre o App', icon: Info },
  { id: 'sincronizacao', label: 'Sincronização', icon: Cloud },
  { id: 'relatorios', label: 'Relatórios de Desempenho', icon: BarChart2 }
];

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('conta');

  const renderContent = () => {
    switch (activeTab) {
      case 'conta': return <ContaPerfil />;
      case 'seguranca': return <Seguranca />;
      case 'usuarios': return <UsuariosPermissoes />;
      case 'unidades': return <MultiUnidades />;
      case 'notificacoes': return <Notificacoes />;
      case 'tema': return <TemaAparencia />;
      case 'privacidade': return <PrivacidadeDados />;
      case 'suporte': return <Suporte />;
      case 'sobre': return <SobreApp />;
      case 'sincronizacao': return <Sincronizacao />;
      case 'relatorios': return <RelatoriosDesempenho />;
      default: return <ContaPerfil />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gold">Configurações & Administração</h1>
          <p className="text-muted">Gerencie as preferências, acessos e configurações gerais.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Sub Sidebar */}
        <div className="card" style={{ padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button 
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1.5rem',
                      background: 'transparent',
                      border: 'none',
                      borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
                      color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? '600' : '400',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content Area */}
        <div className="card animate-fade-in" style={{ minHeight: '500px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
