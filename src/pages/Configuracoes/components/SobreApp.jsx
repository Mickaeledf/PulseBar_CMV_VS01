import React from 'react';

const SobreApp = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
      <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--accent-gold)', borderRadius: '16px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--bg-main)' }}>PB</span>
      </div>
      
      <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>PulseBar CMV</h2>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>Controle perdas. Proteja lucro. Cresça.</p>

      <div style={{ backgroundColor: 'var(--bg-input)', padding: '1.5rem', borderRadius: '8px', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
        <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
          <span className="text-muted">Versão:</span>
          <span>v2.4.0 (Enterprise)</span>
        </div>
        <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
          <span className="text-muted">Última Atualização:</span>
          <span>27 de Abril de 2026</span>
        </div>
        <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
          <span className="text-muted">Licença:</span>
          <span>Ativa - Plano Pro</span>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <button className="btn btn-outline" onClick={() => alert('Obrigado pela avaliação!')}>⭐ Avaliar Aplicativo</button>
      </div>
    </div>
  );
};

export default SobreApp;
