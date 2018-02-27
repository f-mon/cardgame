"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var CellComponent = (function () {
    function CellComponent(gameService, element) {
        this.gameService = gameService;
        this.element = element;
        this.focusRequest = new core_1.EventEmitter();
    }
    CellComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.drawCell();
        this.eventsSubs = this.gameService.events.subscribe(function (ev) {
            if (ev === "REDRAW") {
                _this.drawCell();
            }
        });
    };
    CellComponent.prototype.ngOnDestroy = function () {
        if (this.eventsSubs) {
            this.eventsSubs.unsubscribe();
        }
    };
    CellComponent.prototype.onCellClick = function ($event) {
        this.focusRequest.next(this.cell);
    };
    Object.defineProperty(CellComponent.prototype, "terrainTypeClass", {
        get: function () {
            return this.cell.terrainType;
        },
        enumerable: true,
        configurable: true
    });
    CellComponent.prototype.drawCell = function () {
        var element = this.element.nativeElement;
        element.style.top = this.cell.getCoordTopLeftY(this.zoomFactor) + "px";
        element.style.left = this.cell.getCoordTopLeftX(this.zoomFactor) + "px";
        element.style.width = this.zoomFactor.cellWidth + "px";
        element.style.height = this.zoomFactor.cellHeight + "px";
        this.hexWidth = this.zoomFactor.cellWidth;
        this.hexHeight = this.zoomFactor.cellHeight;
        this.hexPoints = this.zoomFactor.getHexPoints();
        this.hexClipPath = this.zoomFactor.getHexClipPath();
    };
    __decorate([
        core_1.Input()
    ], CellComponent.prototype, "zoomFactor");
    __decorate([
        core_1.Input()
    ], CellComponent.prototype, "cell");
    __decorate([
        core_1.HostBinding('class.selected'),
        core_1.Input()
    ], CellComponent.prototype, "selected");
    __decorate([
        core_1.HostBinding('class.focused'),
        core_1.Input()
    ], CellComponent.prototype, "focused");
    __decorate([
        core_1.Output()
    ], CellComponent.prototype, "focusRequest");
    CellComponent = __decorate([
        core_1.Component({
            selector: 'cell-component',
            templateUrl: './cell.component.html',
            styleUrls: ['./cell.component.scss']
        })
    ], CellComponent);
    return CellComponent;
}());
exports.CellComponent = CellComponent;
