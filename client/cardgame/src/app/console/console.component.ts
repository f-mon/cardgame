import { Component,OnInit,Input } from '@angular/core';
import { CellModel,ZoomFactor } from '../models/cardgame.model';

import { GameService } from '../game-service/game.service';
import { EventBusService } from '../event-bus/event-bus.service';


@Component({
  selector: 'console-component',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  @Input()
  zoomFactor: ZoomFactor;
  
  @Input()
  focusedCell: any;
  
  constructor(
    public eventBus: EventBusService
  ) {}
    
  ngOnInit() {
  }
  
  zoomIn() {
    this.zoomFactor.zoomIn();
    this.eventBus.fireEvent("REDRAW");
  }
  
  zoomOut() {
    this.zoomFactor.zoomOut();
    this.eventBus.fireEvent("REDRAW");
  }
  
}