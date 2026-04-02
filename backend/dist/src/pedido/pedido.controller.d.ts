import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
export declare class PedidoController {
    private readonly pedidoService;
    constructor(pedidoService: PedidoService);
    create(dto: CreatePedidoDto, req: any): Promise<{
        usuario: {
            id: number;
            email: string;
            nome: string;
        };
        ingressos: ({
            sessao: {
                filme: {
                    id: number;
                    titulo: string;
                    generoId: number;
                    duracao: number;
                    classificacaoEtaria: import(".prisma/client").$Enums.ClassificacaoEtaria;
                };
                sala: {
                    id: number;
                    numero: string;
                    capacidade: number;
                };
            } & {
                id: number;
                filmeId: number;
                salaId: number;
                horarioInicio: Date;
                valorIngresso: number;
            };
        } & {
            id: number;
            sessaoId: number;
            tipo: string;
            valorPago: number;
            pedidoId: number | null;
        })[];
        lanches: ({
            lancheCombo: {
                id: number;
                nome: string;
                descricao: string | null;
                preco: number;
                itens: string;
            };
        } & {
            id: number;
            pedidoId: number;
            lancheComboId: number;
            quantidade: number;
        })[];
    } & {
        id: number;
        valorTotal: number;
        dataHora: Date;
        usuarioId: number;
    }>;
    findAll(): Promise<({
        usuario: {
            id: number;
            email: string;
            nome: string;
        };
        ingressos: ({
            sessao: {
                filme: {
                    id: number;
                    titulo: string;
                    generoId: number;
                    duracao: number;
                    classificacaoEtaria: import(".prisma/client").$Enums.ClassificacaoEtaria;
                };
                sala: {
                    id: number;
                    numero: string;
                    capacidade: number;
                };
            } & {
                id: number;
                filmeId: number;
                salaId: number;
                horarioInicio: Date;
                valorIngresso: number;
            };
        } & {
            id: number;
            sessaoId: number;
            tipo: string;
            valorPago: number;
            pedidoId: number | null;
        })[];
        lanches: ({
            lancheCombo: {
                id: number;
                nome: string;
                descricao: string | null;
                preco: number;
                itens: string;
            };
        } & {
            id: number;
            pedidoId: number;
            lancheComboId: number;
            quantidade: number;
        })[];
    } & {
        id: number;
        valorTotal: number;
        dataHora: Date;
        usuarioId: number;
    })[]>;
    findMyOrders(req: any): Promise<({
        ingressos: ({
            sessao: {
                filme: {
                    id: number;
                    titulo: string;
                    generoId: number;
                    duracao: number;
                    classificacaoEtaria: import(".prisma/client").$Enums.ClassificacaoEtaria;
                };
                sala: {
                    id: number;
                    numero: string;
                    capacidade: number;
                };
            } & {
                id: number;
                filmeId: number;
                salaId: number;
                horarioInicio: Date;
                valorIngresso: number;
            };
        } & {
            id: number;
            sessaoId: number;
            tipo: string;
            valorPago: number;
            pedidoId: number | null;
        })[];
        lanches: ({
            lancheCombo: {
                id: number;
                nome: string;
                descricao: string | null;
                preco: number;
                itens: string;
            };
        } & {
            id: number;
            pedidoId: number;
            lancheComboId: number;
            quantidade: number;
        })[];
    } & {
        id: number;
        valorTotal: number;
        dataHora: Date;
        usuarioId: number;
    })[]>;
    findOne(id: number): Promise<{
        usuario: {
            id: number;
            email: string;
            nome: string;
        };
        ingressos: ({
            sessao: {
                filme: {
                    id: number;
                    titulo: string;
                    generoId: number;
                    duracao: number;
                    classificacaoEtaria: import(".prisma/client").$Enums.ClassificacaoEtaria;
                };
                sala: {
                    id: number;
                    numero: string;
                    capacidade: number;
                };
            } & {
                id: number;
                filmeId: number;
                salaId: number;
                horarioInicio: Date;
                valorIngresso: number;
            };
        } & {
            id: number;
            sessaoId: number;
            tipo: string;
            valorPago: number;
            pedidoId: number | null;
        })[];
        lanches: ({
            lancheCombo: {
                id: number;
                nome: string;
                descricao: string | null;
                preco: number;
                itens: string;
            };
        } & {
            id: number;
            pedidoId: number;
            lancheComboId: number;
            quantidade: number;
        })[];
    } & {
        id: number;
        valorTotal: number;
        dataHora: Date;
        usuarioId: number;
    }>;
}
