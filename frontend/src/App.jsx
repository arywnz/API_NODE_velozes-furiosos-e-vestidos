import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Carros from './pages/Carros';
import Motos from './pages/Motos';
import MarcasRoupa from './pages/MarcasRoupa';
import { LogOut, Home, Users, Car, Bike, Shirt, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  const links = [
    { to: '/', label: 'Dashboard', icon: <Home size={18} /> },
    ...(user?.role === 'admin' ? [{ to: '/usuarios', label: 'Usuários (SQL)', icon: <Users size={18} /> }] : []),
    { to: '/carros', label: 'Carros (NoSQL)', icon: <Car size={18} /> },
    { to: '/motos', label: 'Motos (NoSQL)', icon: <Bike size={18} /> },
    { to: '/marcas', label: 'Marcas de Roupa', icon: <Shirt size={18} /> }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-950 text-zinc-100 antialiased">
      <header className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xl font-black text-amber-500 tracking-tight">Catapimbas</span>
        <button onClick={() => setMenuAberto(!menuAberto)} className="text-zinc-400 hover:text-white">
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <nav className={`
        fixed md:relative inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800/80 p-5 flex flex-col justify-between
        transform ${menuAberto ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
        <div>
          <div className="hidden md:block mb-8 px-3">
            <span className="text-2xl font-black text-amber-500 tracking-tight">Catapimbas</span>
          </div>

          <div className="mb-6 mx-3 pb-6 border-b border-zinc-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center uppercase shadow-inner text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-semibold text-zinc-200 truncate">{user?.name}</span>
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{user?.role}</span>
            </div>
          </div>

          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all
                    ${isActive 
                      ? 'bg-amber-500/10 text-amber-500 border-l-2 border-amber-500 pl-3' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'}
                  `}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3.5 py-2.5 mt-8 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg font-medium text-sm transition-colors"
        >
          <LogOut size={18} />
          Sair do sistema
        </button>
      </nav>

      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <main className="flex-1 p-6 md:p-10 w-full">
        {children}
      </main>
    </div>
  );
};

const RotaPrivada = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Carregando...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { authenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={
            <RotaPrivada>
              <Dashboard />
            </RotaPrivada>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RotaPrivada>
              <Usuarios />
            </RotaPrivada>
          }
        />
        <Route
          path="/carros"
          element={
            <RotaPrivada>
              <Carros />
            </RotaPrivada>
          }
        />
        <Route
          path="/motos"
          element={
            <RotaPrivada>
              <Motos />
            </RotaPrivada>
          }
        />
        <Route
          path="/marcas"
          element={
            <RotaPrivada>
              <MarcasRoupa />
            </RotaPrivada>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
