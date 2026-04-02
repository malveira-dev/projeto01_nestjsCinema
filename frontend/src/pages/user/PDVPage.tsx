import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCart, Film, Calendar, Clock, CreditCard } from 'lucide-react';
import api from '../../api/axios';
import type { Sessao, LancheCombo } from '../../types';
import { useNavigate } from 'react-router-dom';

const PDVPage = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const navigate = useNavigate();
  
  const [selectedSessaoId, setSelectedSessaoId] = useState<number | null>(null);
  const [ingressosInt, setIngressosInt] = useState(1);
  const [ingressosMeia, setIngressosMeia] = useState(0);
  const [lanchesCart, setLanchesCart] = useState<{ id: number; qty: number }[]>([]);

  const fetchCatalog = async () => {
    try {
      const [sRes, lRes] = await Promise.all([
        api.get('/sessao'),
        api.get('/lanche-combo')
      ]);
      setSessoes(sRes.data);
      setLanches(lRes.data);
    } catch (err) {
      toast.error('Erro ao buscar catálogo');
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleLancheChange = (lancheId: number, qty: number) => {
    setLanchesCart(prev => {
      const existing = prev.find(i => i.id === lancheId);
      if (!existing && qty > 0) return [...prev, { id: lancheId, qty }];
      return prev.map(i => i.id === lancheId ? { ...i, qty } : i).filter(i => i.qty > 0);
    });
  };

  const selectedSessao = sessoes.find(s => s.id === selectedSessaoId);
  const getSubtotalIngressos = () => {
    if (!selectedSessao) return 0;
    const preco = Number(selectedSessao.valorIngresso);
    return (ingressosInt * preco) + (ingressosMeia * preco / 2);
  };
  
  const getSubtotalLanches = () => {
    return lanchesCart.reduce((acc, item) => {
      const dbLanche = lanches.find(l => l.id === item.id);
      return acc + (dbLanche ? Number(dbLanche.preco) * item.qty : 0);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!selectedSessao) return toast.error('Selecione uma sessão!');
    if (ingressosInt + ingressosMeia === 0) return toast.error('Nenhum ingresso selecionado');

    const ingressosData = [];
    for (let i = 0; i < ingressosInt; i++) {
        ingressosData.push({ sessaoId: selectedSessao.id, tipo: 'Inteira' });
    }
    for (let i = 0; i < ingressosMeia; i++) {
        ingressosData.push({ sessaoId: selectedSessao.id, tipo: 'Meia' });
    }

    try {
      await api.post('/pedidos', {
        ingressos: ingressosData,
        lanches: lanchesCart.map(i => ({ lancheComboId: i.id, quantidade: i.qty }))
      });
      toast.success('Pedido concluído e ingressos gerados!');
      navigate('/app/pedidos');
    } catch (err: any) {
      // Regra 2 (capacidade) e Regra 3 (cálculo de preço) implementadas no backend e expostas via payload/Exception
      toast.error(err.response?.data?.message || 'Erro ao processar pedido');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-2">
          <Film className="text-indigo-400" /> Filmes em Cartaz
        </h1>
        <p className="text-zinc-500 mt-2">Escolha uma sessão para comprar seus ingressos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Esquerda: Catálogo das Sessões */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-zinc-900 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            {sessoes.map(s => {
              const dt = new Date(s.horarioInicio);
              const ingressosVendidos = s._count?.ingressos || 0;
              const capacidade = s.sala?.capacidade || 0;
              const esgotado = ingressosVendidos >= capacidade;
              
              return (
                <div 
                  key={s.id} 
                  onClick={() => !esgotado && setSelectedSessaoId(s.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
                    ${selectedSessaoId === s.id ? 'border-indigo-500 bg-indigo-950/20 translate-y-[-2px] shadow-lg shadow-indigo-500/10' : 
                    esgotado ? 'border-zinc-800 bg-zinc-900/50 opacity-60 cursor-not-allowed' :
                    'border-zinc-800 bg-zinc-950 hover:border-indigo-500/50 hover:bg-zinc-900'}
                  `}
                >
                  {esgotado && <div className="absolute top-4 right-4 text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">ESGOTADO</div>}
                  <h3 className="text-lg font-bold text-zinc-100 line-clamp-1 pr-14">{s.filme?.titulo}</h3>
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300 mb-3 border border-zinc-700">
                    {s.filme?.genero?.nome} • {s.filme?.duracao}m • {s.filme?.classificacaoEtaria}
                  </div>
                  
                  <div className="space-y-2 text-sm text-zinc-400">
                    <div className="flex gap-2 items-center"><Calendar size={15}/> {dt.toLocaleDateString('pt-BR')}</div>
                    <div className="flex gap-2 items-center"><Clock size={15}/> {dt.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}</div>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-zinc-800/50">
                      <span className="font-semibold text-green-400">R$ {Number(s.valorIngresso).toFixed(2).replace('.', ',')}</span>
                      <span className="text-xs">{capacidade - ingressosVendidos} lugares livres</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {sessoes.length === 0 && <p className="text-zinc-500 py-10">Nenhuma sessão disponível hoje.</p>}
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">Adicione ao seu combo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {lanches.map(l => {
                const qty = lanchesCart.find(i => i.id === l.id)?.qty || 0;
                return (
                  <div key={l.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                    <h4 className="font-medium text-zinc-200 text-sm mb-1">{l.nome}</h4>
                    <p className="text-xs text-zinc-500 mb-2 h-8 line-clamp-2">{l.itens}</p>
                    <p className="font-semibold text-indigo-400 mb-3">R$ {Number(l.preco).toFixed(2).replace('.', ',')}</p>
                    
                    <div className="flex items-center justify-between border border-zinc-700 rounded-lg p-1 bg-zinc-950">
                      <button type="button" onClick={() => handleLancheChange(l.id, Math.max(0, qty - 1))} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-800 rounded hover:bg-zinc-700">-</button>
                      <span className="text-zinc-200 font-medium text-sm">{qty}</span>
                      <button type="button" onClick={() => handleLancheChange(l.id, qty + 1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-800 rounded hover:bg-zinc-700">+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Direita: Checkout */}
        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 h-fit sticky top-6 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mb-6">
            <ShoppingCart className="text-indigo-400" /> Resumo da Compra
          </h2>

          {!selectedSessao ? (
            <div className="text-center py-10 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
              Selecione uma sessão ao lado para iniciar
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-950 border border-indigo-500/20 rounded-xl">
                <p className="font-bold text-indigo-300">{selectedSessao.filme?.titulo}</p>
                <p className="text-sm text-zinc-400">{new Date(selectedSessao.horarioInicio).toLocaleString('pt-BR', { dateStyle:'short', timeStyle: 'short'})} • Sala {selectedSessao.sala?.numero}</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">Ingresso Inteira</span>
                    <div className="flex items-center gap-3">
                      <button onClick={()=>setIngressosInt(Math.max(0, ingressosInt-1))} className="px-2 py-0.5 bg-zinc-800 rounded text-sm">-</button>
                      <span className="w-4 text-center">{ingressosInt}</span>
                      <button onClick={()=>setIngressosInt(ingressosInt+1)} className="px-2 py-0.5 bg-zinc-800 rounded text-sm">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">Meia-entrada</span>
                    <div className="flex items-center gap-3">
                      <button onClick={()=>setIngressosMeia(Math.max(0, ingressosMeia-1))} className="px-2 py-0.5 bg-zinc-800 rounded text-sm">-</button>
                      <span className="w-4 text-center">{ingressosMeia}</span>
                      <button onClick={()=>setIngressosMeia(ingressosMeia+1)} className="px-2 py-0.5 bg-zinc-800 rounded text-sm">+</button>
                    </div>
                  </div>
                </div>
              </div>

              {lanchesCart.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Lanches</h3>
                  <ul className="space-y-1 text-sm text-zinc-300 border-l-2 border-zinc-800 pl-3">
                    {lanchesCart.map(item => {
                      const lInfo = lanches.find(l=>l.id===item.id);
                      return <li key={item.id} className="flex justify-between"><span>{item.qty}x {lInfo?.nome}</span></li>
                    })}
                  </ul>
                </div>
              )}

              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Ingressos</span>
                  <span>R$ {getSubtotalIngressos().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Lanches</span>
                  <span>R$ {getSubtotalLanches().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="text-green-400">R$ {(getSubtotalIngressos() + getSubtotalLanches()).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={ingressosInt + ingressosMeia === 0}
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 transition-all"
              >
                <CreditCard size={18} /> Rezar Pagamento (Simulado)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDVPage;
