"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var FontChangesService = /** @class */ (function () {
    function FontChangesService() {
        this.fontSource = new rxjs_1.BehaviorSubject('default font');
        this.columnSource = new rxjs_1.BehaviorSubject('default column');
        this.currentFont = this.fontSource.asObservable();
        this.currentColumn = this.columnSource.asObservable();
    }
    FontChangesService.prototype.changeFont = function (font, column) {
        this.columnSource.next(column);
        this.fontSource.next(font);
    };
    FontChangesService = __decorate([
        core_1.Injectable()
    ], FontChangesService);
    return FontChangesService;
}());
exports.FontChangesService = FontChangesService;
//# sourceMappingURL=font-changes.service.js.map