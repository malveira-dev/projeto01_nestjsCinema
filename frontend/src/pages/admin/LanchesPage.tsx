import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import type { LancheCombo } from '../../types';

const LanchesPage = () => {
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [itens, setItens] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchLanches = async () => {
    try {
      const { data } = await api.get('/lanches-combos');
      setLanches(data);
    } catch (err) {
      toast.error('Erro ao buscar lanches');
    }
  };

  useEffect(() => {
    fetchLanches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { nome, descricao, preco: Number(preco), itens };
      if (editingId) {
        await api.patch(`/lanches-combos/${editingId}`, payload);
        toast.success('Combo atualizado!');
      } else {
        await api.post('/lanches-combos', payload);
        toast.success('Combo criado!');
      }
      resetForm();
      fetchLanches();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar lanche');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setItens('');
  };

  const handleEdit = (l: LancheCombo) => {
    setEditingId(l.id);
    setNome(l.nome);
    setDescricao(l.descricao || '');
    setPreco(l.preco.toString());
    setItens(l.itens);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir este combo?')) return;
    try {
      await api.delete(`/lanches-combos/${id}`);
      toast.success('Excluído');
      fetchLanches();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100 border-b border-zinc-800 pb-4">Gerenciar Lanches & Combos</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-zinc-200 mb-4">
          {editingId ? 'Editar Combo' : 'Novo Combo'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          <div className="col-span-1 lg:col-span-2">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Item/Combo</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Combo Família"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="35.90"
            />
          </div>

          <div className="col-span-1 lg:col-span-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Itens Inclusos</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={itens}
              onChange={(e) => setItens(e.target.value)}
              placeholder="2 Pipocas M, 2 Refris 500ml"
            />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-2 border-t border-zinc-800 pt-4 flex gap-2 justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2"
            >
              {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
              {editingId ? 'Salvar Alterações' : 'Adicionar Lanche/Combo'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {lanches.map((lanche) => (
          <div key={lanche.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 relative group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-indigo-300">{lanche.nome}</h3>
                <span className="bg-indigo-900/40 text-indigo-400 px-2.5 py-1 text-sm rounded-lg font-mono border border-indigo-500/20">
                  R$ {Number(lanche.preco).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">{lanche.itens}</p>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/50 mt-auto">
              <button onClick={() => handleEdit(lanche)} className="text-zinc-400 hover:text-indigo-400 p-1.5 rounded-lg bg-zinc-800/50 hover:bg-indigo-900/30 transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(lanche.id)} className="text-zinc-400 hover:text-red-400 p-1.5 rounded-lg bg-zinc-800/50 hover:bg-red-900/30 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {lanches.length === 0 && (
          <div className="col-span-3 text-center py-10 text-zinc-500">
            Nenhum lanche ou combo cadastrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default LanchesPage;
