import React, { useContext, useState } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import { CheckCircle2, Shield, Zap, TrendingUp, Cpu, Smartphone, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Planos = () => {
  const { subscriptionPlan, updateSubscriptionPlan } = useContext(AppDataContext);
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  // Simula o processo de compra ou upgrade
  const handleUpgrade = (plan) => {
    // Na vida real isso redirecionaria para o Stripe/Pagar.me
    if (plan === 'basic') {
      alert('Redirecionando para Checkout (Basic)...');
      updateSubscriptionPlan('basic');
      navigate('/');
    } else {
      alert('Redirecionando para Formulário de Demonstração...');
      updateSubscriptionPlan('advanced'); // Auto-upgrade para testes do usuário
      navigate('/');
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <button className="icon-btn" style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} onClick={() => navigate('/')}>
            <ArrowLeft size={20} /> Voltar para o Dashboard
          </button>
          <h1 className="text-gold">Faça um Upgrade</h1>
          <p className="text-muted">Desbloqueie todo o poder da inteligência de dados para o seu bar.</p>
        </div>
      </div>

      {/* Toggle Anual/Mensal */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          backgroundColor: 'var(--bg-input)', 
          padding: '0.5rem', 
          borderRadius: '50px',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <button 
            className={`btn ${!isAnnual ? 'btn-primary' : ''}`}
            style={{ borderRadius: '50px', background: !isAnnual ? 'var(--accent-gold)' : 'transparent', color: !isAnnual ? '#fff' : 'var(--text-muted)', border: 'none' }}
            onClick={() => setIsAnnual(false)}
          >
            Mensal
          </button>
          <button 
            className={`btn ${isAnnual ? 'btn-primary' : ''}`}
            style={{ borderRadius: '50px', background: isAnnual ? 'var(--accent-gold)' : 'transparent', color: isAnnual ? '#fff' : 'var(--text-muted)', border: 'none' }}
            onClick={() => setIsAnnual(true)}
          >
            Anual <span className="badge" style={{ backgroundColor: 'var(--accent-green)', marginLeft: '0.5rem', fontSize: '0.65rem' }}>-R$ 588</span>
          </button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* PLANO BASIC */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', border: subscriptionPlan === 'basic' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)' }}>
          {subscriptionPlan === 'basic' && (
            <div style={{ backgroundColor: 'var(--accent-gold)', color: '#fff', textAlign: 'center', padding: '0.5rem', margin: '-1.5rem -1.5rem 1.5rem -1.5rem', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', fontWeight: 'bold', fontSize: '0.875rem' }}>
              SEU PLANO ATUAL
            </div>
          )}
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Plano Basic</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem', minHeight: '40px' }}>Ideal para bares pequenos e médios.</p>
          
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
              R$ {isAnnual ? '1.188' : '149'}
            </span>
            <span className="text-muted">/{isAnnual ? 'ano' : 'mês'}</span>
            {isAnnual && <p style={{ fontSize: '0.875rem', color: 'var(--accent-green)', marginTop: '0.5rem' }}>Equivale a R$ 99/mês</p>}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            onClick={() => handleUpgrade('basic')}
            disabled={subscriptionPlan === 'basic'}
          >
            {subscriptionPlan === 'basic' ? 'Plano Ativo' : 'Começar Agora'}
          </button>

          <div style={{ flex: 1 }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>INCLUI:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--accent-green)" /> Login de equipe</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--accent-green)" /> Dashboard de Visão Geral</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--accent-green)" /> Controle de Perdas</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--accent-green)" /> Gestão de Estoque Base</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--accent-green)" /> Relatórios Básicos</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--accent-green)" /> Exportação Excel</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--accent-green)" /> Sincronização Online (PWA)</li>
            </ul>
          </div>
        </div>

        {/* PLANO ADVANCED */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--accent-gold)', position: 'relative', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: 'var(--accent-gold)', color: '#fff', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            MAIS POPULAR
          </div>
          
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={24} /> Plano Advanced
          </h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem', minHeight: '40px' }}>Ideal para operações sérias e expansão de franquias.</p>
          
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
              R$ {isAnnual ? '1.200' : '299'}
            </span>
            <span className="text-muted">/{isAnnual ? 'ano' : 'mês'}</span>
            {isAnnual && <p style={{ fontSize: '0.875rem', color: 'var(--accent-green)', marginTop: '0.5rem', fontWeight: 'bold' }}>Desconto de R$ 588,00</p>}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '2rem', padding: '1rem', fontWeight: 'bold' }}
            onClick={() => handleUpgrade('advanced')}
            disabled={subscriptionPlan === 'advanced'}
          >
             {subscriptionPlan === 'advanced' ? 'Plano Ativo' : 'Solicitar Demonstração'}
          </button>

          <div style={{ flex: 1 }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>TUDO DO BASIC, MAIS:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}><TrendingUp size={18} /> CMV Avançado & Fechamento</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}><Shield size={18} /> Multiunidades</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}><Cpu size={18} /> Inteligência Artificial (Insights)</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}><Smartphone size={18} /> Aplicativo Mobile Nativo</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}><TrendingUp size={18} /> Curva ABC e Relatórios Premium</li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}><Lock size={18} /> Permissões Avançadas</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Planos;
