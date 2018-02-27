import { Observable,Subscription } from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Component,OnInit,OnDestroy,NgZone,ElementRef,ContentChild,ViewChild,HostListener } from '@angular/core';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';

import { BoardModel,CellModel,ZoomFactor } from '../models/cardgame.model';

import { EventBusService } from '../event-bus/event-bus.service';
import { GameService } from '../game-service/game.service';

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit,OnDestroy {
  
  zoomFactor: ZoomFactor = new ZoomFactor();
  board: BoardModel;
  renderedCells: CellModel[] = [];
  
  focusedCell: CellModel;
  selectedCells: {
    [cellId:string]: CellModel
  } = {};
  
  @ViewChild("cellViewport")
  private cellViewport: ElementRef;  
  
  @ViewChild("cellSpace")
  private cellSpace: ElementRef;  
  
  @ViewChild("renderedPane")
  private renderedPane: ElementRef;
  
  @HostListener('window:resize') 
  onResize() {
    if (this.board) {
      this.updateRenderedCells();
    }
  }
  
  private cellSpaceWidth: number;
  private cellSpaceHeight: number;
  private boardScroller: GameBoardScroller;
  
  private retrieveSub: Subscription;
  private gameEventsSub: Subscription;
  private scrollSub: Subscription;
  
  constructor(
    public eventBus: EventBusService,
    public gameService: GameService,
    private ngZone: NgZone,
    private element: ElementRef,
    private scrollDispatcher: ScrollDispatcher 
  ) {
  }
  
  ngOnInit() {
    
    this.boardScroller = new GameBoardScroller(this.cellViewport.nativeElement);
    
    this.scrollSub =  this.scrollDispatcher.scrolled().debounceTime(50).subscribe((scrollable: CdkScrollable)=>{
      if (!this.board) {
        return;
      }
      this.ngZone.run(()=>{
        this.updateRenderedCells();
      });
    });
    
    this.retrieveSub = this.gameService.retrieveBoardModel().subscribe((boardModel)=>{
      this.board = boardModel;
      this.recalcCellSpace();
    });
    
    this.gameEventsSub = this.eventBus.events.subscribe((ev)=>{
      if (!this.board) {
        return;
      }
      if (ev==="REDRAW") {
        this.recalcCellSpace();
      }
      if (ev && ev.name==="CENTER_BOARD") {
        this.centerBoardOnCell(ev.cellX,ev.cellY);
      }
    });
  }
  
  ngOnDestroy() {
    if (this.retrieveSub) {
      this.retrieveSub.unsubscribe();
    }
    if (this.gameEventsSub) {
      this.gameEventsSub.unsubscribe();
    }
    if (this.scrollSub) {
      this.scrollSub.unsubscribe();
    }
  }
  
  getFocusedCell(): CellModel {
    return this.focusedCell;
  }
  
  onCellFocusRequest(cell: CellModel) {
    if (cell && !this.isFocusedCell(cell)) {
      this.focusedCell = cell;
    } else {
      this.focusedCell = null;
    }
    if (cell && !this.isSelectedCell(cell)) {
      this.selectedCells[cell.id] = cell;
    } else {
      this.selectedCells[cell.id] = null;
    }
  }
  
  isFocusedCell(cell: CellModel): boolean {
    return this.focusedCell === cell;
  }
  
  isSelectedCell(cell: CellModel): boolean {
    return !!this.selectedCells[cell.id];
  }
  
  public centerBoardOnCell(cellX: number,cellY: number) {
    let cell = this.board.getCell(cellX,cellY);
    this.boardScroller.smoothScrollTo(cell.getCoordCenterX(this.zoomFactor),cell.getCoordCenterY(this.zoomFactor));
    this.onCellFocusRequest(cell);
  }
  
  private recalcCellSpace() {
    this.cellSpaceWidth = (this.board.columns.length*this.zoomFactor.cellWidth);
    this.cellSpaceHeight = (this.board.rows.length*this.zoomFactor.cellHeightPartial);
    this.cellSpace.nativeElement.style.width = this.cellSpaceWidth+"px";
    this.cellSpace.nativeElement.style.height = this.cellSpaceHeight+"px";
    this.updateRenderedCells();  
  }
  
  private updateRenderedCells() {
    let visibleCells = this.caclRenderedCells();
    
    this.renderedCells.splice(0,this.renderedCells.length);
    Array.prototype.push.apply(this.renderedCells,visibleCells);
    
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
  }
  
  private caclRenderedCells() {
    
      let viewPort = this.cellViewport.nativeElement;
      let left = Math.max(0,viewPort.scrollLeft-this.zoomFactor.cellWidth/2);
      let top = Math.max(0,viewPort.scrollTop-this.zoomFactor.cellWidth/2);
      let width = viewPort.offsetWidth;
      let height = viewPort.offsetHeight;
      
      let firstX = Math.floor(left/this.zoomFactor.cellWidth);
      let lastX = firstX+Math.ceil(width/this.zoomFactor.cellWidth);
      let firstY = Math.floor(top/this.zoomFactor.cellHeightPartial);
      let lastY = firstY+Math.ceil(height/this.zoomFactor.cellHeightPartial);
      
      let renderedCells = this.board.sliceView(firstX,lastX,firstY,lastY);
      return renderedCells;
  }
  

}


export class GameBoardScroller {
  
  private cycle: number = 0;
  private targetX: number;
  private targetY: number;
  
  private pending;
  
  constructor(public element) {}
  
  smoothScrollTo(xPos,yPos) {
    let viewPortWidth = this.element.offsetWidth;
    let viewPortHeight = this.element.offsetHeight;
    this.targetX = Math.max(0,xPos-(viewPortWidth/2));
    this.targetY = Math.max(0,yPos-(viewPortHeight/2));
    this.cycle = 0;
    this.checkScroll();
  }
  
  checkScroll() {
    if (this.pending) {
      clearTimeout(this.pending);
      this.pending = null;
    }
    this.pending = setTimeout(()=>{
      this.cycle++;
      /*
      if (this.cycle===1) {
        console.log("Scroll Start ",this.element.scrollLeft," ---> ",this.targetX);
        console.log("Scroll Start ",this.element.scrollTop," ---> ",this.targetY);
      }
      */
      if (this.element.scrollLeft!==this.targetX) {
        let distance = this.targetX - this.element.scrollLeft;
        let step = Math.abs(distance)>10?(distance/10):distance;
        this.element.scrollLeft = this.element.scrollLeft + step;
      }
      if (this.element.scrollTop!==this.targetY) {
        let distance = this.targetY - this.element.scrollTop;
        let step = Math.abs(distance)>10?(distance/10):distance;
        this.element.scrollTop = this.element.scrollTop + step;
      }
      
      let checkX = Math.abs(this.targetX-this.element.scrollLeft);
      let checkY = Math.abs(this.targetY-this.element.scrollTop);
      
      if (checkX>1 || checkY>1) {
        this.checkScroll();
        //console.log("Scrolled Next");
        /*
        if (this.cycle%100===0) {
          if (checkX>1) {
            console.log("Scroll X ",this.element.scrollLeft," ---> ",this.targetX);
          }
          if (checkY>1) {
            console.log("Scroll Y ",this.element.scrollTop," ---> ",this.targetY);
          }
          console.log("Scrolled Next ",checkX,"  ",checkY);
        }
        */
      } else {
        console.log("Scrolled End At: ",this.cycle);
      }
    },5);
  }
  
  
}
