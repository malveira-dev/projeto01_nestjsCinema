import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';

@Injectable()
export class SessaoService {
  constructor(private prisma: PrismaService) {}

  /**
   * REGRA DE NEGÓCIO 1: Validação de Sobreposição de Horários
   * Ao criar/atualizar uma sessão, o sistema garante que a sala NÃO possua
   * outra sessão com horários sobrepostos, considerando a duração do filme.
   */
  private async validateScheduleOverlap(
    salaId: number,
    filmeId: number,
    horarioInicio: Date,
    excludeSessaoId?: number,
  ) {
    // Buscar duração do filme da nova sessão
    const filme = await this.prisma.filme.findUnique({ where: { id: filmeId } });
    if (!filme) throw new NotFoundException('Filme não encontrado');

    const novoInicio = new Date(horarioInicio);
    const novoFim = new Date(novoInicio.getTime() + filme.duracao * 60 * 1000);

    // Buscar todas as sessões da mesma sala (excluindo a sessão atual em caso de update)
    const sessoesNaSala = await this.prisma.sessao.findMany({
      where: {
        salaId,
        ...(excludeSessaoId ? { NOT: { id: excludeSessaoId } } : {}),
      },
      include: { filme: true },
    });

    for (const sessaoExistente of sessoesNaSala) {
      const inicioExistente = new Date(sessaoExistente.horarioInicio);
      const fimExistente = new Date(
        inicioExistente.getTime() + sessaoExistente.filme.duracao * 60 * 1000,
      );

      // Verifica sobreposição: novoInicio < fimExistente AND novoFim > inicioExistente
      if (novoInicio < fimExistente && novoFim > inicioExistente) {
        throw new ConflictException(
          `Conflito de horário: a sala já possui sessão de "${sessaoExistente.filme.titulo}" ` +
          `das ${inicioExistente.toLocaleTimeString('pt-BR')} às ${fimExistente.toLocaleTimeString('pt-BR')}`,
        );
      }
    }
  }

  async create(dto: CreateSessaoDto) {
    // Validar que a sala existe
    const sala = await this.prisma.sala.findUnique({ where: { id: dto.salaId } });
    if (!sala) throw new NotFoundException('Sala não encontrada');

    // Validar sobreposição de horários (Regra de Negócio 1)
    await this.validateScheduleOverlap(dto.salaId, dto.filmeId, new Date(dto.horarioInicio));

    return this.prisma.sessao.create({
      data: {
        filmeId: dto.filmeId,
        salaId: dto.salaId,
        horarioInicio: new Date(dto.horarioInicio),
        valorIngresso: dto.valorIngresso,
      },
      include: { filme: { include: { genero: true } }, sala: true },
    });
  }

  async findAll() {
    return this.prisma.sessao.findMany({
      include: {
        filme: { include: { genero: true } },
        sala: true,
        _count: { select: { ingressos: true } },
      },
      orderBy: { horarioInicio: 'asc' },
    });
  }

  async findOne(id: number) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id },
      include: {
        filme: { include: { genero: true } },
        sala: true,
        _count: { select: { ingressos: true } },
      },
    });
    if (!sessao) throw new NotFoundException('Sessão não encontrada');
    return sessao;
  }

  async update(id: number, dto: UpdateSessaoDto) {
    const sessaoAtual = await this.findOne(id);

    const filmeId = dto.filmeId ?? sessaoAtual.filmeId;
    const salaId = dto.salaId ?? sessaoAtual.salaId;
    const horarioInicio = dto.horarioInicio
      ? new Date(dto.horarioInicio)
      : sessaoAtual.horarioInicio;

    // Validar sobreposição de horários (Regra de Negócio 1)
    await this.validateScheduleOverlap(salaId, filmeId, horarioInicio, id);

    return this.prisma.sessao.update({
      where: { id },
      data: {
        ...(dto.filmeId !== undefined && { filmeId: dto.filmeId }),
        ...(dto.salaId !== undefined && { salaId: dto.salaId }),
        ...(dto.horarioInicio !== undefined && { horarioInicio: new Date(dto.horarioInicio) }),
        ...(dto.valorIngresso !== undefined && { valorIngresso: dto.valorIngresso }),
      },
      include: { filme: { include: { genero: true } }, sala: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sessao.delete({ where: { id } });
  }
}
