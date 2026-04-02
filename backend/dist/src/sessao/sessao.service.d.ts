import { PrismaService } from '../prisma/prisma.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
export declare class SessaoService {
    private prisma;
    constructor(prisma: PrismaService);
    private validateScheduleOverlap;
    create(dto: CreateSessaoDto): Promise<{
        filme: {
            genero: {
                id: number;
                nome: string;
            };
        } & {
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
    }>;
    findAll(): Promise<({
        filme: {
            genero: {
                id: number;
                nome: string;
            };
        } & {
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
        _count: {
            ingressos: number;
        };
    } & {
        id: number;
        filmeId: number;
        salaId: number;
        horarioInicio: Date;
        valorIngresso: number;
    })[]>;
    findOne(id: number): Promise<{
        filme: {
            genero: {
                id: number;
                nome: string;
            };
        } & {
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
        _count: {
            ingressos: number;
        };
    } & {
        id: number;
        filmeId: number;
        salaId: number;
        horarioInicio: Date;
        valorIngresso: number;
    }>;
    update(id: number, dto: UpdateSessaoDto): Promise<{
        filme: {
            genero: {
                id: number;
                nome: string;
            };
        } & {
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
    }>;
    remove(id: number): Promise<{
        id: number;
        filmeId: number;
        salaId: number;
        horarioInicio: Date;
        valorIngresso: number;
    }>;
}
