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
var cardgame_model_1 = require('../models/cardgame.model');
var GameBoardComponent = (function () {
    function GameBoardComponent(gameService, ngZone, element, scrollDispatcher) {
        this.gameService = gameService;
        this.ngZone = ngZone;
        this.element = element;
        this.scrollDispatcher = scrollDispatcher;
        this.zoomFactor = new cardgame_model_1.ZoomFactor();
        this.renderedCells = [];
        this.selectedCells = {};
    }
    GameBoardComponent.prototype.onResize = function () {
        if (this.board) {
            this.updateRenderedCells();
        }
    };
    GameBoardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.boardScroller = new GameBoardScroller(this.cellViewport.nativeElement);
        this.scrollSub = this.scrollDispatcher.scrolled().debounceTime(50).subscribe(function (scrollable) {
            if (!_this.board) {
                return;
            }
            _this.ngZone.run(function () {
                _this.updateRenderedCells();
            });
        });
        this.retrieveSub = this.gameService.retrieveBoardModel().subscribe(function (boardModel) {
            _this.board = boardModel;
            _this.recalcCellSpace();
        });
        this.gameEventsSub = this.gameService.events.subscribe(function (ev) {
            if (!_this.board) {
                return;
            }
            if (ev === "REDRAW") {
                _this.recalcCellSpace();
            }
            if (ev && ev.name === "CENTER_BOARD") {
                _this.centerBoardOnCell(ev.cellX, ev.cellY);
            }
        });
    };
    GameBoardComponent.prototype.ngOnDestroy = function () {
        if (this.retrieveSub) {
            this.retrieveSub.unsubscribe();
        }
        if (this.gameEventsSub) {
            this.gameEventsSub.unsubscribe();
        }
        if (this.scrollSub) {
            this.scrollSub.unsubscribe();
        }
    };
    GameBoardComponent.prototype.getFocusedCell = function () {
        return this.focusedCell;
    };
    GameBoardComponent.prototype.onCellFocusRequest = function (cell) {
        if (cell && !this.isFocusedCell(cell)) {
            this.focusedCell = cell;
        }
        else {
            this.focusedCell = null;
        }
        if (cell && !this.isSelectedCell(cell)) {
            this.selectedCells[cell.id] = cell;
        }
        else {
            this.selectedCells[cell.id] = null;
        }
    };
    GameBoardComponent.prototype.isFocusedCell = function (cell) {
        return this.focusedCell === cell;
    };
    GameBoardComponent.prototype.isSelectedCell = function (cell) {
        return !!this.selectedCells[cell.id];
    };
    GameBoardComponent.prototype.centerBoardOnCell = function (cellX, cellY) {
        var cell = this.board.getCell(cellX, cellY);
        this.boardScroller.smoothScrollTo(cell.getCoordCenterX(this.zoomFactor), cell.getCoordCenterY(this.zoomFactor));
        this.onCellFocusRequest(cell);
    };
    GameBoardComponent.prototype.recalcCellSpace = function () {
        this.cellSpaceWidth = (this.board.columns.length * this.zoomFactor.cellWidth);
        this.cellSpaceHeight = (this.board.rows.length * this.zoomFactor.cellHeightPartial);
        this.cellSpace.nativeElement.style.width = this.cellSpaceWidth + "px";
        this.cellSpace.nativeElement.style.height = this.cellSpaceHeight + "px";
        this.updateRenderedCells();
    };
    GameBoardComponent.prototype.updateRenderedCells = function () {
        var visibleCells = this.caclRenderedCells();
        this.renderedCells.splice(0, this.renderedCells.length);
        Array.prototype.push.apply(this.renderedCells, visibleCells);
        /*
        visibleCells.forEach((cell)=>{
          let index = this.renderedCells.indexOf(cell);
          if (index<0) {
            this.renderedCells.push(cell);
          }
        });
        this.renderedCells.forEach((cell,cellIdx)=>{
          let index = visibleCells.indexOf(cell);
          if (index<0) {
            this.renderedCells.splice(cellIdx,1);
          }
        });
        */
    };
    GameBoardComponent.prototype.caclRenderedCells = function () {
        var viewPort = this.cellViewport.nativeElement;
        var left = Math.max(0, viewPort.scrollLeft - this.zoomFactor.cellWidth / 2);
        var top = Math.max(0, viewPort.scrollTop - this.zoomFactor.cellWidth / 2);
        var width = viewPort.offsetWidth;
        var height = viewPort.offsetHeight;
        var firstX = Math.floor(left / this.zoomFactor.cellWidth);
        var lastX = firstX + Math.ceil(width / this.zoomFactor.cellWidth);
        var firstY = Math.floor(top / this.zoomFactor.cellHeightPartial);
        var lastY = firstY + Math.ceil(height / this.zoomFactor.cellHeightPartial);
        var renderedCells = this.board.sliceView(firstX, lastX, firstY, lastY);
        return renderedCells;
    };
    __decorate([
        core_1.ViewChild("cellViewport")
    ], GameBoardComponent.prototype, "cellViewport");
    __decorate([
        core_1.ViewChild("cellSpace")
    ], GameBoardComponent.prototype, "cellSpace");
    __decorate([
        core_1.ViewChild("renderedPane")
    ], GameBoardComponent.prototype, "renderedPane");
    __decorate([
        core_1.HostListener('window:resize')
    ], GameBoardComponent.prototype, "onResize");
    GameBoardComponent = __decorate([
        core_1.Component({
            selector: 'game-board',
            templateUrl: './game-board.component.html',
            styleUrls: ['./game-board.component.scss']
        })
    ], GameBoardComponent);
    return GameBoardComponent;
}());
exports.GameBoardComponent = GameBoardComponent;
var GameBoardScroller = (function () {
    function GameBoardScroller(element) {
        this.element = element;
        this.cycle = 0;
    }
    GameBoardScroller.prototype.smoothScrollTo = function (xPos, yPos) {
        var viewPortWidth = this.element.offsetWidth;
        var viewPortHeight = this.element.offsetHeight;
        this.targetX = Math.max(0, xPos - (viewPortWidth / 2));
        this.targetY = Math.max(0, yPos - (viewPortHeight / 2));
        this.cycle = 0;
        this.checkScroll();
    };
    GameBoardScroller.prototype.checkScroll = function () {
        var _this = this;
        if (this.pending) {
            clearTimeout(this.pending);
            this.pending = null;
        }
        this.pending = setTimeout(function () {
            _this.cycle++;
            /*
            if (this.cycle===1) {
              console.log("Scroll Start ",this.element.scrollLeft," ---> ",this.targetX);
              console.log("Scroll Start ",this.element.scrollTop," ---> ",this.targetY);
            }
            */
            if (_this.element.scrollLeft !== _this.targetX) {
                var distance = _this.targetX - _this.element.scrollLeft;
                var step = Math.abs(distance) > 10 ? (distance / 10) : distance;
                _this.element.scrollLeft = _this.element.scrollLeft + step;
            }
            if (_this.element.scrollTop !== _this.targetY) {
                var distance = _this.targetY - _this.element.scrollTop;
                var step = Math.abs(distance) > 10 ? (distance / 10) : distance;
                _this.element.scrollTop = _this.element.scrollTop + step;
            }
            var checkX = Math.abs(_this.targetX - _this.element.scrollLeft);
            var checkY = Math.abs(_this.targetY - _this.element.scrollTop);
            if (checkX > 1 || checkY > 1) {
                _this.checkScroll();
            }
            else {
                console.log("Scrolled End At: ", _this.cycle);
            }
        }, 5);
    };
    return GameBoardScroller;
}());
exports.GameBoardScroller = GameBoardScroller;
