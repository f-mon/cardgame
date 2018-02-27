"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
require("rxjs/add/operator/map");
require("rxjs/add/operator/debounceTime");
var core_1 = require('@angular/core');
var CardEditorComponent = (function () {
    function CardEditorComponent(ngZone, element, router, cardsService) {
        this.ngZone = ngZone;
        this.element = element;
        this.router = router;
        this.cardsService = cardsService;
    }
    CardEditorComponent.prototype.ngOnInit = function () {
        this.editItem = {};
    };
    CardEditorComponent.prototype.onConfirm = function () {
        var _this = this;
        this.cardsService.saveCardsDefinition(this.editItem)
            .subscribe(function (saved) {
            _this.editItem = saved;
            alert("Saved");
        });
    };
    CardEditorComponent = __decorate([
        core_1.Component({
            selector: 'card-editor',
            templateUrl: './card-editor.component.html',
            styleUrls: ['./card-editor.component.scss']
        })
    ], CardEditorComponent);
    return CardEditorComponent;
}());
exports.CardEditorComponent = CardEditorComponent;
