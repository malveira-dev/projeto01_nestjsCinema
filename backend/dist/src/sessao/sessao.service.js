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
exports.SessaoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SessaoService = class SessaoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateScheduleOverlap(salaId, filmeId, horarioInicio, excludeSessaoId) {
        const filme = await this.prisma.filme.findUnique({ where: { id: filmeId } });
        if (!filme)
            throw new common_1.NotFoundException('Filme não encontrado');
        const novoInicio = new Date(horarioInicio);
        const novoFim = new Date(novoInicio.getTime() + filme.duracao * 60 * 1000);
        const sessoesNaSala = await this.prisma.sessao.findMany({
            where: {
                salaId,
                ...(excludeSessaoId ? { NOT: { id: excludeSessaoId } } : {}),
            },
            include: { filme: true },
        });
        for (const sessaoExistente of sessoesNaSala) {
            const inicioExistente = new Date(sessaoExistente.horarioInicio);
            const fimExistente = new Date(inicioExistente.getTime() + sessaoExistente.filme.duracao * 60 * 1000);
            if (novoInicio < fimExistente && novoFim > inicioExistente) {
                throw new common_1.ConflictException(`Conflito de horário: a sala já possui sessão de "${sessaoExistente.filme.titulo}" ` +
                    `das ${inicioExistente.toLocaleTimeString('pt-BR')} às ${fimExistente.toLocaleTimeString('pt-BR')}`);
            }
        }
    }
    async create(dto) {
        const sala = await this.prisma.sala.findUnique({ where: { id: dto.salaId } });
        if (!sala)
            throw new common_1.NotFoundException('Sala não encontrada');
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
    async findOne(id) {
        const sessao = await this.prisma.sessao.findUnique({
            where: { id },
            include: {
                filme: { include: { genero: true } },
                sala: true,
                _count: { select: { ingressos: true } },
            },
        });
        if (!sessao)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return sessao;
    }
    async update(id, dto) {
        const sessaoAtual = await this.findOne(id);
        const filmeId = dto.filmeId ?? sessaoAtual.filmeId;
        const salaId = dto.salaId ?? sessaoAtual.salaId;
        const horarioInicio = dto.horarioInicio
            ? new Date(dto.horarioInicio)
            : sessaoAtual.horarioInicio;
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.sessao.delete({ where: { id } });
    }
};
exports.SessaoService = SessaoService;
exports.SessaoService = SessaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessaoService);
//# sourceMappingURL=sessao.service.js.map