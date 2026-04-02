"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngressoModule = void 0;
const common_1 = require("@nestjs/common");
const ingresso_service_1 = require("./ingresso.service");
const ingresso_controller_1 = require("./ingresso.controller");
let IngressoModule = class IngressoModule {
};
exports.IngressoModule = IngressoModule;
exports.IngressoModule = IngressoModule = __decorate([
    (0, common_1.Module)({
        controllers: [ingresso_controller_1.IngressoController],
        providers: [ingresso_service_1.IngressoService],
    })
], IngressoModule);
//# sourceMappingURL=ingresso.module.js.map