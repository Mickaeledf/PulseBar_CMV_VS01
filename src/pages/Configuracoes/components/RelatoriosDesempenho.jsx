import React, { useContext } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RelatoriosDesempenho = () => {
  const { losses, drinks } = useContext(AppDataContext);

  // Mock Data Calculations based on context
  const employeeLosses = losses.reduce((acc, curr) => {
    acc[curr.employee] = (acc[curr.employee] || 0) + curr.cost;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(employeeLosses),
    datasets: [
      {
        label: 'Prejuízo Gerado (R$)',
        data: Object.values(employeeLosses),
        backgroundColor: '#F76C6C',
        borderRadius: 4,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#FFF' } }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#A8D0E6' } },
      x: { grid: { display: false }, ticks: { color: '#A8D0E6' } }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Relatórios Avançados</h2>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ backgroundColor: 'var(--bg-main)' }}>
          <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Melhor Lucro (Drink)</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>
            Moscow Mule
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Margem de 81.5%</p>
        </div>
        <div className="card" style={{ backgroundColor: 'var(--bg-main)' }}>
          <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Maior Devolução</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>
            Moscow Mule
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 registro hoje</p>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: 'var(--bg-main)' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Ranking: Prejuízo por Funcionário</h3>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default RelatoriosDesempenho;
