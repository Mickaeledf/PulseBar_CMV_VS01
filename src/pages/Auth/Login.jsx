import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppDataContext } from '../../context/AppDataContext';
import { Wine, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AppDataContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('E-mail ou senha incorretos. Acesso negado.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '3rem 2rem',
        boxShadow: 'var(--shadow-glow)',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Wine size={48} color="var(--accent-gold)" />
        </div>
        <h1 className="text-gold" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>PulseBar <span style={{ color: 'var(--text-main)' }}>CMV</span></h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>Inteligência de Estoque Premium</p>

        {error && (
          <div style={{
            backgroundColor: 'var(--accent-red-light)',
            color: 'var(--accent-red)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">E-mail Corporativo</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="form-control" 
                placeholder="seunome@bar.com"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Senha de Acesso</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'} <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-muted" style={{ marginTop: '2rem', fontSize: '0.75rem' }}>
          Esqueceu sua senha? Entre em contato com o suporte admin.
        </p>
      </div>
    </div>
  );
};

export default Login;
