import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';

@Injectable()
export class LancheComboService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLancheComboDto) {
    return this.prisma.lancheCombo.create({ data: dto });
  }

  async findAll() {
    return this.prisma.lancheCombo.findMany({ orderBy: { nome: 'asc' } });
  }

  async findOne(id: number) {
    const lanche = await this.prisma.lancheCombo.findUnique({ where: { id } });
    if (!lanche) throw new NotFoundException('Lanche/Combo não encontrado');
    return lanche;
  }

  async update(id: number, dto: UpdateLancheComboDto) {
    await this.findOne(id);
    return this.prisma.lancheCombo.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.lancheCombo.delete({ where: { id } });
  }
}
