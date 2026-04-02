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
exports.GeneroService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GeneroService = class GeneroService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.genero.findUnique({ where: { nome: dto.nome } });
        if (existing) {
            throw new common_1.ConflictException('Gênero já existe com este nome');
        }
        return this.prisma.genero.create({ data: dto });
    }
    async findAll() {
        return this.prisma.genero.findMany({ orderBy: { nome: 'asc' } });
    }
    async findOne(id) {
        const genero = await this.prisma.genero.findUnique({ where: { id } });
        if (!genero)
            throw new common_1.NotFoundException('Gênero não encontrado');
        return genero;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.nome) {
            const existing = await this.prisma.genero.findFirst({
                where: { nome: dto.nome, NOT: { id } },
            });
            if (existing)
                throw new common_1.ConflictException('Gênero já existe com este nome');
        }
        return this.prisma.genero.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.genero.delete({ where: { id } });
    }
};
exports.GeneroService = GeneroService;
exports.GeneroService = GeneroService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeneroService);
//# sourceMappingURL=genero.service.js.map