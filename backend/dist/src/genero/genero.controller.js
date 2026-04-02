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
exports.GeneroController = void 0;
const common_1 = require("@nestjs/common");
const genero_service_1 = require("./genero.service");
const create_genero_dto_1 = require("./dto/create-genero.dto");
const update_genero_dto_1 = require("./dto/update-genero.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let GeneroController = class GeneroController {
    generoService;
    constructor(generoService) {
        this.generoService = generoService;
    }
    create(dto) {
        return this.generoService.create(dto);
    }
    findAll() {
        return this.generoService.findAll();
    }
    findOne(id) {
        return this.generoService.findOne(id);
    }
    update(id, dto) {
        return this.generoService.update(id, dto);
    }
    remove(id) {
        return this.generoService.remove(id);
    }
};
exports.GeneroController = GeneroController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_genero_dto_1.CreateGeneroDto]),
    __metadata("design:returntype", void 0)
], GeneroController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeneroController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GeneroController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_genero_dto_1.UpdateGeneroDto]),
    __metadata("design:returntype", void 0)
], GeneroController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GeneroController.prototype, "remove", null);
exports.GeneroController = GeneroController = __decorate([
    (0, common_1.Controller)('generos'),
    __metadata("design:paramtypes", [genero_service_1.GeneroService])
], GeneroController);
//# sourceMappingURL=genero.controller.js.map