import React, { useContext, useState } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';
import { MapPin } from 'lucide-react';

const MultiUnidades = () => {
  const { units, addUnit } = useContext(AppDataContext);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', manager: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    addUnit({ ...form, id: 'un' + Date.now(), active: true });
    setShowForm(false);
    setForm({ name: '', address: '', manager: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ color: 'var(--text-main)' }}>Multi Unidades</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nova Unidade'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="grid" style={{ gap: '1rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
          <div className="form-group">
            <label className="form-label">Nome da Filial / Unidade</label>
            <input type="text" className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Endereço Completo</label>
            <input type="text" className="form-control" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Gerente Responsável</label>
            <input type="text" className="form-control" value={form.manager} onChange={e => setForm({...form, manager: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-success" style={{ justifySelf: 'start' }}>Cadastrar Unidade</button>
        </form>
      )}

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {units.map(u => (
          <div key={u.id} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
              <div className="flex items-center gap-2">
                <MapPin size={20} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.1rem' }}>{u.name}</h3>
              </div>
              <span style={{ fontSize: '0.75rem', padding: '2px 6px', backgroundColor: u.active ? 'var(--accent-green-light)' : 'var(--accent-red-light)', color: u.active ? 'var(--accent-green)' : 'var(--accent-red)', borderRadius: '4px' }}>
                {u.active ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Endereço:</strong> {u.address}</p>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}><strong>Gerente:</strong> {u.manager}</p>
            <div className="flex gap-2" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}>Acessar Dashboard</button>
              <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}>Ver Estoque</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiUnidades;
