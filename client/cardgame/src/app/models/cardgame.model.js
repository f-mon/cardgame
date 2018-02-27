"use strict";
var BoardModel = (function () {
    function BoardModel() {
        this.rows = [];
        this.columns = [];
    }
    BoardModel.createBoardModel = function (boardData) {
        var rowsNum = boardData.rowsNum;
        var columnsNum = boardData.columnsNum;
        var board = new BoardModel();
        for (var r = 0; r < rowsNum; r++) {
            board.rows.push(new BoardRowModel(r));
        }
        for (var c = 0; c < columnsNum; c++) {
            board.columns.push(new BoardColModel(c));
        }
        for (var r = 0; r < rowsNum; r++) {
            var rowModel = board.rows[r];
            for (var c = 0; c < rowsNum; c++) {
                var columnModel = board.columns[c];
                var cell = new CellModel("cell_" + rowModel.index + "_" + columnModel.index, rowModel, columnModel);
                rowModel.cells.push(cell);
                columnModel.cells.push(cell);
                if (boardData.cells && boardData.cells[cell.id]) {
                    var state = boardData.cells[cell.id];
                    cell.setState(state);
                }
            }
        }
        return board;
    };
    BoardModel.prototype.getCell = function (cellX, cellY) {
        return this.rows[cellY].cells[cellX];
    };
    BoardModel.prototype.sliceView = function (minX, maxX, minY, maxY) {
        var cells = [];
        maxX = Math.min(maxX, this.columns.length - 1);
        maxY = Math.min(maxY, this.rows.length - 1);
        for (var y = minY; y <= maxY; y++) {
            for (var x = minX; x <= maxX; x++) {
                var cell = this.getCell(x, y);
                cells.push(cell);
            }
        }
        return cells;
    };
    return BoardModel;
}());
exports.BoardModel = BoardModel;
var BoardRowModel = (function () {
    function BoardRowModel(index) {
        this.index = index;
        this.cells = [];
    }
    return BoardRowModel;
}());
exports.BoardRowModel = BoardRowModel;
var BoardColModel = (function () {
    function BoardColModel(index) {
        this.index = index;
        this.cells = [];
    }
    return BoardColModel;
}());
exports.BoardColModel = BoardColModel;
var CellModel = (function () {
    function CellModel(id, row, col) {
        this.id = id;
        this.row = row;
        this.col = col;
    }
    CellModel.prototype.setState = function (cellState) {
        this.cellState = cellState;
        if (cellState) {
            this.terrainType = cellState.terrainType;
        }
    };
    CellModel.prototype.getCoordTopLeftX = function (zoomFactor) {
        var isOddRow = this.row.index % 2;
        return (this.col.index * zoomFactor.cellWidth) + (isOddRow ? (zoomFactor.cellWidth / 2) : 0);
    };
    CellModel.prototype.getCoordTopLeftY = function (zoomFactor) {
        return this.row.index * (zoomFactor.cellHeightPartial);
    };
    CellModel.prototype.getCoordCenterX = function (zoomFactor) {
        return this.getCoordTopLeftX(zoomFactor) + (zoomFactor.cellWidth / 2);
    };
    CellModel.prototype.getCoordCenterY = function (zoomFactor) {
        return this.getCoordTopLeftY(zoomFactor) + (zoomFactor.cellHeight / 2);
    };
    return CellModel;
}());
exports.CellModel = CellModel;
var ZoomFactor = (function () {
    function ZoomFactor() {
        this.number = 100;
        this.number = ZoomFactor.DEFAULT_HEIGHT / 5;
        this.number = ZoomFactor.DEFAULT_HEIGHT - ZoomFactor.DEFAULT_TRI_HEIGHT;
        this.number = ZoomFactor.DEFAULT_HEIGHT;
        this.zoomX = 1;
        this.zoomStep = 0.2;
        this.update();
    }
    ZoomFactor.prototype.getHexPoints = function () {
        return this.hexPoints;
    };
    ZoomFactor.prototype.getHexClipPath = function () {
        return this.hexClipPath;
    };
    ZoomFactor.prototype.zoomIn = function () {
        this.zoom(1 + this.zoomStep);
    };
    ZoomFactor.prototype.zoomOut = function () {
        this.zoom(1 - this.zoomStep);
    };
    ZoomFactor.prototype.zoom = function (factor) {
        this.zoomX = factor;
        this.update();
    };
    ZoomFactor.prototype.update = function () {
        this.cellHeight = (this.cellHeight || ZoomFactor.DEFAULT_HEIGHT) * this.zoomX;
        this.cellTriHeight = (this.cellTriHeight || ZoomFactor.DEFAULT_TRI_HEIGHT) * this.zoomX;
        this.cellHeightPartial = (this.cellHeightPartial || ZoomFactor.DEFAULT_HEIGHT_PARTIAL) * this.zoomX;
        this.cellWidth = (this.cellWidth || ZoomFactor.DEFAULT_WIDTH) * this.zoomX;
        this.hexPoints = this.cellWidth / 2 + ",0   " + this.cellWidth + "," + this.cellTriHeight + "  " + this.cellWidth + "," + this.cellHeightPartial + "  " + this.cellWidth / 2 + "," + this.cellHeight + " 0," + this.cellHeightPartial + "  0," + this.cellTriHeight;
        this.hexClipPath = "polygon(" + this.cellWidth / 2 + "px 0px, " + this.cellWidth + "px " + this.cellTriHeight + "px, " + this.cellWidth + "px " + this.cellHeightPartial + "px, " + this.cellWidth / 2 + "px " + this.cellHeight + "px, 0px " + this.cellHeightPartial + "px, 0px " + this.cellTriHeight + "px)";
    };
    ZoomFactor.readonly = DEFAULT_HEIGHT;
    ZoomFactor.readonly = DEFAULT_TRI_HEIGHT;
    ZoomFactor.readonly = DEFAULT_HEIGHT_PARTIAL;
    ZoomFactor.readonly = DEFAULT_WIDTH;
    return ZoomFactor;
}());
exports.ZoomFactor = ZoomFactor;
