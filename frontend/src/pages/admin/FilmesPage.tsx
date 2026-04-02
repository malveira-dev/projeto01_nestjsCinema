import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Film as FilmIcon } from 'lucide-react';
import api from '../../api/axios';
import type { Filme, Genero } from '../../types';

const FilmesPage = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [titulo, setTitulo] = useState('');
  const [generoId, setGeneroId] = useState('');
  const [duracao, setDuracao] = useState('');
  const [classificacao, setClassificacao] = useState('L');

  const fetchFilmes = async () => {
    try {
      const { data } = await api.get('/filmes');
      setFilmes(data);
    } catch (err) {
      toast.error('Erro ao buscar filmes');
    }
  };

  const fetchGeneros = async () => {
    try {
      const { data } = await api.get('/generos');
      setGeneros(data);
    } catch (err) {
      toast.error('Erro ao buscar gêneros');
    }
  };

  useEffect(() => {
    fetchFilmes();
    fetchGeneros();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generoId) {
      return toast.error('Selecione um gênero');
    }

    const payload = {
      titulo,
      generoId: Number(generoId),
      duracao: Number(duracao),
      classificacaoEtaria: classificacao,
    };

    try {
      if (editingId) {
        await api.patch(`/filmes/${editingId}`, payload);
        toast.success('Filme atualizado!');
      } else {
        await api.post('/filmes', payload);
        toast.success('Filme criado!');
      }
      resetForm();
      fetchFilmes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar filme');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitulo('');
    setGeneroId('');
    setDuracao('');
    setClassificacao('L');
  };

  const handleEdit = (filme: Filme) => {
    setEditingId(filme.id);
    setTitulo(filme.titulo);
    setGeneroId(filme.generoId.toString());
    setDuracao(filme.duracao.toString());
    setClassificacao(filme.classificacaoEtaria);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir este filme?')) return;
    try {
      await api.delete(`/filmes/${id}`);
      toast.success('Excluído');
      fetchFilmes();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100 border-b border-zinc-800 pb-4">Gerenciar Filmes</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-zinc-200 mb-4 flex items-center gap-2">
          <FilmIcon size={20} className="text-indigo-400" />
          {editingId ? 'Editar Filme' : 'Novo Filme'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Título</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="O Poderoso Chefão"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Gênero</label>
            <select
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={generoId}
              onChange={(e) => setGeneroId(e.target.value)}
            >
              <option value="" disabled>Selecione...</option>
              {generos.map((g) => (
                <option key={g.id} value={g.id}>{g.nome}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Duração (minutos)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              placeholder="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Classificação</label>
            <select
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={classificacao}
              onChange={(e) => setClassificacao(e.target.value)}
            >
              {['L', 'A10', 'A12', 'A14', 'A16', 'A18'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
              {editingId ? 'Salvar Alterações' : 'Cadastrar Filme'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800 text-sm font-medium text-zinc-400">
              <th className="px-6 py-4 uppercase">Filme</th>
              <th className="px-6 py-4 uppercase">Gênero</th>
              <th className="px-6 py-4 uppercase">Duração (min)</th>
              <th className="px-6 py-4 uppercase">Classificação</th>
              <th className="px-6 py-4 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {filmes.map((filme) => (
              <tr key={filme.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-100">{filme.titulo}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-500/20">
                    {filme.genero?.nome || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">{filme.duracao} m</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-bold
                    ${filme.classificacaoEtaria === 'L' ? 'bg-green-600 text-white' : 
                      filme.classificacaoEtaria === 'A10' ? 'bg-blue-600 text-white' : 
                      filme.classificacaoEtaria === 'A12' ? 'bg-yellow-500 text-zinc-900' : 
                      filme.classificacaoEtaria === 'A14' ? 'bg-orange-500 text-white' : 
                      filme.classificacaoEtaria === 'A16' ? 'bg-red-500 text-white' : 
                      'bg-black border border-red-500 text-red-500'}`}>
                    {filme.classificacaoEtaria === 'A10' ? '10' : 
                     filme.classificacaoEtaria === 'A12' ? '12' : 
                     filme.classificacaoEtaria === 'A14' ? '14' : 
                     filme.classificacaoEtaria === 'A16' ? '16' : 
                     filme.classificacaoEtaria === 'A18' ? '18' : 'L'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(filme)}
                      className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(filme.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filmes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  Nenhum filme cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilmesPage;
