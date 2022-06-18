import QrCodeGenerator from './QrCodeGenerator';
import QrCodeElement from './QrCodeElement';

export default class QrCodeRenderer {
    _maxCellSize = 5;
    constructor(screenSize, text) {
        this.screenWidth = screenSize[0];
        this.elements = [];
        this.gridSize = 0;
        this.gridCellsize = this._maxCellSize;
        this.isDark = true;
        this.text = text;
    }

    render() {
        
        this.elements = []; // will contains all black cells of QRcode
        let codeGen = new QrCodeGenerator(); // init Generator
        let modules = codeGen.makeCode(this.text); // qrCode's elements (light and dark squares)
        this.gridSize = modules.length; // amount of rows

        // calculate cellsize automatically if current cellsize not suitable
        this.gridCellsize = Math.floor(this.screenWidth * 0.95 / this.gridSize);
        this.gridCellsize = this.gridCellsize > this._maxCellSize ? this._maxCellSize : this.gridCellsize;

        for (var row = 0; row < this.gridSize; row++) {
            let modulesRow = modules[row]; // take one row of qr-code
            let currentCell = undefined; // current cell wich will be displayed further
            for (var col = 0; col < this.gridSize; col++) { // iterate columns (cells)
                if (modulesRow[col] == this.isDark) { // grid has white background so we draw only dark cells
                    if (currentCell == undefined) { // if cell undefind - create new one
                        currentCell = new QrCodeElement({
                            column: col,
                            row: row,
                            span: 1
                        });
                        this.addToAllCellsIfCellIsLastInRow(col, currentCell); // if cell is last in a row - add to all elements
                    } else {
                        currentCell.span++; // instead of draw several black cells we merge them into one line by columnSpan
                        this.addToAllCellsIfCellIsLastInRow(col, currentCell);
                    }
                } else { // if cell is white
                    if (currentCell != undefined) { // if we have black cell we add it to all
                        this.elements.push(currentCell);
                        currentCell = undefined;
                    }
                }
            }
        }
    }

    addToAllCellsIfCellIsLastInRow(col, currentCell) {
        if (col == this.gridSize - 1) {
            this.elements.push(currentCell);
        }
    }
}