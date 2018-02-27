import {Observable} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Component,OnInit,NgZone,ElementRef,ContentChild,ViewChild,HostListener } from '@angular/core';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';

import { BoardModel,CellModel,ZoomFactor } from '../models/cardgame.model';
import { GameService } from '../game-service/game.service';

@Component({
  selector: 'app-navigator',
  templateUrl: './app-navigator.component.html',
  styleUrls: ['./app-navigator.component.scss']
})
export class AppNavigatorComponent implements OnInit {
    
    links: any[] = [{
        text: "Rules",
        routerLink: "/rules",
        materialIcon: "security"
    },{
        text: "Deck",
        routerLink: "/deck",
    },{
        text: "Battle",
        routerLink: "/battle",
    },{
        text: "Cards",
        routerLink: "/cards",
        svgIcon: "cards-outline"
    },{
        text: "Users",
        routerLink: "/users",
        materialIcon: "people"
    }];
    
    ngOnInit() {
    }
    
    showInfo(link) {
        
    }
}