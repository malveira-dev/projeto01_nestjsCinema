import { PrismaService } from '../prisma/prisma.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
export declare class IngressoService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateIngressoDto): Promise<{
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
    }>;
    findAll(): Promise<({
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
    })[]>;
    findOne(id: number): Promise<{
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
    }>;
    findBySessao(sessaoId: number): Promise<({
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
    })[]>;
    getAvailableSeats(sessaoId: number): Promise<{
        capacidade: number;
        vendidos: number;
        disponiveis: number;
    }>;
}
