import React, { useContext, useMemo } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { losses, drinks } = useContext(AppDataContext);

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7);

  // Calcs
  const lossesToday = losses
    .filter(l => l.date === today)
    .reduce((acc, curr) => acc + curr.cost, 0);

  const lossesMonth = losses
    .filter(l => l.date.startsWith(currentMonth))
    .reduce((acc, curr) => acc + curr.cost, 0);

  // Produto mais perdido
  const productLossCounts = losses.reduce((acc, curr) => {
    acc[curr.productName] = (acc[curr.productName] || 0) + 1;
    return acc;
  }, {});
  
  const mostLostProduct = Object.entries(productLossCounts).sort((a, b) => b[1] - a[1])[0];

  // CMV Médio
  // Mockado por enquanto: 18.5%. Mais tarde a gente faz a média do cmv_dos_drinks
  const avgCmv = 18.5;

  // Doughnut chart data
  const reasonCounts = losses.reduce((acc, curr) => {
    acc[curr.reason] = (acc[curr.reason] || 0) + curr.cost;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(reasonCounts),
    datasets: [
      {
        data: Object.values(reasonCounts),
        backgroundColor: [
          '#FF3D00', // red
          '#D4AF37', // gold
          '#00E676', // green
          '#B0B0B0', // gray
          '#8A2BE2'
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#F4F4F5' }
      }
    },
    cutout: '70%'
  };

  // Line chart data (Evolução Mensal - mock simples de dias)
  const lineData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Perdas em R$',
        data: [150, 230, 180, lossesMonth],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        grid: { color: '#27272A' },
        ticks: { color: '#A1A1AA' }
      },
      x: {
        grid: { color: '#27272A' },
        ticks: { color: '#A1A1AA' }
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gold">Dashboard</h1>
          <p className="text-muted">Resumo financeiro e operacional.</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href='/desperdicios'}>
          + Nova Perda
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Perdas Hoje (R$)</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-red)' }}>
            R$ {lossesToday.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="card">
          <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Perdas no Mês</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>
            R$ {lossesMonth.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="card">
          <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>CMV Médio Atual</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-green)' }}>
            {avgCmv}%
          </p>
        </div>
        <div className="card">
          <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Produto Mais Perdido</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            {mostLostProduct ? mostLostProduct[0] : 'Nenhum'}
          </p>
        </div>
      </div>
      
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Evolução Mensal</h3>
          <div style={{ flex: 1, position: 'relative' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Motivos de Perda (Custo)</h3>
          <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
