import React, { useContext, useState } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';

const ContaPerfil = () => {
  const { currentUser } = useContext(AppDataContext);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Conta e Perfil</h2>
      
      <div className="flex items-center gap-6" style={{ marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)', color: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
          {currentUser?.name.charAt(0)}
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem' }}>{currentUser?.name}</h3>
          <p className="text-muted">{currentUser?.role} - Unidade: Matriz Centro</p>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Membro desde: 15/02/2026</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Nome Completo</label>
          <input type="text" className="form-control" defaultValue={currentUser?.name} disabled={!isEditing} />
        </div>
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input type="email" className="form-control" defaultValue={currentUser?.email} disabled={!isEditing} />
        </div>
        <div className="form-group">
          <label className="form-label">Telefone</label>
          <input type="text" className="form-control" defaultValue={currentUser?.phone} disabled={!isEditing} />
        </div>
        <div className="form-group">
          <label className="form-label">Cargo</label>
          <input type="text" className="form-control" defaultValue={currentUser?.role} disabled />
        </div>
      </div>

      <div className="flex gap-4">
        <button className="btn btn-outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancelar' : 'Editar Dados'}
        </button>
        {isEditing && <button className="btn btn-primary" onClick={() => setIsEditing(false)}>Salvar Alterações</button>}
        <button className="btn btn-danger" style={{ marginLeft: 'auto' }}>Logout</button>
      </div>
    </div>
  );
};

export default ContaPerfil;
