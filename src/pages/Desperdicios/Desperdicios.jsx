import React, { useContext, useState } from 'react';
import { AppDataContext } from '../../context/AppDataContext';

const Desperdicios = () => {
  const { losses, addLoss, bottles } = useContext(AppDataContext);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    productName: '',
    quantity: '',
    unit: 'ml',
    reason: 'Vazamento',
    obs: '',
    employee: 'Gerente'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calcula custo aproximado baseado no volume (mock simples)
    let calcCost = 0;
    const bottle = bottles.find(b => b.name === form.productName);
    if (bottle) {
      const unitCost = bottle.cost / bottle.volumeMl;
      calcCost = unitCost * parseFloat(form.quantity);
    } else {
      calcCost = parseFloat(form.quantity) * 0.1; // fallback
    }

    const newLoss = {
      id: 'l' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      employee: form.employee,
      productName: form.productName,
      category: 'Bebida',
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      cost: calcCost,
      reason: form.reason,
      obs: form.obs
    };

    addLoss(newLoss);
    setShowForm(false);
    setForm({ ...form, productName: '', quantity: '', obs: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gold">Registro de Perdas</h1>
          <p className="text-muted">Acompanhe e registre desperdícios e quebras.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nova Perda'}
        </button>
      </div>

      {showForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Registrar Desperdício</h3>
          <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Produto</label>
              <select className="form-control" required value={form.productName} onChange={e => setForm({...form, productName: e.target.value})}>
                <option value="">Selecione...</option>
                {bottles.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
                <option value="Taça Gin">Taça Gin (Vidraria)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Motivo</label>
              <select className="form-control" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}>
                <option value="Vazamento">Vazamento</option>
                <option value="Quebrou garrafa">Quebrou garrafa</option>
                <option value="Erro preparo">Erro de preparo</option>
                <option value="Drink devolvido">Drink devolvido</option>
                <option value="Cortesia">Cortesia indevida</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantidade</label>
              <div className="flex gap-2">
                <input type="number" className="form-control" required value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
                <select className="form-control" style={{ width: '100px' }} value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                  <option value="ml">ml</option>
                  <option value="unidade">unid</option>
                  <option value="dose">dose</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Funcionário</label>
              <input type="text" className="form-control" value={form.employee} onChange={e => setForm({...form, employee: e.target.value})} />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Observações</label>
              <input type="text" className="form-control" value={form.obs} onChange={e => setForm({...form, obs: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-danger">Salvar Perda (R$)</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Histórico de Perdas</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Data/Hora</th>
                <th style={{ padding: '1rem' }}>Produto</th>
                <th style={{ padding: '1rem' }}>Qtd</th>
                <th style={{ padding: '1rem' }}>Motivo</th>
                <th style={{ padding: '1rem' }}>Custo</th>
              </tr>
            </thead>
            <tbody>
              {losses.map(loss => (
                <tr key={loss.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{loss.date} {loss.time}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{loss.productName}</td>
                  <td style={{ padding: '1rem' }}>{loss.quantity}{loss.unit}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ backgroundColor: 'var(--accent-red-light)', color: 'var(--accent-red)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {loss.reason}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>
                    R$ {loss.cost.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Desperdicios;
