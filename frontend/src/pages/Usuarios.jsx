import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const Usuarios = () => {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await api.usuarios.listar(token);
      setUsuarios(data);
    } catch (err) {
      setError(err.message || 'Falha ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      carregarUsuarios();
    }
  }, [token, user]);

  const abrirCriar = () => {
    setEditandoId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    setError('');
    setSuccess('');
    setModalAberto(true);
  };

  const abrirEditar = (u) => {
    setEditandoId(u.id);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setRole(u.role);
    setError('');
    setSuccess('');
    setModalAberto(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editandoId) {
        const dados = { name, email, role };
        if (password) dados.password = password;
        await api.usuarios.atualizar(editandoId, dados, token);
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        await api.usuarios.criar({ name, email, password, role }, token);
        setSuccess('Usuário criado com sucesso!');
      }
      setModalAberto(false);
      carregarUsuarios();
    } catch (err) {
      setError(err.message || 'Falha ao salvar usuário');
    }
  };

  const deletar = async (id) => {
    if (!window.confirm('Deseja realmente excluir este usuário?')) return;
    setError('');
    setSuccess('');

    try {
      await api.usuarios.excluir(id, token);
      setSuccess('Usuário removido com sucesso!');
      carregarUsuarios();
    } catch (err) {
      setError(err.message || 'Erro ao remover usuário');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-xl text-red-200">
        <h2 className="text-lg font-bold mb-1">Acesso Proibido</h2>
        <p className="text-sm">Você não possui permissões administrativas para gerenciar a base de usuários.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 transicao-pagina">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Usuários (SQL)</h2>
          <p className="text-sm text-zinc-400 mt-1">Gerenciamento de acessos no banco relacional PostgreSQL.</p>
        </div>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/60 text-red-200 rounded-lg text-xs font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 rounded-lg text-xs font-medium">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-zinc-400">Buscando registros...</div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-800/30 border-b border-zinc-800">
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">ID</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Nome</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">E-mail</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Perfil</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="px-5 py-3.5 text-zinc-500">{u.id}</td>
                    <td className="px-5 py-3.5 text-white font-semibold">{u.name}</td>
                    <td className="px-5 py-3.5 text-zinc-300">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => abrirEditar(u)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-350 hover:text-white rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deletar(u.id)}
                          className="p-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold text-white mb-5">
              {editandoId ? 'Editar Usuário' : 'Novo Usuário'}
            </h3>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Nome</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Senha {editandoId && <span className="text-[10px] text-zinc-500 capitalize font-normal">(em branco para manter)</span>}
                </label>
                <input
                  type="password"
                  required={!editandoId}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Cargo</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="user">Usuário Comum</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 py-2 border border-zinc-800 hover:bg-zinc-800/40 text-zinc-400 font-bold rounded-lg text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg text-sm transition-colors shadow-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Usuarios;
