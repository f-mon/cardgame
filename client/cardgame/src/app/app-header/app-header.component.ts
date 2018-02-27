import {Observable} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { 
    Component,
    Output,
    OnInit,
    Input,
    NgZone,
    ElementRef,
    ContentChild,
    ViewChild,
    HostListener,
    EventEmitter } from '@angular/core';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';
import { 
  Router
} from '@angular/router';

import { BoardModel,CellModel,ZoomFactor } from '../models/cardgame.model';
import { GameService } from '../game-service/game.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
    
    @Input()
    showSidenavBtn: boolean = true;
    
    @Output()
    toggleSidenav: EventEmitter<boolean> = new EventEmitter<boolean>();
    
    tick: number;
    
    constructor(
        public router: Router,
        public eventBus: EventBusService
        ) 
    {}
    
    ngOnInit() {
        this.eventBus.onServerMsgEvent('TICK').subscribe(ev=>{
            this.tick = ev.tick; 
        });
    }
    
    fireToggleSidenav() {
        this.toggleSidenav.next(true);
    }
    
    goToLogin() {
        this.router.navigate(['/login']);
    }
}