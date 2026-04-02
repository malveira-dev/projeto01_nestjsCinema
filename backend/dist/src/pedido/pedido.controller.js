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
exports.PedidoController = void 0;
const common_1 = require("@nestjs/common");
const pedido_service_1 = require("./pedido.service");
const create_pedido_dto_1 = require("./dto/create-pedido.dto");
let PedidoController = class PedidoController {
    pedidoService;
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    create(dto, req) {
        return this.pedidoService.create(dto, req.user.id);
    }
    findAll() {
        return this.pedidoService.findAll();
    }
    findMyOrders(req) {
        return this.pedidoService.findByUsuario(req.user.id);
    }
    findOne(id) {
        return this.pedidoService.findOne(id);
    }
};
exports.PedidoController = PedidoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pedido_dto_1.CreatePedidoDto, Object]),
    __metadata("design:returntype", void 0)
], PedidoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PedidoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('meus'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PedidoController.prototype, "findMyOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PedidoController.prototype, "findOne", null);
exports.PedidoController = PedidoController = __decorate([
    (0, common_1.Controller)('pedidos'),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], PedidoController);
//# sourceMappingURL=pedido.controller.js.map