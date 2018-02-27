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
var CardsComponent = (function () {
    function CardsComponent(ngZone, element, router, cardsService) {
        this.ngZone = ngZone;
        this.element = element;
        this.router = router;
        this.cardsService = cardsService;
        this.showCards = [];
    }
    CardsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.retrieveSub = this.cardsService.retrieveCardsDefinitions().subscribe(function (cards) {
            _this.showCards = cards;
        });
    };
    CardsComponent.prototype.ngOnDestroy = function () {
        if (this.retrieveSub) {
            this.retrieveSub.unsubscribe();
        }
    };
    CardsComponent.prototype.onAddCard = function () {
        this.router.navigate(['/cardEditor']);
    };
    CardsComponent = __decorate([
        core_1.Component({
            selector: 'cards',
            templateUrl: './cards.component.html',
            styleUrls: ['./cards.component.scss']
        })
    ], CardsComponent);
    return CardsComponent;
}());
exports.CardsComponent = CardsComponent;
