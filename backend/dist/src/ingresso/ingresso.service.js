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
exports.IngressoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IngressoService = class IngressoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const sessao = await this.prisma.sessao.findUnique({
            where: { id: dto.sessaoId },
            include: {
                sala: true,
                _count: { select: { ingressos: true } },
            },
        });
        if (!sessao)
            throw new common_1.NotFoundException('Sessão não encontrada');
        if (sessao._count.ingressos >= sessao.sala.capacidade) {
            throw new common_1.BadRequestException(`Capacidade da sala "${sessao.sala.numero}" esgotada. ` +
                `Capacidade: ${sessao.sala.capacidade}, Ingressos vendidos: ${sessao._count.ingressos}`);
        }
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
    async findOne(id) {
        const ingresso = await this.prisma.ingresso.findUnique({
            where: { id },
            include: {
                sessao: {
                    include: { filme: true, sala: true },
                },
            },
        });
        if (!ingresso)
            throw new common_1.NotFoundException('Ingresso não encontrado');
        return ingresso;
    }
    async findBySessao(sessaoId) {
        return this.prisma.ingresso.findMany({
            where: { sessaoId },
            include: { sessao: { include: { filme: true, sala: true } } },
        });
    }
    async getAvailableSeats(sessaoId) {
        const sessao = await this.prisma.sessao.findUnique({
            where: { id: sessaoId },
            include: {
                sala: true,
                _count: { select: { ingressos: true } },
            },
        });
        if (!sessao)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return {
            capacidade: sessao.sala.capacidade,
            vendidos: sessao._count.ingressos,
            disponiveis: sessao.sala.capacidade - sessao._count.ingressos,
        };
    }
};
exports.IngressoService = IngressoService;
exports.IngressoService = IngressoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IngressoService);
//# sourceMappingURL=ingresso.service.js.map