
export class BoardModel {
    
    rows: BoardRowModel[] = [];
    columns: BoardColModel[] = [];
    
    static createBoardModel(boardData: any): BoardModel {
      
        let rowsNum: number = boardData.rowsNum;
        let columnsNum: number = boardData.columnsNum;
      
        let board = new BoardModel();
        for (let r=0; r<rowsNum; r++) {
          board.rows.push(new BoardRowModel(r));
        }
        for (let c=0; c<columnsNum; c++) {
          board.columns.push(new BoardColModel(c));
        }
        for (let r=0; r<rowsNum; r++) {
          let rowModel = board.rows[r];
          for (let c=0; c<rowsNum; c++) {
            let columnModel = board.columns[c];
            let cell = new CellModel(
              `cell_${rowModel.index}_${columnModel.index}`,
              rowModel,
              columnModel
            );
            rowModel.cells.push(cell);
            columnModel.cells.push(cell);
            if (boardData.cells && boardData.cells[cell.id]) {
              let state = boardData.cells[cell.id];
              cell.setState(state);
            }
          }  
        }
        return board;
    }
    
    public getCell(cellX,cellY): CellModel {
      return this.rows[cellY].cells[cellX];
    }
    
    public sliceView(minX,maxX,minY,maxY): CellModel[] {
      let cells = [];
      maxX = Math.min(maxX,this.columns.length-1);
      maxY = Math.min(maxY,this.rows.length-1);
      for (let y=minY; y<=maxY; y++) {
        for (let x=minX; x<=maxX; x++) {
          let cell = this.getCell(x,y);
          cells.push(cell);
        }  
      }
      return cells;
    }
    
}

export class BoardRowModel {
  
    public cells: CellModel[] = [];
    
    constructor(public index: number) {}
}


export class BoardColModel {
  
    public cells: CellModel[] = [];
    
    constructor(public index: number) {}
}

export class CellModel {
  
    cellState: any;
    terrainType: string;
    
    constructor(
      public id: string,
      public row: BoardRowModel,
      public col: BoardColModel) 
    {}
    
    setState(cellState: any) {
      this.cellState = cellState;
      if (cellState) {
        this.terrainType = cellState.terrainType;
      }
    }
    
    public getCoordTopLeftX(zoomFactor: ZoomFactor): number {
      let isOddRow = this.row.index%2;
      return (this.col.index*zoomFactor.cellWidth)+(isOddRow?(zoomFactor.cellWidth/2):0);  
    }
    
    public getCoordTopLeftY(zoomFactor: ZoomFactor): number {
      return this.row.index*(zoomFactor.cellHeightPartial);
    }
    
    public getCoordCenterX(zoomFactor: ZoomFactor): number {
      return this.getCoordTopLeftX(zoomFactor)+(zoomFactor.cellWidth/2);
    }
    
    public getCoordCenterY(zoomFactor: ZoomFactor): number {
      return this.getCoordTopLeftY(zoomFactor)+(zoomFactor.cellHeight/2);
    }
}


export class ZoomFactor {
  
  public static readonly DEFAULT_HEIGHT: number = 100;
  public static readonly DEFAULT_TRI_HEIGHT: number = ZoomFactor.DEFAULT_HEIGHT/5;
  public static readonly DEFAULT_HEIGHT_PARTIAL: number = ZoomFactor.DEFAULT_HEIGHT-ZoomFactor.DEFAULT_TRI_HEIGHT;
  public static readonly DEFAULT_WIDTH: number = ZoomFactor.DEFAULT_HEIGHT;
  
  private zoomX = 1;
  private zoomStep = 0.2;
  
  cellHeight: number;
  cellTriHeight: number;
  cellHeightPartial: number;
  cellWidth: number;
  
  hexPoints : string;
  hexClipPath : string;
  
  constructor() {
    this.update();
  }
    
  getHexPoints(): string {
    return this.hexPoints;
  }  
  
  getHexClipPath(): string {
    return this.hexClipPath;
  }  
  
  zoomIn() {
    this.zoom(1+this.zoomStep);
  }
  
  zoomOut() {
    this.zoom(1-this.zoomStep);
  }
  
  zoom(factor) {
    this.zoomX = factor;
    this.update();
  }
  
  private update() {
    this.cellHeight = (this.cellHeight || ZoomFactor.DEFAULT_HEIGHT)*this.zoomX;
    this.cellTriHeight = (this.cellTriHeight || ZoomFactor.DEFAULT_TRI_HEIGHT)*this.zoomX;
    this.cellHeightPartial = (this.cellHeightPartial || ZoomFactor.DEFAULT_HEIGHT_PARTIAL)*this.zoomX;
    this.cellWidth = (this.cellWidth || ZoomFactor.DEFAULT_WIDTH)*this.zoomX;
    this.hexPoints=  `${this.cellWidth/2},0   ${this.cellWidth},${this.cellTriHeight}  ${this.cellWidth},${this.cellHeightPartial}  ${this.cellWidth/2},${this.cellHeight} 0,${this.cellHeightPartial}  0,${this.cellTriHeight}`;
    this.hexClipPath = `polygon(${this.cellWidth/2}px 0px, ${this.cellWidth}px ${this.cellTriHeight}px, ${this.cellWidth}px ${this.cellHeightPartial}px, ${this.cellWidth/2}px ${this.cellHeight}px, 0px ${this.cellHeightPartial}px, 0px ${this.cellTriHeight}px)`;
  }
    
}
