import QrCodeGenerator from './Generator/QrCodeGenerator';
import QrCodeElement from './Generator/QrCodeElement';
import QrCodeRow from './Generator/QrCodeRow';
import Timer from "FuseJS/Timer";

export default class MainView {
    constructor() {
        this.text = "This module will create a QR Code and draw it on the screen.";
        this.rows = [];
    }

    generate() {
        this.rows = []; // rows for drawing on the screen
        let codeGen = new QrCodeGenerator(); // init Generator
        let options = codeGen._htOption; // options
        let qrCode = codeGen.makeCode(this.text); // qrCode's elements (light and dark squares)
        var nCount = qrCode.getModuleCount(); // amount of rows
        var elementSize = Math.floor(300 / nCount);

        let lines = [];
        for (var row = 0; row < nCount; row++) {
            let qrCodeRow = new QrCodeRow();
            for (var col = 0; col < nCount; col++) {
                qrCodeRow.addElement(new QrCodeElement({
                    size: elementSize,
                    color: qrCode.isDark(row, col) ? options.colorDark : options.colorLight
                }));
            }
            lines.push(qrCodeRow);
        }

        this.drawCode(lines);
    }

    drawCode(lines) {
        var ind = 0;
        var timerId = Timer.create(() => {
            if(ind >= lines.length)
            {
                Timer.delete(timerId);
                return;
            }

            this.drawQrCodeRow(lines[ind]);
            ind++;

        }, this.text.length * 2, true);
    }

    drawQrCodeRow(row) {
        this.rows.push(row);
    }
}