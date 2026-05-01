import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Search,
  Filter,
  Download,
  Building2,
  User,
  Bell,
  Menu,
  X,
  CheckCircle2,
  TrendingDown,
  BookOpen,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  ClipboardCheck,
  ThermometerSnowflake,
  Box,
  Truck,
  Timer,
  FileText,
  DollarSign,
  Calendar,
  PieChart
} from 'lucide-react';

// --- CONFIGURAÇÃO DE CORES ---
const themeStyles = `
  :root {
    --color-menu: #09184D;
    --color-buttons: #7B5BF2;
    --color-title: #2F2E2E;
    --color-info: #808085;
    --color-bg: #EDF2FA;
    --color-card: #FFFFFF;
  }
`;

// --- MOCK DATA INICIAL ---
const INITIAL_INVENTORY = [
  { id: 'i1', name: 'Gin Tanqueray', category: 'Destilados', storage: 'Secos', quantity: 5.0, unit: 'L', cost: 95.00, leadTime: 3, avgConsumption: 0.5, expiryDate: '2025-12-30' },
  { id: 'i2', name: 'Tônica Schweppes', category: 'Soft Drinks', storage: 'Refrigerados', quantity: 24, unit: 'un', cost: 3.20, leadTime: 2, avgConsumption: 12, expiryDate: '2024-06-15' },
  { id: 'i3', name: 'Limão Siciliano', category: 'Hortifruti', storage: 'Secos', quantity: 15, unit: 'un', cost: 1.50, leadTime: 1, avgConsumption: 5, expiryDate: '2024-05-10' },
  { id: 'i4', name: 'Hambúrguer Angus', category: 'Carnes', storage: 'Congelados', quantity: 10, unit: 'un', cost: 8.50, leadTime: 2, avgConsumption: 15, expiryDate: '2024-08-20' },
  { id: 'i5', name: 'Vinho Malbec Reserva', category: 'Vinhos', storage: 'Secos', quantity: 12, unit: 'un', cost: 120.00, leadTime: 5, avgConsumption: 2, expiryDate: '2026-01-01' },
];

const INITIAL_RECIPES = [
  {
    id: 'r1',
    name: 'Gin Tónico Clássico',
    category: 'Drinks',
    price: 32.00,
    yield: '1 Copo',
    prepMethod: 'Taça com gelo. 50ml de Gin. Tónica e rodela de limão.',
    ingredients: [
      { inventoryId: 'i1', amount: 0.05 },
      { inventoryId: 'i2', amount: 1 },
      { inventoryId: 'i3', amount: 0.25 }
    ]
  }
];

// --- COMPONENTES AUXILIARES ---

const Toast = ({ message, type }) => (
  <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-6 py-4 rounded-2xl shadow-xl z-50 animate-bounce ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
    {type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
    <span className="font-medium">{message}</span>
  </div>
);

// --- APP PRINCIPAL ---

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Estados
  const [inventory, setInventory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [movements, setMovements] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = themeStyles;
    document.head.appendChild(styleSheet);

    const savedUser = localStorage.getItem('pb_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    setInventory(JSON.parse(localStorage.getItem('pb_inv_v3')) || INITIAL_INVENTORY);
    setRecipes(JSON.parse(localStorage.getItem('pb_rec_v3')) || INITIAL_RECIPES);
    setMovements(JSON.parse(localStorage.getItem('pb_mov_v3')) || []);
    setOrders(JSON.parse(localStorage.getItem('pb_ord_v3')) || []);
  }, []);

  useEffect(() => {
    if (inventory.length) localStorage.setItem('pb_inv_v3', JSON.stringify(inventory));
    if (recipes.length) localStorage.setItem('pb_rec_v3', JSON.stringify(recipes));
    localStorage.setItem('pb_mov_v3', JSON.stringify(movements));
    localStorage.setItem('pb_ord_v3', JSON.stringify(orders));
  }, [inventory, recipes, movements, orders]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- MÉTODOS DE GESTÃO AVANÇADA ---

  // Cálculo de Curva ABC
  const abcAnalysis = useMemo(() => {
    const totalValue = inventory.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
    const sorted = [...inventory].sort((a, b) => (b.cost * b.quantity) - (a.cost * a.quantity));

    let cumulative = 0;
    return sorted.map(item => {
      const itemValue = item.cost * item.quantity;
      cumulative += itemValue;
      const percentage = (cumulative / totalValue) * 100;

      let category = 'C';
      if (percentage <= 70) category = 'A';
      else if (percentage <= 90) category = 'B';

      return { ...item, abcCategory: category, valueWeight: (itemValue / totalValue) * 100 };
    });
  }, [inventory]);

  // Gestão PVPS (FEFO) - Itens que vencem nos próximos 30 dias
  const expiringSoon = useMemo(() => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    return inventory.filter(item => {
      const expiry = new Date(item.expiryDate);
      return expiry <= nextMonth && expiry >= today;
    });
  }, [inventory]);

  const handleSale = (recipeId) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const canFulfill = recipe.ingredients.every(ing => {
      const item = inventory.find(i => i.id === ing.inventoryId);
      return item && item.quantity >= ing.amount;
    });

    if (!canFulfill) {
      showToast('Stock insuficiente!', 'error');
      return;
    }

    setInventory(prev => prev.map(item => {
      const ing = recipe.ingredients.find(ri => ri.inventoryId === item.id);
      return ing ? { ...item, quantity: parseFloat((item.quantity - ing.amount).toFixed(3)) } : item;
    }));

    setOrders([{ id: Date.now(), productName: recipe.name, value: recipe.price, date: new Date().toISOString() }, ...orders]);
    setMovements([{ id: Date.now(), type: 'SAÍDA (VENDA)', description: `Baixa PVPS: ${recipe.name}`, date: new Date().toISOString() }, ...movements]);
    showToast(`${recipe.name} vendido! Insumos baixados.`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-zinc-100 text-center">
          <div className="bg-[var(--color-buttons)] p-5 rounded-[2rem] inline-block mb-6 text-white shadow-lg shadow-indigo-500/30">
            <TrendingDown size={40} />
          </div>
          <h1 className="text-4xl font-black text-[var(--color-title)] tracking-tight italic mb-2">PulseBar</h1>
          <p className="text-[var(--color-info)] font-bold mb-12">Inteligência ABC & Gestão PVPS</p>
          <button
            onClick={() => setUser({ name: 'Diretor PulseBar', role: 'manager' })}
            className="w-full bg-[var(--color-buttons)] text-white font-black py-5 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            Aceder ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const SidebarLink = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => { setCurrentPage(id); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative overflow-hidden group ${currentPage === id
        ? 'bg-[var(--color-buttons)] text-white shadow-lg shadow-indigo-900/40'
        : 'text-zinc-400 hover:text-white hover:bg-white/10'
        }`}
    >
      <Icon size={20} />
      <span className="font-bold">{label}</span>
      {currentPage === id && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/40"></div>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-title)] flex font-sans">
      {toast && <Toast {...toast} />}

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[var(--color-menu)] z-50 transform transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-12 px-2">
            <div className="bg-[var(--color-buttons)] p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20"><TrendingDown size={22} /></div>
            <span className="text-2xl font-black text-white italic tracking-tighter uppercase">PulseBar</span>
          </div>

          <nav className="space-y-1.5 flex-1 overflow-y-auto">
            <SidebarLink icon={LayoutDashboard} label="Dashboard" id="dashboard" />
            <SidebarLink icon={ShoppingCart} label="Ponto de Venda" id="vendas" />
            <SidebarLink icon={BookOpen} label="Fichas Técnicas" id="fichas" />
            <SidebarLink icon={Package} label="Inventário ABC" id="estoque" />
            <SidebarLink icon={PieChart} label="Relatórios & ABC" id="relatorios" />
            <SidebarLink icon={Truck} label="Recebimento NF" id="recebimento" />
            <SidebarLink icon={ArrowUpRight} label="Log de Auditoria" id="movimentos" />
            <SidebarLink icon={Settings} label="Definições" id="config" />
          </nav>

          <button onClick={() => setUser(null)} className="mt-8 flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-red-400 border-2 border-red-400/10 hover:bg-red-400/10 font-black transition-all">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-xl p-4 lg:p-8 flex justify-between items-center z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-white border border-zinc-200 rounded-2xl shadow-sm"><Menu size={24} /></button>
            <h2 className="text-2xl font-black tracking-tight uppercase">{currentPage}</h2>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Motor PVPS / ABC Operacional
          </div>
        </header>

        <div className="p-4 lg:p-8 pt-0">

          {currentPage === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              {/* Resumo Gerencial */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Valor Inves. Stock', value: `R$ ${inventory.reduce((a, c) => a + (c.cost * c.quantity), 0).toFixed(2)}`, icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                  { label: 'Itens Curva A', value: abcAnalysis.filter(i => i.abcCategory === 'A').length, icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Alertas PVPS', value: expiringSoon.length, icon: Calendar, color: 'text-red-500', bg: 'bg-red-50' },
                  { label: 'Margem Média', value: '72%', icon: TrendingDown, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-zinc-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all group">
                    <div className={`p-4 rounded-2xl w-fit mb-4 transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}><stat.icon size={26} /></div>
                    <p className="text-[var(--color-info)] text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* PVPS Alertas */}
                <div className="lg:col-span-1 bg-white border border-zinc-100 p-8 rounded-[2.5rem] shadow-sm">
                  <h3 className="font-black text-xl mb-8 flex items-center gap-3"><Calendar className="text-red-500" /> Próximos de Vencer (PVPS)</h3>
                  <div className="space-y-4">
                    {expiringSoon.map(item => (
                      <div key={item.id} className="p-5 bg-red-50/50 rounded-2xl border border-red-100 flex justify-between items-center group">
                        <div>
                          <p className="font-black text-red-700">{item.name}</p>
                          <p className="text-[10px] font-bold text-red-400 uppercase">Validade: {new Date(item.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-red-700">{item.quantity} {item.unit}</p>
                          <p className="text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">Usar Primeiro</p>
                        </div>
                      </div>
                    ))}
                    {expiringSoon.length === 0 && <p className="text-zinc-400 font-bold italic text-sm">Stock com validades saudáveis.</p>}
                  </div>
                </div>

                {/* Top Itens Curva A */}
                <div className="lg:col-span-2 bg-white border border-zinc-100 p-8 rounded-[2.5rem] shadow-sm">
                  <h3 className="font-black text-xl mb-8 flex items-center gap-3"><PieChart className="text-amber-500" /> Curva ABC (Principais Ativos)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {abcAnalysis.filter(i => i.abcCategory === 'A').map(item => (
                      <div key={item.id} className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-amber-500 text-xl">A</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm truncate">{item.name}</p>
                          <p className="text-[10px] font-bold text-zinc-400">Total: R$ {(item.cost * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-1 bg-zinc-200 rounded-full relative overflow-hidden">
                          <div className="absolute left-0 h-full bg-amber-500" style={{ width: `${item.valueWeight}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'fichas' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">Fichas Técnicas Ativas</h3>
                <button className="bg-[var(--color-buttons)] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-500/10 flex items-center gap-3"><Plus size={20} /> Nova Ficha</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {recipes.map(recipe => {
                  const cost = recipe.ingredients.reduce((a, ing) => a + ((inventory.find(i => i.id === ing.inventoryId)?.cost || 0) * ing.amount), 0);
                  return (
                    <div key={recipe.id} className="bg-white border border-zinc-100 p-10 rounded-[3rem] shadow-sm">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h4 className="text-3xl font-black tracking-tight">{recipe.name}</h4>
                          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-1">Rendimento: {recipe.yield}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-[var(--color-buttons)] tracking-tighter">R$ {recipe.price.toFixed(2)}</p>
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Mark-up: {((recipe.price / cost)).toFixed(2)}x</p>
                        </div>
                      </div>

                      <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 mb-8 space-y-4">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-200 pb-2"><DollarSign size={14} /> Composição de Custos</p>
                        {recipe.ingredients.map((ing, idx) => {
                          const item = inventory.find(i => i.id === ing.inventoryId);
                          return (
                            <div key={idx} className="flex justify-between text-sm font-bold">
                              <span className="text-zinc-500">{item?.name} <span className="text-[10px] opacity-50">({ing.amount}{item?.unit})</span></span>
                              <span>R$ {((item?.cost || 0) * ing.amount).toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="pt-4 mt-2 border-t border-dashed border-zinc-200 flex justify-between font-black text-lg">
                          <span>Custo Unitário:</span>
                          <span className="text-red-500">R$ {cost.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-1"><FileText size={14} /> Modo de Execução</p>
                        <div className="bg-white p-5 rounded-2xl border border-zinc-100 italic text-sm font-medium text-zinc-600 leading-relaxed">
                          {recipe.prepMethod}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentPage === 'estoque' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-wrap gap-4">
                {['Tudo', 'Secos', 'Refrigerados', 'Congelados'].map(f => (
                  <button key={f} className="bg-white border border-zinc-200 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:border-[var(--color-buttons)] transition-all">{f}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {abcAnalysis.map(item => {
                  const today = new Date();
                  const expiry = new Date(item.expiryDate);
                  const isExpiring = expiry <= new Date(today.setDate(today.getDate() + 30));

                  return (
                    <div key={item.id} className={`bg-white border-2 p-8 rounded-[3rem] shadow-sm relative group overflow-hidden transition-all ${isExpiring ? 'border-red-100' : 'border-zinc-100'}`}>
                      {isExpiring && <div className="absolute top-4 right-4 bg-red-500 text-white p-1 rounded-lg animate-pulse"><Calendar size={16} /></div>}

                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${item.abcCategory === 'A' ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-400'}`}>
                          {item.storage === 'Secos' ? <Box size={24} /> : <ThermometerSnowflake size={24} />}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full">{item.storage}</span>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full shadow-sm ${item.abcCategory === 'A' ? 'bg-amber-500 text-white' : item.abcCategory === 'B' ? 'bg-zinc-400 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                            CLASSE {item.abcCategory}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xl font-black mb-1 truncate">{item.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6">Validade: {new Date(item.expiryDate).toLocaleDateString()}</p>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Stock Físico</p>
                          <p className="text-3xl font-black tracking-tighter">{item.quantity}<span className="text-xs font-bold text-zinc-300 ml-1">{item.unit}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-400 uppercase">Investido</p>
                          <p className="font-black text-[var(--color-buttons)]">R$ {(item.cost * item.quantity).toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentPage === 'vendas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-700">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-zinc-100 text-center hover:shadow-2xl transition-all group">
                  <div className="bg-emerald-50 text-emerald-600 p-8 rounded-3xl inline-block mb-8 group-hover:scale-110 transition-transform"><ShoppingCart size={36} /></div>
                  <h4 className="text-3xl font-black mb-2 tracking-tight">{recipe.name}</h4>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-10">{recipe.category}</p>
                  <div className="text-5xl font-black text-[var(--color-buttons)] mb-12 tracking-tighter">R$ {recipe.price.toFixed(2)}</div>
                  <button
                    onClick={() => handleSale(recipe.id)}
                    className="w-full bg-[var(--color-buttons)] text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all text-lg"
                  >Baixar Stock PVPS</button>
                </div>
              ))}
            </div>
          )}

          {currentPage === 'recebimento' && (
            <div className="animate-in slide-in-from-bottom-6 duration-700 max-w-4xl mx-auto">
              <div className="bg-white border border-zinc-100 p-12 rounded-[3.5rem] shadow-sm text-center mb-10">
                <div className="bg-indigo-50 p-7 rounded-full w-fit mx-auto text-[var(--color-buttons)] mb-8 shadow-inner"><Truck size={52} /></div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Recebimento e PVPS</h3>
                <p className="text-[var(--color-info)] font-medium mb-12 max-w-md mx-auto">Registe a entrada de mercadoria garantindo a conferência manual e o registo da **data de validade** para o motor PVPS.</p>

                <div className="bg-zinc-50 p-10 rounded-[3rem] border border-zinc-100 text-left space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2.5 px-1 tracking-widest">Produto (Nota Fiscal)</label>
                      <select className="w-full bg-white border-2 border-zinc-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--color-buttons)] shadow-sm">
                        <option>Identificar artigo...</option>
                        {inventory.map(i => <option key={i.id}>{i.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2.5 px-1 tracking-widest">Quantidade Conferida</label>
                      <input type="number" className="w-full bg-white border-2 border-zinc-100 rounded-2xl px-6 py-4 font-black outline-none focus:border-[var(--color-buttons)] shadow-sm" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2.5 px-1 tracking-widest">Data de Validade (PVPS)</label>
                      <input type="date" className="w-full bg-white border-2 border-zinc-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-[var(--color-buttons)] shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2.5 px-1 tracking-widest">Custo NF (R$)</label>
                      <input type="number" step="0.01" className="w-full bg-white border-2 border-zinc-100 rounded-2xl px-6 py-4 font-black outline-none focus:border-[var(--color-buttons)] shadow-sm" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                    <div>
                      <p className="text-sm font-black text-zinc-700">Protocolo de Recebimento Digital</p>
                      <p className="text-xs font-bold text-zinc-400">Verificação Automática: {new Date().toLocaleString()}</p>
                    </div>
                  </div>
                  <button className="w-full bg-[var(--color-buttons)] text-white font-black py-6 rounded-2xl shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all text-lg">Atualizar Ativos e Motor ABC</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
