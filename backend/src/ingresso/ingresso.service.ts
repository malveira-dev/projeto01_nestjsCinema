import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';

@Injectable()
export class IngressoService {
  constructor(private prisma: PrismaService) {}

  /**
   * REGRA DE NEGÓCIO 2: Controle de Capacidade da Sala
   * A criação de ingresso só é permitida se o número de ingressos vendidos
   * for estritamente menor que a capacidade da Sala associada à Sessão.
   */
  async create(dto: CreateIngressoDto) {
    // Buscar a sessão com sala e contagem de ingressos
    const sessao = await this.prisma.sessao.findUnique({
      where: { id: dto.sessaoId },
      include: {
        sala: true,
        _count: { select: { ingressos: true } },
      },
    });

    if (!sessao) throw new NotFoundException('Sessão não encontrada');

    // Verificar capacidade da sala
    if (sessao._count.ingressos >= sessao.sala.capacidade) {
      throw new BadRequestException(
        `Capacidade da sala "${sessao.sala.numero}" esgotada. ` +
        `Capacidade: ${sessao.sala.capacidade}, Ingressos vendidos: ${sessao._count.ingressos}`,
      );
    }

    // Calcular valor pago baseado no tipo
    const valorPago = dto.tipo === 'Meia'
      ? sessao.valorIngresso * 0.5
      : sessao.valorIngresso;

    return this.prisma.ingresso.create({
      data: {
        sessaoId: dto.sessaoId,
        tipo: dto.tipo,
        valorPago,
      },
      include: {
        sessao: {
          include: {
            filme: true,
            sala: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.ingresso.findMany({
      include: {
        sessao: {
          include: { filme: true, sala: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: { id },
      include: {
        sessao: {
          include: { filme: true, sala: true },
        },
      },
    });
    if (!ingresso) throw new NotFoundException('Ingresso não encontrado');
    return ingresso;
  }

  async findBySessao(sessaoId: number) {
    return this.prisma.ingresso.findMany({
      where: { sessaoId },
      include: { sessao: { include: { filme: true, sala: true } } },
    });
  }

  async getAvailableSeats(sessaoId: number) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id: sessaoId },
      include: {
        sala: true,
        _count: { select: { ingressos: true } },
      },
    });
    if (!sessao) throw new NotFoundException('Sessão não encontrada');

    return {
      capacidade: sessao.sala.capacidade,
      vendidos: sessao._count.ingressos,
      disponiveis: sessao.sala.capacidade - sessao._count.ingressos,
    };
  }
}
