import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const Carros = () => {
  const { token } = useAuth();
  const [carros, setCarros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [preco, setPreco] = useState('');

  const carregarCarros = async () => {
    setLoading(true);
    try {
      const data = await api.carros.listar(token);
      setCarros(data);
    } catch (err) {
      setError(err.message || 'Falha ao buscar carros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCarros();
  }, [token]);

  const abrirCriar = () => {
    setEditandoId(null);
    setMarca('');
    setModelo('');
    setAno('');
    setCor('');
    setPreco('');
    setError('');
    setSuccess('');
    setModalAberto(true);
  };

  const abrirEditar = (c) => {
    setEditandoId(c._id);
    setMarca(c.marca);
    setModelo(c.modelo);
    setAno(c.ano);
    setCor(c.cor);
    setPreco(c.preco);
    setError('');
    setSuccess('');
    setModalAberto(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const dados = {
      marca,
      modelo,
      ano: parseInt(ano),
      cor,
      preco: parseFloat(preco)
    };

    try {
      if (editandoId) {
        await api.carros.atualizar(editandoId, dados, token);
        setSuccess('Carro atualizado com sucesso!');
      } else {
        await api.carros.criar(dados, token);
        setSuccess('Carro cadastrado com sucesso!');
      }
      setModalAberto(false);
      carregarCarros();
    } catch (err) {
      setError(err.message || 'Falha ao salvar carro');
    }
  };

  const deletar = async (id) => {
    if (!window.confirm('Deseja realmente excluir este carro?')) return;
    setError('');
    setSuccess('');

    try {
      await api.carros.excluir(id, token);
      setSuccess('Carro removido com sucesso!');
      carregarCarros();
    } catch (err) {
      setError(err.message || 'Erro ao remover carro');
    }
  };

  return (
    <>
      <div className="space-y-6 transicao-pagina">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Carros (NoSQL)</h2>
          <p className="text-sm text-zinc-400 mt-1">Gerenciamento de veículos no banco não-relacional MongoDB.</p>
        </div>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Novo Carro
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
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Marca</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Modelo</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Ano</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Cor</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Preço</th>
                  <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {carros.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="px-5 py-3.5 text-white font-semibold">{c.marca}</td>
                    <td className="px-5 py-3.5 text-zinc-300">{c.modelo}</td>
                    <td className="px-5 py-3.5 text-zinc-300">{c.ano}</td>
                    <td className="px-5 py-3.5 text-zinc-300">{c.cor}</td>
                    <td className="px-5 py-3.5 text-amber-500 font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.preco)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => abrirEditar(c)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-350 hover:text-white rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deletar(c._id)}
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
              {editandoId ? 'Editar Carro' : 'Novo Carro'}
            </h3>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Marca</label>
                <input
                  type="text"
                  required
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Ex: Ford"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Modelo</label>
                <input
                  type="text"
                  required
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Ex: Mustang"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Ano</label>
                  <input
                    type="number"
                    required
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Ex: 2022"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Cor</label>
                  <input
                    type="text"
                    required
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Ex: Preto"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Ex: 350000.00"
                />
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

export default Carros;
