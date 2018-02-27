"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ConsoleComponent = (function () {
    function ConsoleComponent(gameService) {
        this.gameService = gameService;
    }
    ConsoleComponent.prototype.ngOnInit = function () {
    };
    ConsoleComponent.prototype.zoomIn = function () {
        this.zoomFactor.zoomIn();
        this.gameService.fireEvent("REDRAW");
    };
    ConsoleComponent.prototype.zoomOut = function () {
        this.zoomFactor.zoomOut();
        this.gameService.fireEvent("REDRAW");
    };
    __decorate([
        core_1.Input()
    ], ConsoleComponent.prototype, "zoomFactor");
    __decorate([
        core_1.Input()
    ], ConsoleComponent.prototype, "focusedCell");
    ConsoleComponent = __decorate([
        core_1.Component({
            selector: 'console-component',
            templateUrl: './console.component.html',
            styleUrls: ['./console.component.scss']
        })
    ], ConsoleComponent);
    return ConsoleComponent;
}());
exports.ConsoleComponent = ConsoleComponent;
