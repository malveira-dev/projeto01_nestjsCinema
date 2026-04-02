import { PrismaService } from '../prisma/prisma.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
export declare class GeneroService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateGeneroDto): Promise<{
        id: number;
        nome: string;
    }>;
    findAll(): Promise<{
        id: number;
        nome: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        nome: string;
    }>;
    update(id: number, dto: UpdateGeneroDto): Promise<{
        id: number;
        nome: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        nome: string;
    }>;
}
