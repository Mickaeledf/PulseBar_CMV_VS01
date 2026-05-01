import React from 'react';

const Seguranca = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Segurança da Conta</h2>
      
      <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Alterar Senha</h3>
        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '400px' }}>
          <input type="password" className="form-control" placeholder="Senha Atual" />
          <input type="password" className="form-control" placeholder="Nova Senha" />
          <input type="password" className="form-control" placeholder="Confirmar Nova Senha" />
          <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => alert('Senha alterada com sucesso!')}>Atualizar Senha</button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Autenticação em Dois Fatores (2FA)</h3>
        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>Adicione uma camada extra de segurança à sua conta.</p>
        <button className="btn btn-outline">Configurar 2FA via App</button>
        <button className="btn btn-outline" style={{ marginLeft: '1rem' }}>Validação por E-mail</button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Sessões Ativas</h3>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px', marginBottom: '1rem' }}>
          <p><strong>Windows 11 - Chrome</strong> (Sessão Atual)</p>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Ativa desde hoje às 08:30 | IP: 192.168.1.10</p>
        </div>
        <button className="btn btn-danger">Encerrar todas as outras sessões</button>
      </div>
    </div>
  );
};

export default Seguranca;
