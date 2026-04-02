import { PrismaService } from '../prisma/prisma.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
export declare class SalaService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSalaDto): Promise<{
        id: number;
        numero: string;
        capacidade: number;
    }>;
    findAll(): Promise<{
        id: number;
        numero: string;
        capacidade: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        numero: string;
        capacidade: number;
    }>;
    update(id: number, dto: UpdateSalaDto): Promise<{
        id: number;
        numero: string;
        capacidade: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        numero: string;
        capacidade: number;
    }>;
}
