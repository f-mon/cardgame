
const terrainTypes = ['forest','land','mountain','sea'];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getRandomPosOrNeg(max) {
  return Math.floor((Math.random() * Math.floor(max*2))-Math.floor(max));
}

function Cell(id,row,column,terrainType) {
    this.id = id;
    this.rowIndex = row.index;
    this.colIndex = column.index;
    this.row = row;
    this.column = column;
    this.terrainType = terrainType;
}

function Row(index) {
    this.index = index;
    this.cells = [];
}

function Column(index) {
    this.index = index;
    this.cells = [];
}




function World() {
    
    this.colsNum = 100;
    this.rowsNum = 100;
    
    this.tickInterval = 5000;
    this.tickNumber = 0;
    this.running = false;
    
    // Communication Bus
    this.commBus = null;
    
    this._buildWorld();
}

World.prototype._buildWorld = function() {
    let board = [];
    let columns = [];
    let rows = [];
    for (let x=0; x<this.colsNum; x++) {
        columns.push(new Column(x));
    }
    for (let y=0; y<this.rowsNum; y++) {
        rows.push(new Row(y));
    }
    for (let x=0; x<columns.length; x++) {
        for (let y=0; y<rows.length; y++) {
            let cellId = "cell_"+x+"_"+y;
            let cell = new Cell(cellId,rows[y],columns[x],'sea');
            rows[y].cells.push(cell);
            columns[x].cells.push(cell);
            board.push(cell);
        }    
    }
    this.board = board;
    this.columns = columns;
    this.rows = rows;
    this._buildContinetals(60);
};

World.prototype._buildContinetals = function(numContinents) {
    for (let c=0; c<numContinents; c++) {
        let cXcenter = getRandomInt(this.colsNum);
        let cYcenter = getRandomInt(this.rowsNum);
        
        let continetBig = Math.floor((this.colsNum*this.rowsNum)/(numContinents*0.8));
        for (let n=0; n<continetBig; n++) {
            
            let xCell = cXcenter+getRandomPosOrNeg(this.colsNum/(numContinents*0.2));
            let yCell = cYcenter+getRandomPosOrNeg(this.rowsNum/(numContinents*0.2));
            
            xCell = Math.max(0,Math.min(this.columns.length-1,xCell));
            yCell = Math.max(0,Math.min(this.rows.length-1,yCell));
            
            let cell = this.columns[xCell].cells[yCell];
            cell.terrainType = 'land';
        }
    }
};

World.prototype.getBoard = function() {
    return this.board;
};

World.prototype.start = function() {
    if (this.running) {
        return;
    }
    this.running = true;
    console.log("starting world...");
    this._tickNext();
};

World.prototype._tickNext = function() {
    var self = this;
    setTimeout(function(){
        self._tick();
        self._tickNext();
    },this.tickInterval);
};

World.prototype._tick = function() {
    this.tickNumber++;
    console.log("tick "+this.tickNumber+" world.");
    this.forEachCell(function(cell) {
        //console.log("tick on cell "+cell.id);
    });
    if (this.commBus) {
        this.commBus.sendEventToAll('TICK',{ tick: this.tickNumber });
    }
};

World.prototype.forEachCell = function(fn) {
    this.board.forEach(fn);
};

World.prototype.getState = function() {
  let cellsState = {};
  this.forEachCell(function(cell){
      cellsState[cell.id] = {
          terrainType: cell.terrainType
      };
  });
  return {
      rowsNum: this.rows.length,
      columnsNum: this.columns.length,
      cells: cellsState
  };
};

module.exports = {
  World: function() {
    return new World();   
  }
};
