import React, { useContext, useState } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import * as XLSX from 'xlsx';
import { Download, Upload, Plus, Trash2 } from 'lucide-react';

const Fechamento = () => {
  const { weeklyData, setWeeklyData } = useContext(AppDataContext);
  
  const [form, setForm] = useState({
    period: '', fatCozinha: '', fatBar: '', compCozinha: '', compBar: ''
  });

  const handleAddWeek = (e) => {
    e.preventDefault();
    const newWeek = {
      id: 'w' + Date.now(),
      period: form.period,
      fatCozinha: parseFloat(form.fatCozinha) || 0,
      fatBar: parseFloat(form.fatBar) || 0,
      compCozinha: parseFloat(form.compCozinha) || 0,
      compBar: parseFloat(form.compBar) || 0
    };
    setWeeklyData([...weeklyData, newWeek]);
    setForm({ period: '', fatCozinha: '', fatBar: '', compCozinha: '', compBar: '' });
  };

  const handleRemoveWeek = (id) => {
    setWeeklyData(weeklyData.filter(w => w.id !== id));
  };

  // Cálculos Consolidados
  const totalFatCozinha = weeklyData.reduce((acc, curr) => acc + curr.fatCozinha, 0);
  const totalFatBar = weeklyData.reduce((acc, curr) => acc + curr.fatBar, 0);
  const totalCompCozinha = weeklyData.reduce((acc, curr) => acc + curr.compCozinha, 0);
  const totalCompBar = weeklyData.reduce((acc, curr) => acc + curr.compBar, 0);

  const cmvCozinha = totalFatCozinha > 0 ? (totalCompCozinha / totalFatCozinha) * 100 : 0;
  const cmvBar = totalFatBar > 0 ? (totalCompBar / totalFatBar) * 100 : 0;

  // Lógica de Premiação
  const calculateCozinhaBonus = (cmv) => {
    if (cmv <= 0) return 0;
    if (cmv <= 25) return 1100;
    if (cmv <= 28) return 800;
    if (cmv <= 32) return 450;
    return 0;
  };

  const calculateBarBonus = (cmv) => {
    if (cmv <= 0) return 0;
    if (cmv <= 20) return 600;
    if (cmv <= 25) return 400;
    if (cmv <= 30) return 250;
    return 0;
  };

  const cozinhaBonus = calculateCozinhaBonus(cmvCozinha);
  const barBonus = calculateBarBonus(cmvBar);
  
  // Gerente só ganha se AMBOS baterem a meta mínima
  let gerenteBonus = 0;
  if (cozinhaBonus > 0 && barBonus > 0) {
    gerenteBonus = (cozinhaBonus * 0.5) + (barBonus * 0.5);
  }

  // EXCEL EXPORT
  const handleExport = () => {
    const dataToExport = weeklyData.map(w => ({
      Período: w.period,
      'Faturamento Cozinha': w.fatCozinha,
      'Compras Cozinha': w.compCozinha,
      'CMV Cozinha (%)': w.fatCozinha > 0 ? ((w.compCozinha / w.fatCozinha) * 100).toFixed(2) : 0,
      'Faturamento Bar': w.fatBar,
      'Compras Bar': w.compBar,
      'CMV Bar (%)': w.fatBar > 0 ? ((w.compBar / w.fatBar) * 100).toFixed(2) : 0,
    }));

    // Add Total Row
    dataToExport.push({
      Período: 'TOTAL MÊS',
      'Faturamento Cozinha': totalFatCozinha,
      'Compras Cozinha': totalCompCozinha,
      'CMV Cozinha (%)': cmvCozinha.toFixed(2),
      'Faturamento Bar': totalFatBar,
      'Compras Bar': totalCompBar,
      'CMV Bar (%)': cmvBar.toFixed(2)
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fechamento");
    XLSX.writeFile(workbook, "Fechamento_PulseBar.xlsx");
  };

  // EXCEL IMPORT
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const importedWeeks = data
        .filter(row => row.Período && row.Período !== 'TOTAL MÊS')
        .map(row => ({
          id: 'w' + Math.random(),
          period: row.Período,
          fatCozinha: parseFloat(row['Faturamento Cozinha']) || 0,
          compCozinha: parseFloat(row['Compras Cozinha']) || 0,
          fatBar: parseFloat(row['Faturamento Bar']) || 0,
          compBar: parseFloat(row['Compras Bar']) || 0
        }));

      if (importedWeeks.length > 0) {
        setWeeklyData(importedWeeks); // Substitui os dados atuais
        alert('Planilha importada com sucesso!');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gold">Fechamento & Metas</h1>
          <p className="text-muted">Acompanhamento de faturamento, compras e cálculo automático de bônus.</p>
        </div>
        <div className="flex gap-4">
          <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
            <Upload size={18} /> Importar Planilha
            <input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} onChange={handleImport} />
          </label>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download size={18} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* Painel de Metas e Bônus */}
      <div className="card" style={{ marginBottom: '2rem', border: '2px solid var(--accent-gold)' }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-main)' }}>RESULTADO DE METAS DO MÊS</h3>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', textAlign: 'center' }}>
          
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px', borderLeft: cozinhaBonus > 0 ? '4px solid var(--accent-green)' : '4px solid var(--accent-red)' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Chefe de Cozinha</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>CMV Atual: {cmvCozinha.toFixed(1)}%</p>
            <p style={{ fontSize: '1.5rem', color: cozinhaBonus > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 'bold', marginTop: '0.5rem' }}>
              Bônus: R$ {cozinhaBonus.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px', borderLeft: barBonus > 0 ? '4px solid var(--accent-green)' : '4px solid var(--accent-red)' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Bartender</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>CMV Atual: {cmvBar.toFixed(1)}%</p>
            <p style={{ fontSize: '1.5rem', color: barBonus > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 'bold', marginTop: '0.5rem' }}>
              Bônus: R$ {barBonus.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px', borderLeft: gerenteBonus > 0 ? '4px solid var(--accent-gold)' : '4px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Gerente Geral</h4>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Requisito: Ambas metas batidas</p>
            <p style={{ fontSize: '1.5rem', color: gerenteBonus > 0 ? 'var(--accent-gold)' : 'var(--text-muted)', fontWeight: 'bold', marginTop: '0.5rem' }}>
              Bônus: R$ {gerenteBonus.toFixed(2).replace('.', ',')}
            </p>
          </div>

        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Lançamento Semanal</h3>
        <form onSubmit={handleAddWeek} className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Período (Ex: Semana 11 a 17)</label>
            <input type="text" className="form-control" required value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Fatur. Cozinha</label>
            <input type="number" className="form-control" required value={form.fatCozinha} onChange={e => setForm({...form, fatCozinha: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Compra Cozinha</label>
            <input type="number" className="form-control" required value={form.compCozinha} onChange={e => setForm({...form, compCozinha: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Fatur. Bar</label>
            <input type="number" className="form-control" required value={form.fatBar} onChange={e => setForm({...form, fatBar: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Compra Bar</label>
            <input type="number" className="form-control" required value={form.compBar} onChange={e => setForm({...form, compBar: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-success" style={{ padding: '0.75rem' }}><Plus size={20} /></button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Tabela de Fechamento</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Período</th>
                <th style={{ padding: '1rem' }}>Fat. Cozinha</th>
                <th style={{ padding: '1rem' }}>Comp. Cozinha</th>
                <th style={{ padding: '1rem' }}>CMV Coz.</th>
                <th style={{ padding: '1rem' }}>Fat. Bar</th>
                <th style={{ padding: '1rem' }}>Comp. Bar</th>
                <th style={{ padding: '1rem' }}>CMV Bar</th>
                <th style={{ padding: '1rem' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map(w => {
                const cCoz = w.fatCozinha > 0 ? (w.compCozinha / w.fatCozinha) * 100 : 0;
                const cBar = w.fatBar > 0 ? (w.compBar / w.fatBar) * 100 : 0;
                return (
                  <tr key={w.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{w.period}</td>
                    <td style={{ padding: '1rem' }}>R$ {w.fatCozinha.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>R$ {w.compCozinha.toFixed(2)}</td>
                    <td style={{ padding: '1rem', color: cCoz <= 32 && cCoz > 0 ? 'var(--accent-green)' : 'var(--text-muted)' }}>{cCoz.toFixed(1)}%</td>
                    <td style={{ padding: '1rem' }}>R$ {w.fatBar.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>R$ {w.compBar.toFixed(2)}</td>
                    <td style={{ padding: '1rem', color: cBar <= 30 && cBar > 0 ? 'var(--accent-green)' : 'var(--text-muted)' }}>{cBar.toFixed(1)}%</td>
                    <td style={{ padding: '1rem' }}>
                      <button className="icon-btn" onClick={() => handleRemoveWeek(w.id)}>
                        <Trash2 size={16} color="var(--accent-red)" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {/* Resumo Total */}
              <tr style={{ backgroundColor: 'var(--bg-input)', fontWeight: 'bold' }}>
                <td style={{ padding: '1rem' }}>TOTAL MÊS</td>
                <td style={{ padding: '1rem' }}>R$ {totalFatCozinha.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>R$ {totalCompCozinha.toFixed(2)}</td>
                <td style={{ padding: '1rem', color: 'var(--accent-gold)' }}>{cmvCozinha.toFixed(1)}%</td>
                <td style={{ padding: '1rem' }}>R$ {totalFatBar.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>R$ {totalCompBar.toFixed(2)}</td>
                <td style={{ padding: '1rem', color: 'var(--accent-gold)' }}>{cmvBar.toFixed(1)}%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Fechamento;
