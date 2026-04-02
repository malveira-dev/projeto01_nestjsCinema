import { PrismaService } from '../prisma/prisma.service';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';
export declare class LancheComboService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateLancheComboDto): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        preco: number;
        itens: string;
    }>;
    findAll(): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        preco: number;
        itens: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        preco: number;
        itens: string;
    }>;
    update(id: number, dto: UpdateLancheComboDto): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        preco: number;
        itens: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
        preco: number;
        itens: string;
    }>;
}
