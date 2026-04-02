import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Calendar, Clock, DollarSign } from 'lucide-react';
import api from '../../api/axios';
import type { Sessao, Filme, Sala } from '../../types';

const SessoesPage = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  
  const [filmeId, setFilmeId] = useState('');
  const [salaId, setSalaId] = useState('');
  const [dataLocal, setDataLocal] = useState('');
  const [horaLocal, setHoraLocal] = useState('');
  const [valorIngresso, setValorIngresso] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [sRes, fRes, salRes] = await Promise.all([
        api.get('/sessao'),
        api.get('/filmes'),
        api.get('/salas')
      ]);
      setSessoes(sRes.data);
      setFilmes(fRes.data);
      setSalas(salRes.data);
    } catch (err) {
      toast.error('Erro ao buscar dados das sessões');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filmeId || !salaId || !dataLocal || !horaLocal || !valorIngresso) {
      return toast.error('Preencha todos os campos!');
    }

    // Criar o Datetime local e converter para ISO String (com fuso horário compensado, ou usar UTC conforme backend)
    // Para simplificar, montamos a string que o new Date(str) nativo entende e garantimos que subimos no formato aceito pelo backend.
    const horarioInicio = new Date(`${dataLocal}T${horaLocal}:00`).toISOString();

    const payload = {
      filmeId: Number(filmeId),
      salaId: Number(salaId),
      horarioInicio,
      valorIngresso: Number(valorIngresso),
    };

    try {
      if (editingId) {
        await api.patch(`/sessao/${editingId}`, payload);
        toast.success('Sessão atualizada!');
      } else {
        await api.post('/sessao', payload);
        toast.success('Sessão registrada com sucesso!');
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      // Regra 1: Tratamento do erro de sobreposição de horário
      toast.error(err.response?.data?.message || 'Erro ao salvar sessão');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFilmeId('');
    setSalaId('');
    setDataLocal('');
    setHoraLocal('');
    setValorIngresso('');
  };

  const handleEdit = (s: Sessao) => {
    setEditingId(s.id);
    setFilmeId(s.filmeId.toString());
    setSalaId(s.salaId.toString());
    setValorIngresso(s.valorIngresso.toString());
    
    // Extrair data e hora pro input "date" e "time"
    const dateObj = new Date(s.horarioInicio);
    // Para renderizar corretamente input local, precisa ajustar ao offset ou converter toISO local.
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    setDataLocal(`${year}-${month}-${day}`);
    
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const mins = String(dateObj.getMinutes()).padStart(2, '0');
    setHoraLocal(`${hours}:${mins}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir esta sessão? Ação destrutiva caso haja ingressos.')) return;
    try {
      await api.delete(`/sessao/${id}`);
      toast.success('Excluída');
      fetchData();
    } catch (err) {
      toast.error('Erro ao excluir a sessão');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100 border-b border-zinc-800 pb-4">Gerenciar Sessões</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-zinc-200 mb-4 flex items-center gap-2">
          {editingId ? 'Editar Sessão' : 'Nova Sessão (Valida Conflitos de Sala)'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="col-span-1 lg:col-span-2">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Filme</label>
            <select
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={filmeId}
              onChange={(e) => setFilmeId(e.target.value)}
            >
              <option value="" disabled>Selecione um filme...</option>
              {filmes.map((f) => (
                <option key={f.id} value={f.id}>{f.titulo}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Sala</label>
            <select
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={salaId}
              onChange={(e) => setSalaId(e.target.value)}
            >
              <option value="" disabled>Qual sala?</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>{s.numero} ({s.capacidade} lug)</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Data</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={dataLocal}
              onChange={(e) => setDataLocal(e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Hora</label>
            <input
              type="time"
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
              value={horaLocal}
              onChange={(e) => setHoraLocal(e.target.value)}
            />
          </div>

          <div className="col-span-1 lg:col-span-2">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Valor do Ingresso (R$)</label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-zinc-500">$</span>
              <input
                type="number"
                step="0.01"
                required
                className="w-full pl-8 pr-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-zinc-200 outline-none"
                value={valorIngresso}
                onChange={(e) => setValorIngresso(e.target.value)}
                placeholder="25.00"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end gap-2 items-end">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="h-[42px] px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="h-[42px] px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
            >
              {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
              {editingId ? 'Salvar Configuração' : 'Registrar Sessão'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sessoes.map((sessao) => {
          const dt = new Date(sessao.horarioInicio);
          return (
            <div key={sessao.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/30 transition-colors shadow-lg shadow-black/20 flex flex-col">
              <div className="bg-zinc-950 p-4 border-b border-zinc-800">
                <h3 className="font-bold text-lg text-indigo-100 truncate">{sessao.filme?.titulo || 'Filme Deletado'}</h3>
                <p className="text-zinc-500 text-sm flex items-center gap-1 mt-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  {sessao.sala?.numero || 'Sala ?'} ({sessao.sala?.capacidade} lugares)
                </p>
              </div>
              
              <div className="p-4 space-y-3 flex-1 text-sm text-zinc-300">
                <div className="flex items-center gap-3">
                  <Calendar className="text-zinc-500" size={16} />
                  <span>{dt.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-indigo-400" size={16} />
                  <span className="font-medium text-indigo-300">
                    {dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-zinc-500 text-xs ml-auto">
                    ( {sessao.filme?.duracao}m )
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="text-green-400" size={16} />
                  <span>R$ {Number(sessao.valorIngresso).toFixed(2).replace('.', ',')} inteira</span>
                </div>
              </div>
              
              <div className="p-3 bg-zinc-950/80 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-xs text-zinc-500">ID: #{sessao.id}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(sessao)} className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(sessao.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {sessoes.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
            Nenhuma sessão programada no momento
          </div>
        )}
      </div>
    </div>
  );
};

export default SessoesPage;
