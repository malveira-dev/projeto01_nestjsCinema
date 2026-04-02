import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@Injectable()
export class GeneroService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGeneroDto) {
    const existing = await this.prisma.genero.findUnique({ where: { nome: dto.nome } });
    if (existing) {
      throw new ConflictException('Gênero já existe com este nome');
    }
    return this.prisma.genero.create({ data: dto });
  }

  async findAll() {
    return this.prisma.genero.findMany({ orderBy: { nome: 'asc' } });
  }

  async findOne(id: number) {
    const genero = await this.prisma.genero.findUnique({ where: { id } });
    if (!genero) throw new NotFoundException('Gênero não encontrado');
    return genero;
  }

  async update(id: number, dto: UpdateGeneroDto) {
    await this.findOne(id);
    if (dto.nome) {
      const existing = await this.prisma.genero.findFirst({
        where: { nome: dto.nome, NOT: { id } },
      });
      if (existing) throw new ConflictException('Gênero já existe com este nome');
    }
    return this.prisma.genero.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.genero.delete({ where: { id } });
  }
}
