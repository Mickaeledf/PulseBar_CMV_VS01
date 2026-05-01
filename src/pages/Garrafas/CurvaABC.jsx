import React, { useContext, useMemo } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const CurvaABC = () => {
  const { bottles } = useContext(AppDataContext);

  const abcData = useMemo(() => {
    // 1. Calcular o valor total em estoque de cada item
    const itemsWithValue = bottles.map(b => ({
      ...b,
      totalValue: b.cost * b.currentStock
    }));

    // 2. Ordenar por valor decrescente
    itemsWithValue.sort((a, b) => b.totalValue - a.totalValue);

    // 3. Calcular o valor total do estoque global
    const globalTotalValue = itemsWithValue.reduce((acc, curr) => acc + curr.totalValue, 0);

    // 4. Acumular a porcentagem e classificar
    let accumulatedPercentage = 0;
    
    return itemsWithValue.map(item => {
      const itemPercentage = globalTotalValue > 0 ? (item.totalValue / globalTotalValue) * 100 : 0;
      accumulatedPercentage += itemPercentage;
      
      let abcClass = 'C';
      if (accumulatedPercentage <= 80) abcClass = 'A';
      else if (accumulatedPercentage <= 95) abcClass = 'B';

      return {
        ...item,
        itemPercentage,
        accumulatedPercentage,
        abcClass
      };
    });
  }, [bottles]);

  const totalValueA = abcData.filter(i => i.abcClass === 'A').reduce((a, b) => a + b.totalValue, 0);
  const totalValueB = abcData.filter(i => i.abcClass === 'B').reduce((a, b) => a + b.totalValue, 0);
  const totalValueC = abcData.filter(i => i.abcClass === 'C').reduce((a, b) => a + b.totalValue, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={28} /> Curva ABC de Insumos
          </h1>
          <p className="text-muted">Foque sua negociação nos produtos Classe A (80% do valor do estoque).</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--accent-red)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Classe A (Críticos)</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>R$ {totalValueA.toFixed(2).replace('.', ',')}</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}><AlertCircle size={12} style={{ display: 'inline' }} /> Alta prioridade de negociação</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--accent-gold)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Classe B (Intermediários)</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>R$ {totalValueB.toFixed(2).replace('.', ',')}</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Atenção moderada</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--accent-green)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Classe C (Baixo Impacto)</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>R$ {totalValueC.toFixed(2).replace('.', ',')}</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}><CheckCircle size={12} style={{ display: 'inline' }} /> Controle padrão</p>
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Classe</th>
                <th style={{ padding: '1rem' }}>Produto</th>
                <th style={{ padding: '1rem' }}>Estoque Atual</th>
                <th style={{ padding: '1rem' }}>Custo Un.</th>
                <th style={{ padding: '1rem' }}>Valor Total</th>
                <th style={{ padding: '1rem' }}>% Acumulada</th>
              </tr>
            </thead>
            <tbody>
              {abcData.map(item => {
                let badgeColor = 'var(--text-muted)';
                if (item.abcClass === 'A') badgeColor = 'var(--accent-red)';
                if (item.abcClass === 'B') badgeColor = 'var(--accent-gold)';
                if (item.abcClass === 'C') badgeColor = 'var(--accent-green)';

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: badgeColor, color: '#fff', fontWeight: 'bold' }}>
                        {item.abcClass}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                    <td style={{ padding: '1rem' }}>{Number.isInteger(item.currentStock) ? item.currentStock : item.currentStock.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>R$ {item.cost.toFixed(2).replace('.', ',')}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>R$ {item.totalValue.toFixed(2).replace('.', ',')}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{item.accumulatedPercentage.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CurvaABC;
