import React, { useContext } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';

const Notificacoes = () => {
  const { settings, updateSettings } = useContext(AppDataContext);

  const toggleNotification = (type) => {
    updateSettings({ notifications: { ...settings.notifications, [type]: !settings.notifications[type] } });
  };

  const toggleAlert = (type) => {
    updateSettings({ alerts: { ...settings.alerts, [type]: !settings.alerts[type] } });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Preferências de Notificação</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Canais de Recebimento</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.notifications.push} onChange={() => toggleNotification('push')} />
            Notificações no Navegador (Push)
          </label>
          <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.notifications.email} onChange={() => toggleNotification('email')} />
            E-mail
          </label>
          <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={settings.notifications.sms} onChange={() => toggleNotification('sms')} />
            SMS (Requer plano Pro)
          </label>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Alertas do Sistema</h3>
        <ul style={{ listStyle: 'none' }}>
          {[
            { id: 'lowStock', label: 'Estoque Baixo (Garrafas críticas)' },
            { id: 'highCmv', label: 'Alerta de CMV Alto (> 25%)' },
            { id: 'highLoss', label: 'Perda Excessiva no Turno' },
            { id: 'expProduct', label: 'Produtos perto do Vencimento' },
            { id: 'missedGoal', label: 'Meta de Faturamento não atingida' }
          ].map(alert => (
            <li key={alert.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{alert.label}</span>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={settings.alerts[alert.id]} onChange={() => toggleAlert(alert.id)} />
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notificacoes;
