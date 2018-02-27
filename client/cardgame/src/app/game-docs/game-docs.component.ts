import {Observable} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Component,OnInit,NgZone,ElementRef,ContentChild,ViewChild,HostListener } from '@angular/core';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';

import { BoardModel,CellModel,ZoomFactor } from '../models/cardgame.model';
import { GameService } from '../game-service/game.service';

@Component({
  selector: 'game-docs',
  templateUrl: './game-docs.component.html',
  styleUrls: ['./game-docs.component.scss']
})
export class GameDocsComponent implements OnInit {
  
  constructor(
    public gameService: GameService,
    private ngZone: NgZone,
    private element: ElementRef
  ) {
  }
  
  ngOnInit() {
    
  }
  
}
