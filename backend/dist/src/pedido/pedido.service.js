"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PedidoService = class PedidoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, usuarioId) {
        const { ingressos, lanches = [] } = dto;
        if (ingressos.length === 0 && lanches.length === 0) {
            throw new common_1.BadRequestException('O pedido deve conter pelo menos um ingresso ou lanche/combo');
        }
        let valorTotal = 0;
        const sessaoMap = new Map();
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
            throw new common_1.NotFoundException('Uma ou mais sessões não foram encontradas');
        }
        for (const sessao of sessoes) {
            const qtdSolicitada = sessaoMap.get(sessao.id) || 0;
            const lugaresDisponiveis = sessao.sala.capacidade - sessao._count.ingressos;
            if (qtdSolicitada > lugaresDisponiveis) {
                throw new common_1.BadRequestException(`Sala ${sessao.sala.numero} possui apenas ${lugaresDisponiveis} lugar(es) disponível(is) para esta sessão`);
            }
        }
        const ingressosData = ingressos.map((ing) => {
            const sessao = sessoes.find((s) => s.id === ing.sessaoId);
            const precoBase = sessao.valorIngresso;
            const valorPago = ing.tipo === 'Meia' ? precoBase / 2 : precoBase;
            valorTotal += valorPago;
            return {
                sessaoId: ing.sessaoId,
                tipo: ing.tipo,
                valorPago,
            };
        });
        if (lanches.length > 0) {
            const lancheIds = lanches.map((l) => l.lancheComboId);
            const lanchesDb = await this.prisma.lancheCombo.findMany({
                where: { id: { in: lancheIds } },
            });
            if (lanchesDb.length !== new Set(lancheIds).size) {
                throw new common_1.NotFoundException('Um ou mais lanches/combos não foram encontrados');
            }
            for (const item of lanches) {
                const lanche = lanchesDb.find((l) => l.id === item.lancheComboId);
                if (lanche) {
                    valorTotal += lanche.preco * item.quantidade;
                }
            }
        }
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
    async findOne(id) {
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
        if (!pedido)
            throw new common_1.NotFoundException('Pedido não encontrado');
        return pedido;
    }
    async findByUsuario(usuarioId) {
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
};
exports.PedidoService = PedidoService;
exports.PedidoService = PedidoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PedidoService);
//# sourceMappingURL=pedido.service.js.map