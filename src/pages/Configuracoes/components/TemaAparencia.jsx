import React, { useContext } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';

const TemaAparencia = () => {
  const { settings, updateSettings } = useContext(AppDataContext);

  const handleThemeChange = (e) => {
    updateSettings({ theme: e.target.value });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Tema e Aparência</h2>
      
      <div className="form-group" style={{ maxWidth: '300px' }}>
        <label className="form-label">Modo de Exibição</label>
        <select className="form-control" value={settings.theme} onChange={handleThemeChange}>
          <option value="escuro">Modo Escuro (Padrão Premium)</option>
          <option value="claro">Modo Claro</option>
          <option value="automatico">Seguir sistema do dispositivo</option>
        </select>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Nota: O PulseBar CMV foi desenhado primeiramente para o modo escuro.
        </p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Cor de Destaque</h3>
        <div className="flex gap-4">
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F8E9A1', border: settings.primaryColor === '#F8E9A1' ? '3px solid white' : 'none', cursor: 'pointer' }} onClick={() => updateSettings({ primaryColor: '#F8E9A1' })} />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F76C6C', border: settings.primaryColor === '#F76C6C' ? '3px solid white' : 'none', cursor: 'pointer' }} onClick={() => updateSettings({ primaryColor: '#F76C6C' })} />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#A8D0E6', border: settings.primaryColor === '#A8D0E6' ? '3px solid white' : 'none', cursor: 'pointer' }} onClick={() => updateSettings({ primaryColor: '#A8D0E6' })} />
        </div>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>A mudança da cor de destaque requer reload na página.</p>
      </div>
    </div>
  );
};

export default TemaAparencia;
