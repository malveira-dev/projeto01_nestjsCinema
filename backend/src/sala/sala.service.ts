import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';

@Injectable()
export class SalaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSalaDto) {
    const existing = await this.prisma.sala.findUnique({ where: { numero: dto.numero } });
    if (existing) throw new ConflictException('Sala com este número já existe');
    return this.prisma.sala.create({ data: dto });
  }

  async findAll() {
    return this.prisma.sala.findMany({ orderBy: { numero: 'asc' } });
  }

  async findOne(id: number) {
    const sala = await this.prisma.sala.findUnique({ where: { id } });
    if (!sala) throw new NotFoundException('Sala não encontrada');
    return sala;
  }

  async update(id: number, dto: UpdateSalaDto) {
    await this.findOne(id);
    if (dto.numero) {
      const existing = await this.prisma.sala.findFirst({
        where: { numero: dto.numero, NOT: { id } },
      });
      if (existing) throw new ConflictException('Sala com este número já existe');
    }
    return this.prisma.sala.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sala.delete({ where: { id } });
  }
}
