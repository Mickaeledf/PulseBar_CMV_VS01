import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Desperdicios from './pages/Desperdicios/Desperdicios';
import Garrafas from './pages/Garrafas/Garrafas';
import Cardapio from './pages/Cardapio/Cardapio';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import Fechamento from './pages/Fechamento/Fechamento';
import Inventario from './pages/Inventario/Inventario';
import CurvaABC from './pages/Garrafas/CurvaABC';
import Login from './pages/Auth/Login';
import Planos from './pages/Planos/Planos';
import { AppDataProvider, AppDataContext } from './context/AppDataContext';

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useContext(AppDataContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PlanGuard = ({ children }) => {
  const { subscriptionPlan } = useContext(AppDataContext);
  if (subscriptionPlan === 'basic') return <Navigate to="/planos" replace />;
  return children;
};

function AppRoutes() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
            <Route index element={<Dashboard />} />
            <Route path="desperdicios" element={<Desperdicios />} />
            <Route path="garrafas" element={<Garrafas />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="planos" element={<Planos />} />
            
            {/* Telas Advanced */}
            <Route path="cardapio" element={<PlanGuard><Cardapio /></PlanGuard>} />
            <Route path="fechamento" element={<PlanGuard><Fechamento /></PlanGuard>} />
            <Route path="curva-abc" element={<PlanGuard><CurvaABC /></PlanGuard>} />
            <Route path="ia-insights" element={
              <PlanGuard>
                <div className="card">
                  <h1 className="text-gold" style={{marginBottom:'1rem'}}>IA Insights</h1>
                  <p className="text-muted">Assistente analisando seus dados...</p>
                  <div style={{marginTop:'2rem', padding:'1rem', backgroundColor:'var(--bg-input)', borderRadius:'8px'}}>
                    <p><strong>Insight Automático:</strong> O drink "Moscow Mule" está com o CMV excelente (18.5%). Considere promover este drink para aumentar sua margem de lucro global.</p>
                  </div>
                </div>
              </PlanGuard>
            } />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </Router>
  );
}

function App() {
  return (
    <AppDataProvider>
      <AppRoutes />
    </AppDataProvider>
  );
}

export default App;
