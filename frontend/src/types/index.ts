export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface Genero {
  id: number;
  nome: string;
}

export interface Filme {
  id: number;
  titulo: string;
  generoId: number;
  duracao: number;
  classificacaoEtaria: string;
  genero?: Genero;
}

export interface Sala {
  id: number;
  numero: string;
  capacidade: number;
}

export interface Sessao {
  id: number;
  filmeId: number;
  salaId: number;
  horarioInicio: string;
  valorIngresso: number;
  filme?: Filme;
  sala?: Sala;
  _count?: {
    ingressos: number;
  };
}

export interface Ingresso {
  id: number;
  sessaoId: number;
  tipo: 'Inteira' | 'Meia';
  valorPago: number;
  sessao?: Sessao;
}

export interface LancheCombo {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  itens: string;
}

export interface PedidoLancheCombo {
  id: number;
  quantidade: number;
  lancheCombo: LancheCombo;
}

export interface Pedido {
  id: number;
  valorTotal: number;
  dataHora: string;
  usuario?: Usuario;
  ingressos?: Ingresso[];
  lanches?: PedidoLancheCombo[];
}
