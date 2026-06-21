import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Users, Car, Bike, Shirt } from 'lucide-react';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    usuarios: 0,
    carros: 0,
    motos: 0,
    marcas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarEstatisticas = async () => {
      try {
        let usuariosCount = 0;
        if (user?.role === 'admin') {
          try {
            const users = await api.usuarios.listar(token);
            usuariosCount = users.length;
          } catch (e) {}
        }

        const [carros, motos, marcas] = await Promise.all([
          api.carros.listar(token).catch(() => []),
          api.motos.listar(token).catch(() => []),
          api.marcas.listar(token).catch(() => [])
        ]);

        setStats({
          usuarios: usuariosCount,
          carros: carros.length,
          motos: motos.length,
          marcas: marcas.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    buscarEstatisticas();
  }, [token, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-sm font-medium text-zinc-400">Carregando painel geral...</div>
      </div>
    );
  }

  const gridCols = user?.role === 'admin' ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <div className="space-y-6 transicao-pagina">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-sm text-zinc-400 mt-1">Resumo quantitativo de registros nas bases SQL e NoSQL.</p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-5`}>
        {user?.role === 'admin' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-all flex items-center gap-4">
            <div className="p-3 bg-zinc-800/80 text-amber-500 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <span className="block text-xs font-bold text-zinc-450 uppercase tracking-widest">Usuários (SQL)</span>
              <span className="text-2xl font-bold text-white mt-1 block">{stats.usuarios}</span>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-all flex items-center gap-4">
          <div className="p-3 bg-zinc-800/80 text-amber-500 rounded-lg">
            <Car size={20} />
          </div>
          <div>
            <span className="block text-xs font-bold text-zinc-450 uppercase tracking-widest">Carros (NoSQL)</span>
            <span className="text-2xl font-bold text-white mt-1 block">{stats.carros}</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-all flex items-center gap-4">
          <div className="p-3 bg-zinc-800/80 text-amber-500 rounded-lg">
            <Bike size={20} />
          </div>
          <div>
            <span className="block text-xs font-bold text-zinc-450 uppercase tracking-widest">Motos (NoSQL)</span>
            <span className="text-2xl font-bold text-white mt-1 block">{stats.motos}</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-all flex items-center gap-4">
          <div className="p-3 bg-zinc-800/80 text-amber-500 rounded-lg">
            <Shirt size={20} />
          </div>
          <div>
            <span className="block text-xs font-bold text-zinc-450 uppercase tracking-widest">Marcas (NoSQL)</span>
            <span className="text-2xl font-bold text-white mt-1 block">{stats.marcas}</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Bem-vindo ao painel, {user?.name}!</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Você está autenticado no Catapimbas com o perfil de <span className="font-semibold text-amber-500">{user?.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</span>. 
          Use o menu de navegação lateral para visualizar, incluir, editar ou remover registros.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
