import {Observable} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Component,OnInit,NgZone,ElementRef,ContentChild,ViewChild,HostListener } from '@angular/core';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';
import {Router} from '@angular/router';

import { BoardModel,CellModel,ZoomFactor } from '../models/cardgame.model';
import { GameService } from '../game-service/game.service';
import { CardsService } from '../cards-service/cards.service';

@Component({
  selector: 'user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  
  private editItem: any;
  
  constructor(
    private ngZone: NgZone,
    private element: ElementRef,
    private router: Router,
    public cardsService: CardsService
  ) {
  }
  
  ngOnInit() {
    this.editItem = {}
  }

  onConfirm() {
    this.cardsService.saveCardsDefinition(this.editItem)
      .subscribe(saved=>{
        this.editItem = saved;
        alert("Saved");
      });
  }

}

