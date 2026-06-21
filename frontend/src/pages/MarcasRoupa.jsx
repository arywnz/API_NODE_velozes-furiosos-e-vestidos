import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const MarcasRoupa = () => {
  const { token } = useAuth();
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [nome, setNome] = useState('');
  const [fundador, setFundador] = useState('');
  const [anoFundacao, setAnoFundacao] = useState('');
  const [paisOrigem, setPaisOrigem] = useState('');

  const carregarMarcas = async () => {
    setLoading(true);
    try {
      const data = await api.marcas.listar(token);
      setMarcas(data);
    } catch (err) {
      setError(err.message || 'Falha ao buscar marcas de roupa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMarcas();
  }, [token]);

  const abrirCriar = () => {
    setEditandoId(null);
    setNome('');
    setFundador('');
    setAnoFundacao('');
    setPaisOrigem('');
    setError('');
    setSuccess('');
    setModalAberto(true);
  };

  const abrirEditar = (m) => {
    setEditandoId(m._id);
    setNome(m.nome);
    setFundador(m.fundador);
    setAnoFundacao(m.anoFundacao);
    setPaisOrigem(m.paisOrigem);
    setError('');
    setSuccess('');
    setModalAberto(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const dados = {
      nome,
      fundador,
      anoFundacao: parseInt(anoFundacao),
      paisOrigem
    };

    try {
      if (editandoId) {
        await api.marcas.atualizar(editandoId, dados, token);
        setSuccess('Marca de roupa atualizada com sucesso!');
      } else {
        await api.marcas.criar(dados, token);
        setSuccess('Marca de roupa cadastrada com sucesso!');
      }
      setModalAberto(false);
      carregarMarcas();
    } catch (err) {
      setError(err.message || 'Falha ao salvar marca de roupa');
    }
  };

  const deletar = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta marca de roupa?')) return;
    setError('');
    setSuccess('');

    try {
      await api.marcas.excluir(id, token);
      setSuccess('Marca de roupa removida com sucesso!');
      carregarMarcas();
    } catch (err) {
      setError(err.message || 'Erro ao remover marca de roupa');
    }
  };

  return (
    <>
      <div className="space-y-6 transicao-pagina">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Marcas de Roupa (NoSQL)</h2>
            <p className="text-sm text-zinc-400 mt-1">Gerenciamento de marcas no banco não-relacional MongoDB.</p>
          </div>
          <button
            onClick={abrirCriar}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-md active:scale-[0.98]"
          >
            <Plus size={16} /> Nova Marca
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
                    <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Nome</th>
                    <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Fundador</th>
                    <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">Ano de Fundação</th>
                    <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs">País de Origem</th>
                    <th className="px-5 py-3.5 text-zinc-400 font-bold uppercase tracking-wider text-xs text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {marcas.map((m) => (
                    <tr key={m._id} className="hover:bg-zinc-800/10 transition-colors">
                      <td className="px-5 py-3.5 text-white font-semibold">{m.nome}</td>
                      <td className="px-5 py-3.5 text-zinc-300">{m.fundador}</td>
                      <td className="px-5 py-3.5 text-zinc-300">{m.anoFundacao}</td>
                      <td className="px-5 py-3.5 text-zinc-300">{m.paisOrigem}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => abrirEditar(m)}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-350 hover:text-white rounded transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deletar(m._id)}
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
              {editandoId ? 'Editar Marca' : 'Nova Marca'}
            </h3>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Nome da Marca</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Ex: Nike"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Fundador</label>
                <input
                  type="text"
                  required
                  value={fundador}
                  onChange={(e) => setFundador(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Ex: Phil Knight"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Ano de Fundação</label>
                  <input
                    type="number"
                    required
                    value={anoFundacao}
                    onChange={(e) => setAnoFundacao(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Ex: 1964"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">País de Origem</label>
                  <input
                    type="text"
                    required
                    value={paisOrigem}
                    onChange={(e) => setPaisOrigem(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Ex: EUA"
                  />
                </div>
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

export default MarcasRoupa;
