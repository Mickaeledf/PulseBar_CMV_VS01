import React from 'react';
import { Download, Trash2 } from 'lucide-react';

const PrivacidadeDados = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Privacidade e Dados</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Gerenciamento de Dados</h3>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
          O PulseBar armazena seus dados localmente ou na nuvem sincronizada (se ativo). Você pode exportar uma cópia de tudo a qualquer momento.
        </p>
        <button className="btn btn-outline" onClick={() => alert('Download do backup gerado! (Simulação)')}>
          <Download size={18} /> Exportar todos os dados (JSON)
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Termos e Políticas</h3>
        <ul style={{ listStyle: 'none' }}>
          <li style={{ padding: '0.5rem 0' }}><a href="#" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>Política de Privacidade</a></li>
          <li style={{ padding: '0.5rem 0' }}><a href="#" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>Termos de Uso do SaaS</a></li>
        </ul>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--accent-red)' }}>Zona de Perigo</h3>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
          Cuidado. Ao solicitar a exclusão, todos os seus dados de bar, funcionários e estoques serão permanentemente deletados.
        </p>
        <button className="btn btn-danger">
          <Trash2 size={18} /> Solicitar Exclusão da Conta
        </button>
      </div>
    </div>
  );
};

export default PrivacidadeDados;
