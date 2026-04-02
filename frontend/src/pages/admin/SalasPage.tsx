import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import type { Sala } from '../../types';

const SalasPage = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [numero, setNumero] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSalas = async () => {
    try {
      const { data } = await api.get('/salas');
      setSalas(data);
    } catch (err) {
      toast.error('Erro ao buscar salas');
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { numero, capacidade: Number(capacidade) };
      if (editingId) {
        await api.patch(`/salas/${editingId}`, payload);
        toast.success('Sala atualizada!');
      } else {
        await api.post('/salas', payload);
        toast.success('Sala criada!');
      }
      setNumero('');
      setCapacidade('');
      setEditingId(null);
      fetchSalas();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar sala');
    }
  };

  const handleEdit = (sala: Sala) => {
    setEditingId(sala.id);
    setNumero(sala.numero);
    setCapacidade(sala.capacidade.toString());
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir esta sala?')) return;
    try {
      await api.delete(`/salas/${id}`);
      toast.success('Excluída');
      fetchSalas();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100 border-b border-zinc-800 pb-4">Gerenciar Salas</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-zinc-200 mb-4">
          {editingId ? 'Editar Sala' : 'Nova Sala'}
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Identificação / Número</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ex: Sala 1, VIP"
            />
          </div>
          <div className="flex-[0.5]">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Capacidade (assentos)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
              placeholder="100"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2"
          >
            {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setNumero(''); setCapacidade(''); }}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800 text-sm text-zinc-400">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">SALA</th>
              <th className="px-6 py-4">CAPACIDADE</th>
              <th className="px-6 py-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {salas.map((sala) => (
              <tr key={sala.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4 font-mono text-zinc-500">{sala.id}</td>
                <td className="px-6 py-4 font-medium">{sala.numero}</td>
                <td className="px-6 py-4">{sala.capacidade} lugares</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleEdit(sala)} className="text-indigo-400 hover:bg-indigo-400/10 p-2 rounded">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(sala.id)} className="text-red-400 hover:bg-red-400/10 p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalasPage;
