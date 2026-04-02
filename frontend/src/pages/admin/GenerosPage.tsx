import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import type { Genero } from '../../types';

const GenerosPage = () => {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [nome, setNome] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchGeneros = async () => {
    try {
      const { data } = await api.get('/generos');
      setGeneros(data);
    } catch (err) {
      toast.error('Erro ao buscar gêneros');
    }
  };

  useEffect(() => {
    fetchGeneros();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/generos/${editingId}`, { nome });
        toast.success('Gênero atualizado!');
      } else {
        await api.post('/generos', { nome });
        toast.success('Gênero criado!');
      }
      setNome('');
      setEditingId(null);
      fetchGeneros();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar gênero');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza?')) return;
    try {
      await api.delete(`/generos/${id}`);
      toast.success('Gênero excluído');
      fetchGeneros();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  const handleEdit = (genero: Genero) => {
    setEditingId(genero.id);
    setNome(genero.nome);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100 border-b border-zinc-800 pb-4">Gerenciar Gêneros</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-zinc-200 mb-4">
          {editingId ? 'Editar Gênero' : 'Novo Gênero'}
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Gênero</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ação, Aventura"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setNome(''); }}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800">
              <th className="px-6 py-4 text-sm font-medium text-zinc-400 uppercase">ID</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400 uppercase">Nome</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {generos.map((genero) => (
              <tr key={genero.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-mono text-zinc-500">{genero.id}</td>
                <td className="px-6 py-4 font-medium text-zinc-200">{genero.nome}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(genero)}
                      className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(genero.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {generos.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                  Nenhum gênero cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenerosPage;
