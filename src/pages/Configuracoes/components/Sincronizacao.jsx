import React from 'react';
import { Cloud, CheckCircle, RefreshCw } from 'lucide-react';

const Sincronizacao = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Sincronização em Nuvem</h2>

      <div style={{ padding: '2rem', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--accent-green)', textAlign: 'center', marginBottom: '2rem' }}>
        <Cloud size={48} color="var(--accent-green)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}>Todos os dados sincronizados</h3>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Última sincronização: Hoje às 08:35</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <CheckCircle size={24} color="var(--accent-green)" />
          </div>
          <div>
            <p style={{ fontWeight: '500' }}>Celular (App)</p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Conectado</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <CheckCircle size={24} color="var(--accent-green)" />
          </div>
          <div>
            <p style={{ fontWeight: '500' }}>Desktop (Caixa)</p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Conectado</p>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={() => alert('Forçando sincronização manual...')}>
        <RefreshCw size={18} /> Forçar Sincronização Manual
      </button>
    </div>
  );
};

export default Sincronizacao;
