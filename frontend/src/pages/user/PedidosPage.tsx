import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Ticket, Film, Coffee } from 'lucide-react';
import api from '../../api/axios';
import type { Pedido, Ingresso, PedidoLancheCombo } from '../../types';

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const { data } = await api.get('/pedidos'); // Needs user context or standard index returns current user's
        setPedidos(data);
      } catch (err) {
        toast.error('Erro ao buscar meus pedidos');
      }
    };
    fetchPedidos();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100 border-b border-zinc-800 pb-4 flex items-center gap-2">
        <Ticket className="text-indigo-400" /> Meus Ingressos & Pedidos
      </h1>

      <div className="grid gap-6">
        {pedidos.map(p => {
          const dt = new Date(p.dataHora);
          return (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-[0.3] flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                <span className="text-sm text-zinc-500 uppercase font-bold tracking-widest mb-1">Pedido #{p.id}</span>
                <span className="text-2xl font-black text-indigo-400 mb-1">
                  R$ {Number(p.valorTotal).toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs text-zinc-500">{dt.toLocaleDateString('pt-BR')} {dt.toLocaleTimeString('pt-BR')}</span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-sm uppercase text-zinc-500 font-bold mb-3 flex items-center gap-2 border-b border-zinc-800/50 pb-1">
                    <Film size={14}/> Ingressos {p.ingressos && `(${p.ingressos.length})`}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 pb-3">
                    {p.ingressos?.map((ing: Ingresso) => (
                      <div key={ing.id} className="flex gap-3 bg-zinc-950/50 border flex-shrink-0 border-indigo-900/30 p-3 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                        <div>
                          <p className="font-bold text-zinc-200">{ing.sessao?.filme?.titulo}</p>
                          <p className="text-xs text-zinc-400">
                            {new Date(ing.sessao?.horarioInicio || '').toLocaleString('pt-BR')} • Sala {ing.sessao?.sala?.numero}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-indigo-300">
                            {ing.tipo.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!p.ingressos || p.ingressos.length === 0) && <p className="text-zinc-600 text-sm">Nenhum ingresso neste pedido.</p>}
                  </div>
                </div>
                
                {p.lanches && p.lanches.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase text-zinc-500 font-bold mb-2 flex items-center gap-2 border-b border-zinc-800/50 pb-1">
                      <Coffee size={14}/> Lanches
                    </h3>
                    <div className="inline-flex gap-2 flex-wrap text-sm text-zinc-300">
                      {p.lanches.map((pl: PedidoLancheCombo) => (
                        <span key={pl.id} className="bg-zinc-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
                          <span className="text-indigo-400 font-bold">{pl.quantidade}x</span> {pl.lancheCombo.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {pedidos.length === 0 && (
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
            <Ticket size={48} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-xl font-medium text-zinc-300 mb-2">Você ainda não realizou compras.</h3>
            <p className="text-zinc-500">Volte para a área "Em Cartaz" e adquira seus ingressos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosPage;
