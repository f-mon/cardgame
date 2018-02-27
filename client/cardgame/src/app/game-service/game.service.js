"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Rx = require('rxjs/Rx');
require("rxjs/add/operator/map");
require("rxjs/add/operator/debounceTime");
var core_1 = require('@angular/core');
var cardgame_model_1 = require('../models/cardgame.model');
var GameService = (function () {
    function GameService(http) {
        var _this = this;
        this.http = http;
        this._events = new Rx.Subject();
        this.url = "https://cardgame-f-mon.c9users.io";
        this.wsUrl = "wss://cardgame-f-mon.c9users.io/";
        var socket = new WebSocket(this.wsUrl);
        // Connection opened
        socket.addEventListener('open', function (event) {
            socket.send('Hello Server!');
        });
        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
            _this.propagateServerMessageEvent(event.data);
        });
        setInterval(function () {
            _this.fireEvent({
                name: 'CENTER_BOARD',
                cellX: Math.floor((Math.random() * 100)),
                cellY: Math.floor((Math.random() * 100))
            });
        }, 3000);
    }
    GameService.prototype.retrieveBoardModel = function () {
        return this.http.post(this.url + "/gameBoard", { moo: "foo", goo: "loo" })
            .map(function (res) {
            var jsonObj = res.json();
            console.log(jsonObj);
            return cardgame_model_1.BoardModel.createBoardModel(jsonObj);
        });
        /*
        return Rx.Observable.create(function(observer) {
            let board = BoardModel.createBoardModel(1000,1000);
            observer.next(board);
        });
        */
    };
    Object.defineProperty(GameService.prototype, "events", {
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });
    GameService.prototype.fireEvent = function (event) {
        this._events.next(event);
    };
    GameService.prototype.onEvent = function (evenType) {
        return this._events.filter(function (ev) {
            return ev instanceof evenType;
        });
    };
    GameService.prototype.onEventWithName = function (eventName) {
        return this._events.filter(function (ev) {
            return ev.name === eventName;
        });
    };
    GameService.prototype.onServerMsgEvent = function (eventName) {
        return this._events.filter(function (ev) {
            return ev.serverMsgEvent && (!eventName || eventName === ev.name);
        });
    };
    GameService.prototype.propagateServerMessageEvent = function (eventJson) {
        var event = JSON.parse(eventJson);
        var servMsgEvt = Object.assign({
            serverMsgEvent: true
        }, event);
        this.fireEvent(servMsgEvt);
    };
    GameService = __decorate([
        core_1.Injectable()
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
