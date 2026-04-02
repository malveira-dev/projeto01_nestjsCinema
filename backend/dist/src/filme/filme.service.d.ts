import { PrismaService } from '../prisma/prisma.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
export declare class FilmeService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFilmeDto): Promise<{
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
    }>;
    findAll(): Promise<({
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
    })[]>;
    findOne(id: number): Promise<{
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
    }>;
    update(id: number, dto: UpdateFilmeDto): Promise<{
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
    }>;
    remove(id: number): Promise<{
        id: number;
        titulo: string;
        generoId: number;
        duracao: number;
        classificacaoEtaria: import(".prisma/client").$Enums.ClassificacaoEtaria;
    }>;
}
