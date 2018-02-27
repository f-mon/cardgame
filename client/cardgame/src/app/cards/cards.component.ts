import {Observable,Subscription} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { 
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ElementRef,
  ContentChild,
  ViewChild,
  HostListener 
} from '@angular/core';
import {Router} from '@angular/router';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';

import { BoardModel,CellModel,ZoomFactor } from '../models/cardgame.model';
import { CardDefModel } from '../models/cards.model';

import { GameService } from '../game-service/game.service';
import { CardsService } from '../cards-service/cards.service';

@Component({
  selector: 'cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit,OnDestroy {
  
  showCards = [];
  
  private retrieveSub: Subscription;
  
  constructor(
    private ngZone: NgZone,
    private element: ElementRef,
    private router: Router,
    public cardsService: CardsService
  ) {
  }
  
  ngOnInit() {
    this.retrieveSub = this.cardsService.retrieveCardsDefinitions().subscribe((cards)=>{
      this.showCards = cards;
    });
  }
  
  ngOnDestroy() {
    if (this.retrieveSub) {
      this.retrieveSub.unsubscribe();
    }
  }
  
  onAddCard() {
    this.router.navigate(['/cardEditor'])
  }

}

