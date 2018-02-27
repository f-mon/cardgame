"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var scrolling_1 = require('@angular/cdk/scrolling');
var forms_1 = require('@angular/forms');
var lib_material_module_1 = require('./lib-material.module');
var module_1 = require();
var auth_1 = require('./auth/auth');
var game_service_1 = require('./game-service/game.service');
var cards_service_1 = require('./cards-service/cards.service');
var login_component_1 = require('./auth/login/login.component');
var game_board_component_1 = require('./game-board/game-board.component');
var cell_component_1 = require('./cell/cell.component');
var console_component_1 = require('./console/console.component');
var game_docs_component_1 = require('./game-docs/game-docs.component');
var cards_component_1 = require('./cards/cards.component');
var card_editor_component_1 = require('./card-editor/card-editor.component');
var routes = [
    {
        path: '',
        redirectTo: '/rules',
        pathMatch: 'full'
    }, {
        path: 'rules',
        component: game_docs_component_1.GameDocsComponent
    }, {
        path: 'login',
        component: login_component_1.LoginComponent
    }, {
        path: 'board',
        component: game_board_component_1.GameBoardComponent,
        canActivate: [auth_1.AuthGuard]
    }, {
        path: 'deck',
        component: game_board_component_1.GameBoardComponent,
        canActivate: [auth_1.AuthGuard]
    }, {
        path: 'battle',
        component: game_board_component_1.GameBoardComponent,
        canActivate: [auth_1.AuthGuard]
    }, {
        path: 'cards',
        component: cards_component_1.CardsComponent,
        canActivate: [auth_1.AuthGuard]
    }, {
        path: 'cardEditor',
        component: card_editor_component_1.CardEditorComponent,
        canActivate: [auth_1.AuthGuard]
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                scrolling_1.ScrollDispatchModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                router_1.RouterModule.forRoot(routes),
                lib_material_module_1.LibMaterialModule,
                http_1.HttpModule
            ],
            exports: [router_1.RouterModule],
            providers: [
                module_1.EventBusService,
                game_service_1.GameService,
                cards_service_1.CardsService,
                auth_1.AuthGuard
            ],
            declarations: [
                login_component_1.LoginComponent,
                game_board_component_1.GameBoardComponent,
                cell_component_1.CellComponent,
                console_component_1.ConsoleComponent,
                game_docs_component_1.GameDocsComponent,
                cards_component_1.CardsComponent,
                card_editor_component_1.CardEditorComponent
            ],
            entryComponents: [
                game_board_component_1.GameBoardComponent,
                game_docs_component_1.GameDocsComponent,
                cards_component_1.CardsComponent,
                card_editor_component_1.CardEditorComponent,
                login_component_1.LoginComponent
            ]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
