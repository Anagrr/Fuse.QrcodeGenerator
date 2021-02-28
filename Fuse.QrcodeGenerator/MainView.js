import QrCodeGenerator from './Generator/QrCodeGenerator';
import QrCodeElement from './Generator/QrCodeElement';
import Timer from "FuseJS/Timer";

export default class MainView {
    constructor() {
        this.text = "https://fuseopen.com/docs/fuse/controls/grid.html";
        this.elements = [];
        this.gridSize = 0;
        this.gridCellsize = 0;
    }

    generate() {
        this.elements = [];
        let codeGen = new QrCodeGenerator(); // init Generator
        let options = codeGen._htOption; // options
        let qrCode = codeGen.makeCode(this.text); // qrCode's elements (light and dark squares)
        this.gridSize = qrCode.getModuleCount(); // amount of rows
        this.gridCellsize = Math.floor(300 / this.gridSize);
        
        let elements = [];
        for (var row = 0; row < this.gridSize; row++) {
            for (var col = 0; col < this.gridSize; col++) {
                if (qrCode.isDark(row, col)) { // grid has white background so we draw only dark cells
                    elements.push(new QrCodeElement({
                        color: options.colorDark,
                        column: col,
                        row: row,
                    }));
                }
            }
        }
        if(elements.length < 900) {
            this.elements = elements; // draw all elements by one step
        } else {
            this.drawCode(elements); // draw elements on-by-one to avoid screen's freezing
        }
    }

    drawCode(items) {
        var ind = 0;
        var timerId = Timer.create(() => {
            if (ind >= items.length) {
                Timer.delete(timerId);
                return;
            }

            this.drawItem(items[ind]);
            ind++;

        }, 2, true);
    }

    drawItem(el) {
        this.elements.push(el);
    }
}