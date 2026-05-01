import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="flex items-center gap-4">
        {/* Futuro botão mobile menu: <button className="icon-btn"><Menu size={24} /></button> */}
        <h2 className="header-title">Controle Operacional</h2>
      </div>

      <div className="header-actions">
        <button className="icon-btn">
          <Search size={20} />
        </button>
        
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        <div className="user-profile">
          <div className="avatar">G</div>
          <div className="user-info">
            <span className="user-name">Gerente</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
