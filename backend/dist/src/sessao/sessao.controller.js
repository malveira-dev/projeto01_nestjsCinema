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
exports.SessaoController = void 0;
const common_1 = require("@nestjs/common");
const sessao_service_1 = require("./sessao.service");
const create_sessao_dto_1 = require("./dto/create-sessao.dto");
const update_sessao_dto_1 = require("./dto/update-sessao.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SessaoController = class SessaoController {
    sessaoService;
    constructor(sessaoService) {
        this.sessaoService = sessaoService;
    }
    create(dto) {
        return this.sessaoService.create(dto);
    }
    findAll() {
        return this.sessaoService.findAll();
    }
    findOne(id) {
        return this.sessaoService.findOne(id);
    }
    update(id, dto) {
        return this.sessaoService.update(id, dto);
    }
    remove(id) {
        return this.sessaoService.remove(id);
    }
};
exports.SessaoController = SessaoController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sessao_dto_1.CreateSessaoDto]),
    __metadata("design:returntype", void 0)
], SessaoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SessaoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SessaoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_sessao_dto_1.UpdateSessaoDto]),
    __metadata("design:returntype", void 0)
], SessaoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SessaoController.prototype, "remove", null);
exports.SessaoController = SessaoController = __decorate([
    (0, common_1.Controller)('sessoes'),
    __metadata("design:paramtypes", [sessao_service_1.SessaoService])
], SessaoController);
//# sourceMappingURL=sessao.controller.js.map