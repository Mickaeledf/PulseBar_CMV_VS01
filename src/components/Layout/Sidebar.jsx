import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wine, 
  AlertTriangle, 
  FileText, 
  Settings,
  BrainCircuit,
  Target,
  ScanBarcode,
  TrendingUp,
  Lock
} from 'lucide-react';
import { AppDataContext } from '../../context/AppDataContext';

const Sidebar = () => {
  const { subscriptionPlan } = useContext(AppDataContext);
  const isBasic = subscriptionPlan === 'basic';
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Wine size={28} color="var(--accent-gold)" />
        <h1>PulseBar <span>CMV</span></h1>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          end
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/desperdicios" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <AlertTriangle size={20} />
          <span>Perdas & Quebras</span>
        </NavLink>
        
        <NavLink 
          to="/garrafas" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <Wine size={20} />
          <span>Estoque Base</span>
        </NavLink>
        
        <NavLink 
          to={isBasic ? "/planos" : "/cardapio"} 
          className={({ isActive }) => isActive && !isBasic ? "nav-item active" : "nav-item"}
        >
          <FileText size={20} />
          <span>Fichas & CMV</span>
          {isBasic && <Lock size={14} style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }} />}
        </NavLink>
        
        <NavLink 
          to={isBasic ? "/planos" : "/ia-insights"} 
          className={({ isActive }) => isActive && !isBasic ? "nav-item active" : "nav-item"}
        >
          <BrainCircuit size={20} />
          <span>IA Insights</span>
          {isBasic && <Lock size={14} style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }} />}
        </NavLink>

        <NavLink 
          to={isBasic ? "/planos" : "/fechamento"} 
          className={({ isActive }) => isActive && !isBasic ? "nav-item active" : "nav-item"}
        >
          <Target size={20} />
          <span>Fechamento & Metas</span>
          {isBasic && <Lock size={14} style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }} />}
        </NavLink>

        <NavLink 
          to="/inventario" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <ScanBarcode size={20} />
          <span>Inventário Digital</span>
        </NavLink>

        <NavLink 
          to={isBasic ? "/planos" : "/curva-abc"} 
          className={({ isActive }) => isActive && !isBasic ? "nav-item active" : "nav-item"}
        >
          <TrendingUp size={20} />
          <span>Curva ABC</span>
          {isBasic && <Lock size={14} style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }} />}
        </NavLink>

        <div style={{ marginTop: 'auto' }}>
          <NavLink 
            to="/planos" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--accent-gold)', marginBottom: '0.5rem' }}
          >
            <TrendingUp size={20} color="var(--accent-gold)" />
            <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Meu Plano</span>
          </NavLink>
          <NavLink 
            to="/configuracoes" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
