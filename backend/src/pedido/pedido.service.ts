import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(private prisma: PrismaService) {}

  /**
   * REGRA DE NEGÓCIO 2: Validação de Capacidade da Sala
   * O sistema verifica se a sala ainda possui lugares disponíveis antes de vender ingressos.
   *
   * REGRA DE NEGÓCIO 3: Cálculo Automático do Valor Total
   * O sistema calcula automaticamente o valorTotal do pedido somando
   * os preços de todos os itens (ingressos e lanches/combos) inclusos.
   * Meia-entrada recebe 50% de desconto.
   */
  async create(dto: CreatePedidoDto, usuarioId: number) {
    const { ingressos, lanches = [] } = dto;

    if (ingressos.length === 0 && lanches.length === 0) {
      throw new BadRequestException('O pedido deve conter pelo menos um ingresso ou lanche/combo');
    }

    let valorTotal = 0;

    // ─── Validar e calcular ingressos ───
    // Agrupar ingressos por sessão para validação de capacidade
    const sessaoMap = new Map<number, number>();
    for (const ing of ingressos) {
      sessaoMap.set(ing.sessaoId, (sessaoMap.get(ing.sessaoId) || 0) + 1);
    }

    const sessaoIds = [...sessaoMap.keys()];
    const sessoes = await this.prisma.sessao.findMany({
      where: { id: { in: sessaoIds } },
      include: {
        sala: true,
        _count: { select: { ingressos: true } },
      },
    });

    if (sessoes.length !== sessaoIds.length) {
      throw new NotFoundException('Uma ou mais sessões não foram encontradas');
    }

    // Regra 2: Validar capacidade para cada sessão
    for (const sessao of sessoes) {
      const qtdSolicitada = sessaoMap.get(sessao.id) || 0;
      const lugaresDisponiveis = sessao.sala.capacidade - sessao._count.ingressos;
      if (qtdSolicitada > lugaresDisponiveis) {
        throw new BadRequestException(
          `Sala ${sessao.sala.numero} possui apenas ${lugaresDisponiveis} lugar(es) disponível(is) para esta sessão`,
        );
      }
    }

    // Calcular valor de cada ingresso
    const ingressosData = ingressos.map((ing) => {
      const sessao = sessoes.find((s) => s.id === ing.sessaoId)!;
      const precoBase = sessao.valorIngresso;
      const valorPago = ing.tipo === 'Meia' ? precoBase / 2 : precoBase;
      valorTotal += valorPago;
      return {
        sessaoId: ing.sessaoId,
        tipo: ing.tipo,
        valorPago,
      };
    });

    // ─── Calcular valor dos lanches/combos ───
    if (lanches.length > 0) {
      const lancheIds = lanches.map((l) => l.lancheComboId);
      const lanchesDb = await this.prisma.lancheCombo.findMany({
        where: { id: { in: lancheIds } },
      });

      if (lanchesDb.length !== new Set(lancheIds).size) {
        throw new NotFoundException('Um ou mais lanches/combos não foram encontrados');
      }

      for (const item of lanches) {
        const lanche = lanchesDb.find((l) => l.id === item.lancheComboId);
        if (lanche) {
          valorTotal += lanche.preco * item.quantidade;
        }
      }
    }

    // Criar pedido com ingressos e lanches em uma transação
    const pedido = await this.prisma.pedido.create({
      data: {
        usuarioId,
        valorTotal,
        ingressos: {
          create: ingressosData,
        },
        lanches: {
          create: lanches.map((item) => ({
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
