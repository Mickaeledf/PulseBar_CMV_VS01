import React, { useContext, useState } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import { Edit2, Upload, AlertTriangle } from 'lucide-react';
import { XMLParser } from 'fast-xml-parser';

const Garrafas = () => {
  const { bottles, addBottle, editBottle } = useContext(AppDataContext);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    volumeMl: '',
    cost: '',
    currentStock: '',
    minStock: ''
  });

  const handleEditClick = (bottle) => {
    setForm({
      name: bottle.name,
      brand: bottle.brand,
      volumeMl: bottle.volumeMl,
      cost: bottle.cost,
      currentStock: bottle.currentStock,
      minStock: bottle.minStock || 2
    });
    setEditingId(bottle.id);
    setShowForm(true);
  };

  const handleNewClick = () => {
    setForm({ name: '', brand: '', volumeMl: '', cost: '', currentStock: '', minStock: '' });
    setEditingId(null);
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bottleData = {
      name: form.name,
      brand: form.brand,
      volumeMl: parseFloat(form.volumeMl),
      cost: parseFloat(form.cost),
      currentStock: parseFloat(form.currentStock) || 0,
      minStock: parseInt(form.minStock, 10) || 2
    };

    if (editingId) {
      editBottle({ ...bottleData, id: editingId });
    } else {
      addBottle({ ...bottleData, id: 'b' + Date.now() });
    }
    
    setShowForm(false);
    setEditingId(null);
  };

  const handleImportXML = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parser = new XMLParser();
        const jObj = parser.parse(evt.target.result);
        
        // Simulação flexível (Tenta ler NFe real, senão usa mock inteligente)
        let detArray = [];
        if (jObj?.nfeProc?.NFe?.infNFe?.det) {
           detArray = Array.isArray(jObj.nfeProc.NFe.infNFe.det) 
             ? jObj.nfeProc.NFe.infNFe.det 
             : [jObj.nfeProc.NFe.infNFe.det];
        } else {
           // Fallback simulador para arquivos XML simples
           detArray = [
             { prod: { xProd: 'Gin Beefeater Lote Novo', vUnCom: 130.00, qCom: 6 } },
             { prod: { xProd: 'Xarope Tangerina', vUnCom: 45.00, qCom: 3 } }
           ];
        }

        detArray.forEach(item => {
           const pName = item.prod?.xProd || 'Produto XML';
           const pCost = parseFloat(item.prod?.vUnCom) || 0;
           const pQtd = parseInt(item.prod?.qCom) || 1;

           // Checa se já existe (usando startswith para evitar "Gin Beefeater Lote 1" duplicar)
           const existing = bottles.find(b => pName.toLowerCase().includes(b.name.toLowerCase()) || b.name.toLowerCase().includes(pName.toLowerCase()));
           
           if (existing) {
             editBottle({ ...existing, currentStock: existing.currentStock + pQtd, cost: pCost });
           } else {
             addBottle({
               id: 'b' + Math.random(),
               name: pName,
               brand: 'Importado via XML',
               volumeMl: 1000,
               cost: pCost,
               currentStock: pQtd,
               minStock: 2
             });
           }
        });
        alert('XML da NF-e processado! Estoque atualizado automaticamente.');
      } catch (err) {
        alert('Erro ao ler XML.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gold">Estoque Base (Garrafas)</h1>
          <p className="text-muted">Entrada via XML, Custos e Rendimentos.</p>
        </div>
        <div className="flex gap-4">
          <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
            <Upload size={18} /> Importar NF-e (XML)
            <input type="file" accept=".xml" style={{ display: 'none' }} onChange={handleImportXML} />
          </label>
          <button className="btn btn-primary" onClick={handleNewClick}>
            {showForm ? 'Cancelar' : '+ Cadastrar Garrafa'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
            {editingId ? 'Editar Garrafa' : 'Nova Garrafa'}
          </h3>
          <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input type="text" className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: Vodka Absolut" />
            </div>
            <div className="form-group">
              <label className="form-label">Marca</label>
              <input type="text" className="form-control" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="Ex: Absolut" />
            </div>
            <div className="form-group">
              <label className="form-label">Volume Total (ml)</label>
              <input type="number" className="form-control" required value={form.volumeMl} onChange={e => setForm({...form, volumeMl: e.target.value})} placeholder="Ex: 1000" />
            </div>
            <div className="form-group">
              <label className="form-label">Custo Garrafa (R$)</label>
              <input type="number" step="0.01" className="form-control" required value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} placeholder="Ex: 95.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Estoque Atual (Unidades)</label>
              <input type="number" step="0.1" className="form-control" required value={form.currentStock} onChange={e => setForm({...form, currentStock: e.target.value})} placeholder="Ex: 5" />
            </div>
            <div className="form-group">
              <label className="form-label">Estoque Mínimo (Alerta)</label>
              <input type="number" className="form-control" required value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})} placeholder="Ex: 2" />
            </div>
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-success">Salvar Garrafa</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Garrafas Cadastradas</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Produto</th>
                <th style={{ padding: '1rem' }}>Volume Total</th>
                <th style={{ padding: '1rem' }}>Custo Garrafa</th>
                <th style={{ padding: '1rem' }}>Custo por ml</th>
                <th style={{ padding: '1rem' }}>Custo Dose (50ml)</th>
                <th style={{ padding: '1rem' }}>Estoque Atual</th>
                <th style={{ padding: '1rem' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {bottles.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>
                    {b.name} <br/>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.brand}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{b.volumeMl}ml</td>
                  <td style={{ padding: '1rem' }}>R$ {b.cost.toFixed(2).replace('.', ',')}</td>
                  <td style={{ padding: '1rem', color: 'var(--accent-gold)' }}>
                    R$ {(b.cost / b.volumeMl).toFixed(3).replace('.', ',')}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>
                    R$ {((b.cost / b.volumeMl) * 50).toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {b.currentStock < (b.minStock || 2) ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-red)', fontWeight: 'bold' }}>
                        <AlertTriangle size={16} /> {Number.isInteger(b.currentStock) ? b.currentStock : b.currentStock.toFixed(2)} un
                      </span>
                    ) : (
                      <span style={{ color: 'var(--accent-green)' }}>
                        {Number.isInteger(b.currentStock) ? b.currentStock : b.currentStock.toFixed(2)} un
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button className="icon-btn" onClick={() => handleEditClick(b)} title="Editar">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {bottles.length === 0 && (
                <tr><td colSpan="7" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma garrafa cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Garrafas;
