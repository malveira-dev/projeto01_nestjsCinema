"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LancheComboModule = void 0;
const common_1 = require("@nestjs/common");
const lanche_combo_service_1 = require("./lanche-combo.service");
const lanche_combo_controller_1 = require("./lanche-combo.controller");
let LancheComboModule = class LancheComboModule {
};
exports.LancheComboModule = LancheComboModule;
exports.LancheComboModule = LancheComboModule = __decorate([
    (0, common_1.Module)({
        controllers: [lanche_combo_controller_1.LancheComboController],
        providers: [lanche_combo_service_1.LancheComboService],
    })
], LancheComboModule);
//# sourceMappingURL=lanche-combo.module.js.map