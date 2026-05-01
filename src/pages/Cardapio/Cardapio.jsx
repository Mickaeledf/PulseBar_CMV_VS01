import React, { useContext, useState } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import { Edit2, Plus, Trash2, ShoppingCart } from 'lucide-react';

const Cardapio = () => {
  const { drinks, bottles, setBottles, addDrink, editDrink } = useContext(AppDataContext);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    priceIdeal: '',
    prepTime: '',
    glass: '',
    ingredients: []
  });

  const calculateDrinkCost = (ingredientsToCalc) => {
    let totalCost = 0;
    ingredientsToCalc.forEach(ing => {
      if (ing.type === 'bottle') {
        const bottle = bottles.find(b => b.id === ing.bottleId);
        if (bottle) {
          totalCost += (bottle.cost / bottle.volumeMl) * ing.quantityMl;
        }
      } else if (ing.type === 'manual') {
        totalCost += parseFloat(ing.cost) || 0;
      }
    });
    return totalCost;
  };

  const handleEditClick = (drink) => {
    setForm({
      name: drink.name,
      priceIdeal: drink.priceIdeal,
      prepTime: drink.prepTime,
      glass: drink.glass,
      ingredients: [...drink.ingredients]
    });
    setEditingId(drink.id);
    setShowForm(true);
  };

  const handleSellDrink = (drink) => {
    // Deduz estoque (Baixa automática)
    setBottles(prevBottles => {
      const updatedBottles = [...prevBottles];
      let alertTriggered = false;
      
      drink.ingredients.forEach(ing => {
        if (ing.type === 'bottle') {
          const bottleIndex = updatedBottles.findIndex(b => b.id === ing.bottleId);
          if (bottleIndex !== -1) {
            // quantityMl is in ml, currentStock is in full bottles!
            // Wait, currentStock usually represents full bottles. Let's subtract fractions.
            // Or maybe currentStock is just the count. If it's count of bottles, 1 bottle = volumeMl.
            // Let's deduct the fraction: ing.quantityMl / bottle.volumeMl
            const fractionUsed = ing.quantityMl / updatedBottles[bottleIndex].volumeMl;
            updatedBottles[bottleIndex].currentStock -= fractionUsed;
            
            if (updatedBottles[bottleIndex].currentStock < 0) {
              updatedBottles[bottleIndex].currentStock = 0;
            }
          }
        }
      });
      return updatedBottles;
    });
    
    alert(`1x ${drink.name} vendido! Ingredientes descontados do estoque.`);
  };

  const handleNewClick = () => {
    setForm({ name: '', priceIdeal: '', prepTime: '', glass: '', ingredients: [] });
    setEditingId(null);
    setShowForm(!showForm);
  };

  const handleAddIngredient = (type) => {
    if (type === 'bottle') {
      setForm({ ...form, ingredients: [...form.ingredients, { type: 'bottle', bottleId: '', quantityMl: '' }] });
    } else {
      setForm({ ...form, ingredients: [...form.ingredients, { type: 'manual', name: '', cost: '' }] });
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngs = [...form.ingredients];
    newIngs.splice(index, 1);
    setForm({ ...form, ingredients: newIngs });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngs = [...form.ingredients];
    newIngs[index][field] = value;
    setForm({ ...form, ingredients: newIngs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string numbers to real numbers
    const processedIngredients = form.ingredients.map(ing => {
      if (ing.type === 'bottle') {
        return { ...ing, quantityMl: parseFloat(ing.quantityMl) };
      } else {
        return { ...ing, cost: parseFloat(ing.cost) };
      }
    });

    const drinkData = {
      name: form.name,
      priceIdeal: parseFloat(form.priceIdeal),
      prepTime: form.prepTime,
      glass: form.glass,
      ingredients: processedIngredients
    };

    if (editingId) {
      editDrink({ ...drinkData, id: editingId });
    } else {
      addDrink({ ...drinkData, id: 'd' + Date.now() });
    }
    
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gold">Fichas Técnicas & CMV</h1>
          <p className="text-muted">Análise de rentabilidade e montagem de drinks.</p>
        </div>
        <button className="btn btn-primary" onClick={handleNewClick}>
          {showForm ? 'Cancelar' : '+ Nova Ficha Técnica'}
        </button>
      </div>

      {showForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
            {editingId ? 'Editar Drink' : 'Novo Drink'}
          </h3>
          <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nome do Drink</label>
                <input type="text" className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: Moscow Mule" />
              </div>
              <div className="form-group">
                <label className="form-label">Preço Ideal de Venda (R$)</label>
                <input type="number" step="0.01" className="form-control" required value={form.priceIdeal} onChange={e => setForm({...form, priceIdeal: e.target.value})} placeholder="Ex: 35.00" />
              </div>
              <div className="form-group">
                <label className="form-label">Tempo de Preparo</label>
                <input type="text" className="form-control" value={form.prepTime} onChange={e => setForm({...form, prepTime: e.target.value})} placeholder="Ex: 2 min" />
              </div>
              <div className="form-group">
                <label className="form-label">Copo Utilizado</label>
                <input type="text" className="form-control" value={form.glass} onChange={e => setForm({...form, glass: e.target.value})} placeholder="Ex: Caneca Cobre" />
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--text-main)' }}>Ingredientes</h4>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => handleAddIngredient('bottle')}>
                    + Adicionar Garrafa (Estoque)
                  </button>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => handleAddIngredient('manual')}>
                    + Adicionar Extra (Manual)
                  </button>
                </div>
              </div>

              {form.ingredients.map((ing, index) => (
                <div key={index} className="flex gap-4 items-end" style={{ marginBottom: '1rem' }}>
                  {ing.type === 'bottle' ? (
                    <>
                      <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                        <label className="form-label">Garrafa do Estoque</label>
                        <select className="form-control" required value={ing.bottleId} onChange={e => handleIngredientChange(index, 'bottleId', e.target.value)}>
                          <option value="">Selecione...</option>
                          {bottles.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({(b.cost / b.volumeMl).toFixed(3)} R$/ml)</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="form-label">Volume Utilizado (ml)</label>
                        <input type="number" className="form-control" required value={ing.quantityMl} onChange={e => handleIngredientChange(index, 'quantityMl', e.target.value)} placeholder="ml" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                        <label className="form-label">Insumo Extra / Decoração</label>
                        <input type="text" className="form-control" required value={ing.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} placeholder="Ex: Limão, Gelo, Espuma..." />
                      </div>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="form-label">Custo Estimado (R$)</label>
                        <input type="number" step="0.01" className="form-control" required value={ing.cost} onChange={e => handleIngredientChange(index, 'cost', e.target.value)} placeholder="R$" />
                      </div>
                    </>
                  )}
                  <button type="button" className="icon-btn" style={{ padding: '0.75rem', backgroundColor: 'var(--accent-red-light)', borderRadius: 'var(--radius-sm)' }} onClick={() => handleRemoveIngredient(index)}>
                    <Trash2 size={20} color="var(--accent-red)" />
                  </button>
                </div>
              ))}
              
              {form.ingredients.length === 0 && (
                <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>Nenhum ingrediente adicionado. O custo será R$ 0,00.</p>
              )}
            </div>
            
            <div className="flex justify-between items-center" style={{ marginTop: '1rem' }}>
              <div>
                <p className="text-muted">Custo Calculado Atual:</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>R$ {calculateDrinkCost(form.ingredients).toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="flex gap-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success">Salvar Drink</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {drinks.map(drink => {
          const cost = calculateDrinkCost(drink.ingredients);
          const cmv = (cost / drink.priceIdeal) * 100;
          const isHighCmv = cmv > 25;

          return (
            <div key={drink.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{drink.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="badge" style={{ position: 'static', backgroundColor: isHighCmv ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                    CMV: {cmv.toFixed(1)}%
                  </span>
                  <button className="icon-btn" onClick={() => handleEditClick(drink)} title="Editar">
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <p><strong>Copo:</strong> {drink.glass}</p>
                <p><strong>Tempo Prep:</strong> {drink.prepTime}</p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', flex: 1 }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--accent-gold)' }}>Ingredientes:</h4>
                <ul style={{ listStyle: 'none', fontSize: '0.875rem' }}>
                  {drink.ingredients.map((ing, idx) => {
                    if (ing.type === 'bottle') {
                      const bottle = bottles.find(b => b.id === ing.bottleId);
                      return (
                        <li key={idx} className="flex justify-between" style={{ marginBottom: '4px' }}>
                          <span>{ing.quantityMl}ml {bottle ? bottle.name : 'Desconhecido'}</span>
                          <span className="text-muted">R$ {bottle ? ((bottle.cost / bottle.volumeMl) * ing.quantityMl).toFixed(2).replace('.', ',') : '0,00'}</span>
                        </li>
                      );
                    } else {
                      return (
                        <li key={idx} className="flex justify-between" style={{ marginBottom: '4px' }}>
                          <span>{ing.name}</span>
                          <span className="text-muted">R$ {ing.cost.toFixed(2).replace('.', ',')}</span>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>

              <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Custo Total</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>R$ {cost.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preço Venda Ideal</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>R$ {drink.priceIdeal.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
              
              {isHighCmv && (
                <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: 'var(--accent-red-light)', color: 'var(--accent-red)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>
                  ALERTA: CMV ACIMA DE 25%. REVISE A RECEITA.
                </div>
              )}

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => handleSellDrink(drink)}
              >
                <ShoppingCart size={16} /> Registrar Venda (Baixar Estoque)
              </button>
            </div>
          );
        })}
        {drinks.length === 0 && (
          <p className="text-muted">Nenhum drink cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default Cardapio;
