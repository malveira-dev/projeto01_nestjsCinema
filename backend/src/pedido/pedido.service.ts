import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(private prisma: PrismaService) {}

  /**
   * REGRA DE NEGÓCIO 3: Cálculo Automático do Valor Total
   * O sistema calcula automaticamente o valorTotal do pedido somando
   * os preços de todos os itens (ingressos e lanches/combos) inclusos.
   */
  async create(dto: CreatePedidoDto, usuarioId: number) {
    const { ingressoIds = [], lancheItems = [] } = dto;

    if (ingressoIds.length === 0 && lancheItems.length === 0) {
      throw new BadRequestException('O pedido deve conter pelo menos um ingresso ou lanche/combo');
    }

    let valorTotal = 0;

    // Calcular valor dos ingressos
    if (ingressoIds.length > 0) {
      const ingressos = await this.prisma.ingresso.findMany({
        where: { id: { in: ingressoIds } },
      });

      if (ingressos.length !== ingressoIds.length) {
        throw new NotFoundException('Um ou mais ingressos não foram encontrados');
      }

      // Verificar se algum ingresso já está associado a outro pedido
      const ingressosComPedido = ingressos.filter((i) => i.pedidoId !== null);
      if (ingressosComPedido.length > 0) {
        throw new BadRequestException(
          `Os ingressos ${ingressosComPedido.map((i) => i.id).join(', ')} já estão associados a outro pedido`,
        );
      }

      valorTotal += ingressos.reduce((sum, i) => sum + i.valorPago, 0);
    }

    // Calcular valor dos lanches/combos
    if (lancheItems.length > 0) {
      const lancheIds = lancheItems.map((l) => l.lancheComboId);
      const lanches = await this.prisma.lancheCombo.findMany({
        where: { id: { in: lancheIds } },
      });

      if (lanches.length !== new Set(lancheIds).size) {
        throw new NotFoundException('Um ou mais lanches/combos não foram encontrados');
      }

      for (const item of lancheItems) {
        const lanche = lanches.find((l) => l.id === item.lancheComboId);
        if (lanche) {
          valorTotal += lanche.preco * item.quantidade;
        }
      }
    }

    // Criar pedido com valorTotal calculado automaticamente
    const pedido = await this.prisma.pedido.create({
      data: {
        usuarioId,
        valorTotal,
        ingressos: {
          connect: ingressoIds.map((id) => ({ id })),
        },
        lanches: {
          create: lancheItems.map((item) => ({
            lancheComboId: item.lancheComboId,
            quantidade: item.quantidade,
          })),
        },
      },
      include: {
        ingressos: {
          include: {
            sessao: { include: { filme: true, sala: true } },
          },
        },
        lanches: {
          include: { lancheCombo: true },
        },
        usuario: {
          select: { id: true, nome: true, email: true },
        },
      },
    });

    return pedido;
  }

  async findAll() {
    return this.prisma.pedido.findMany({
      include: {
        ingressos: {
          include: { sessao: { include: { filme: true, sala: true } } },
        },
        lanches: { include: { lancheCombo: true } },
        usuario: { select: { id: true, nome: true, email: true } },
      },
      orderBy: { dataHora: 'desc' },
    });
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        ingressos: {
          include: { sessao: { include: { filme: true, sala: true } } },
        },
        lanches: { include: { lancheCombo: true } },
        usuario: { select: { id: true, nome: true, email: true } },
      },
    });
    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    return pedido;
  }

  async findByUsuario(usuarioId: number) {
    return this.prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        ingressos: {
          include: { sessao: { include: { filme: true, sala: true } } },
        },
        lanches: { include: { lancheCombo: true } },
      },
      orderBy: { dataHora: 'desc' },
    });
  }
}
