import React, { useContext, useState } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';
import { Edit2 } from 'lucide-react';

const UsuariosPermissoes = () => {
  const { users, addUser } = useContext(AppDataContext);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'Bartender', phone: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    addUser({ ...form, id: 'u' + Date.now(), active: true });
    setShowForm(false);
    setForm({ name: '', email: '', role: 'Bartender', phone: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ color: 'var(--text-main)' }}>Usuários e Permissões</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-control" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Nível de Acesso</label>
            <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="Admin Master">Admin Master</option>
              <option value="Gerente">Gerente</option>
              <option value="Supervisor">Caixa / Supervisor</option>
              <option value="Bartender">Bartender</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-success" style={{ width: '100%' }}>Salvar Usuário</button>
          </div>
        </form>
      )}

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '1rem' }}>Usuário</th>
            <th style={{ padding: '1rem' }}>Cargo</th>
            <th style={{ padding: '1rem' }}>Status</th>
            <th style={{ padding: '1rem' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>
                <p style={{ fontWeight: '500' }}>{u.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</p>
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)' }}>
                  {u.role}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>{u.active ? 'Ativo' : 'Inativo'}</td>
              <td style={{ padding: '1rem' }}>
                <button className="icon-btn"><Edit2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosPermissoes;
