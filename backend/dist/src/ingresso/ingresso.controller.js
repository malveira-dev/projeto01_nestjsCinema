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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngressoController = void 0;
const common_1 = require("@nestjs/common");
const ingresso_service_1 = require("./ingresso.service");
const create_ingresso_dto_1 = require("./dto/create-ingresso.dto");
let IngressoController = class IngressoController {
    ingressoService;
    constructor(ingressoService) {
        this.ingressoService = ingressoService;
    }
    create(dto) {
        return this.ingressoService.create(dto);
    }
    findAll() {
        return this.ingressoService.findAll();
    }
    findOne(id) {
        return this.ingressoService.findOne(id);
    }
    findBySessao(sessaoId) {
        return this.ingressoService.findBySessao(sessaoId);
    }
    getAvailableSeats(sessaoId) {
        return this.ingressoService.getAvailableSeats(sessaoId);
    }
};
exports.IngressoController = IngressoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ingresso_dto_1.CreateIngressoDto]),
    __metadata("design:returntype", void 0)
], IngressoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IngressoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngressoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('sessao/:sessaoId'),
    __param(0, (0, common_1.Param)('sessaoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngressoController.prototype, "findBySessao", null);
__decorate([
    (0, common_1.Get)('sessao/:sessaoId/disponibilidade'),
    __param(0, (0, common_1.Param)('sessaoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngressoController.prototype, "getAvailableSeats", null);
exports.IngressoController = IngressoController = __decorate([
    (0, common_1.Controller)('ingressos'),
    __metadata("design:paramtypes", [ingresso_service_1.IngressoService])
], IngressoController);
//# sourceMappingURL=ingresso.controller.js.map