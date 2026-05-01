import React, { createContext, useState, useEffect } from 'react';

export const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  // Existing States
  const [bottles, setBottles] = useState(() => {
    const saved = localStorage.getItem('pulsebar_bottles');
    return saved ? JSON.parse(saved) : [
      { id: 'b1', name: 'Vodka Absolut', brand: 'Absolut', volumeMl: 1000, cost: 95.0, currentStock: 5 },
      { id: 'b2', name: 'Gin Tanqueray', brand: 'Tanqueray', volumeMl: 750, cost: 120.0, currentStock: 3 },
      { id: 'b3', name: 'Xarope Monin Morango', brand: 'Monin', volumeMl: 700, cost: 65.0, currentStock: 2 },
      { id: 'b4', name: 'Campari', brand: 'Campari', volumeMl: 900, cost: 55.0, currentStock: 4 }
    ];
  });

  const [drinks, setDrinks] = useState(() => {
    const saved = localStorage.getItem('pulsebar_drinks');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'd1', 
        name: 'Moscow Mule', 
        priceIdeal: 35.0, 
        ingredients: [
          { type: 'bottle', bottleId: 'b1', quantityMl: 50 },
          { type: 'manual', name: 'Limão espremido', cost: 0.5 },
          { type: 'manual', name: 'Espuma de Gengibre', cost: 1.5 }
        ],
        prepTime: '2 min',
        glass: 'Caneca Cobre'
      }
    ];
  });

  const [losses, setLosses] = useState(() => {
    const saved = localStorage.getItem('pulsebar_losses');
    const today = new Date().toISOString().split('T')[0];
    return saved ? JSON.parse(saved) : [
      { id: 'l1', date: today, time: '22:30', employee: 'João Bartender', productName: 'Vodka Absolut', category: 'Bebida', quantity: 50, unit: 'ml', cost: 4.75, reason: 'Erro preparo', obs: 'Errou a dose' },
      { id: 'l2', date: today, time: '23:15', employee: 'Maria Garçonete', productName: 'Taça Gin', category: 'Vidraria', quantity: 1, unit: 'unidade', cost: 15.0, reason: 'Quebrou garrafa', obs: 'Caiu da bandeja' }
    ];
  });

  // NEW STATES (Fase 2)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('pulsebar_users');
    return saved ? JSON.parse(saved) : [
      { id: 'u1', name: 'Admin Master', email: 'admin@pulsebar.com', role: 'Admin Master', active: true, phone: '(11) 99999-9999' },
      { id: 'u2', name: 'Gerente Geral', email: 'gerente@pulsebar.com', role: 'Gerente', active: true, phone: '(11) 98888-8888' },
      { id: 'u3', name: 'João Bartender', email: 'joao@pulsebar.com', role: 'Bartender', active: true, phone: '(11) 97777-7777' }
    ];
  });

  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem('pulsebar_units');
    return saved ? JSON.parse(saved) : [
      { id: 'un1', name: 'Matriz - Centro', address: 'Rua Principal, 100', manager: 'Gerente Geral', active: true },
      { id: 'un2', name: 'Filial - Zona Sul', address: 'Av. Sul, 500', manager: 'A Definir', active: true }
    ];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pulsebar_settings');
    return saved ? JSON.parse(saved) : {
      notifications: { push: true, email: true, sms: false },
      alerts: { lowStock: true, highCmv: true, highLoss: true, expProduct: false, missedGoal: true },
      theme: 'automatico',
      primaryColor: '#F8E9A1'
    };
  });

  const [weeklyData, setWeeklyData] = useState(() => {
    const saved = localStorage.getItem('pulsebar_weekly_data');
    return saved ? JSON.parse(saved) : [
      { id: 'w1', period: 'Semana 1', fatCozinha: 80000, fatBar: 20000, compCozinha: 23500, compBar: 5800 }
    ];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pulsebar_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('pulsebar_auth') === 'true';
  });

  const [subscriptionPlan, setSubscriptionPlan] = useState(() => {
    return localStorage.getItem('pulsebar_plan') || 'basic'; // Default para basic
  });

  // Persistências
  useEffect(() => { localStorage.setItem('pulsebar_bottles', JSON.stringify(bottles)); }, [bottles]);
  useEffect(() => { localStorage.setItem('pulsebar_drinks', JSON.stringify(drinks)); }, [drinks]);
  useEffect(() => { localStorage.setItem('pulsebar_losses', JSON.stringify(losses)); }, [losses]);
  useEffect(() => { localStorage.setItem('pulsebar_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('pulsebar_units', JSON.stringify(units)); }, [units]);
  useEffect(() => { localStorage.setItem('pulsebar_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('pulsebar_weekly_data', JSON.stringify(weeklyData)); }, [weeklyData]);
  useEffect(() => { localStorage.setItem('pulsebar_auth', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('pulsebar_plan', subscriptionPlan); }, [subscriptionPlan]);
  useEffect(() => { localStorage.setItem('pulsebar_user', JSON.stringify(currentUser)); }, [currentUser]);

  // Handlers de Login
  const login = (email, password) => {
    if (email === 'k.mickaele@gmail.com' && password === '123456-123456-') {
      setIsAuthenticated(true);
      setCurrentUser({ name: 'K Mickaele', email, role: 'Gerente' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const updateSubscriptionPlan = (plan) => {
    setSubscriptionPlan(plan);
  };

  // Handlers de Dados
  const addLoss = (loss) => setLosses([loss, ...losses]);
  
  const addBottle = (bottle) => setBottles([...bottles, bottle]);
  const editBottle = (updatedBottle) => {
    setBottles(bottles.map(b => b.id === updatedBottle.id ? updatedBottle : b));
  };

  const addDrink = (drink) => setDrinks([...drinks, drink]);
  const editDrink = (updatedDrink) => {
    setDrinks(drinks.map(d => d.id === updatedDrink.id ? updatedDrink : d));
  };

  const addUser = (user) => setUsers([...users, user]);
  const editUser = (updated) => setUsers(users.map(u => u.id === updated.id ? updated : u));

  const addUnit = (unit) => setUnits([...units, unit]);
  const editUnit = (updated) => setUnits(units.map(u => u.id === updated.id ? updated : u));

  const updateSettings = (newSettings) => setSettings({ ...settings, ...newSettings });

  const addWeeklyData = (data) => setWeeklyData([...weeklyData, data]);
  const editWeeklyData = (updated) => setWeeklyData(weeklyData.map(w => w.id === updated.id ? updated : w));

  return (
    <AppDataContext.Provider value={{
      bottles, setBottles, addBottle, editBottle,
      drinks, setDrinks, addDrink, editDrink,
      losses, setLosses, addLoss,
      users, setUsers, addUser, editUser,
      units, setUnits, addUnit, editUnit,
      settings, updateSettings,
      weeklyData, setWeeklyData, addWeeklyData, editWeeklyData,
      currentUser, setCurrentUser,
      isAuthenticated, login, logout,
      subscriptionPlan, updateSubscriptionPlan
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
