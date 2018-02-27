import * as Rx from 'rxjs/Rx';
import { Component,OnInit,Input,Output,EventEmitter,HostBinding,ElementRef,OnDestroy } from '@angular/core';
import { CellModel,ZoomFactor } from '../models/cardgame.model';

import { GameService } from '../game-service/game.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Component({
  selector: 'cell-component',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit,OnDestroy {
  
  @Input()
  zoomFactor: ZoomFactor;
  
  @Input()
  cell: CellModel;
  
  @HostBinding('class.selected') 
  @Input()
  selected: boolean;
  
  @HostBinding('class.focused') 
  @Input()
  focused: boolean;
  
  @Output()
  focusRequest: EventEmitter<CellModel>;
  
  hexWidth : number;
  hexHeight : number;
  hexPoints : string;
  hexClipPath : string;

  private eventsSubs: Rx.Subscription;

  constructor(
    public gameService: GameService,
    public eventBus: EventBusService,
    public element: ElementRef
  ) {
    this.focusRequest = new EventEmitter<CellModel>();
  }  
    
  ngOnInit() {
    this.drawCell();
    this.eventsSubs = this.eventBus.events.subscribe((ev)=>{
      if (ev==="REDRAW") {
        this.drawCell();
      }
    });
  }
  
  ngOnDestroy() {
    if (this.eventsSubs) {
      this.eventsSubs.unsubscribe();
    }
  }
  
  onCellClick($event) {
    this.focusRequest.next(this.cell);
  }
  
  get terrainTypeClass(): string {
    return this.cell.terrainType;
  }
  
  
  private drawCell() {
    let element = this.element.nativeElement;
    element.style.top = this.cell.getCoordTopLeftY(this.zoomFactor)+"px";
    element.style.left = this.cell.getCoordTopLeftX(this.zoomFactor)+"px";
    element.style.width = this.zoomFactor.cellWidth+"px";
    element.style.height = this.zoomFactor.cellHeight+"px"; 
    
    this.hexWidth = this.zoomFactor.cellWidth;
    this.hexHeight = this.zoomFactor.cellHeight;
    this.hexPoints =  this.zoomFactor.getHexPoints();
    this.hexClipPath = this.zoomFactor.getHexClipPath();
  }
  
}