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
exports.LancheComboService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LancheComboService = class LancheComboService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.lancheCombo.create({ data: dto });
    }
    async findAll() {
        return this.prisma.lancheCombo.findMany({ orderBy: { nome: 'asc' } });
    }
    async findOne(id) {
        const lanche = await this.prisma.lancheCombo.findUnique({ where: { id } });
        if (!lanche)
            throw new common_1.NotFoundException('Lanche/Combo não encontrado');
        return lanche;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.lancheCombo.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.lancheCombo.delete({ where: { id } });
    }
};
exports.LancheComboService = LancheComboService;
exports.LancheComboService = LancheComboService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LancheComboService);
//# sourceMappingURL=lanche-combo.service.js.map