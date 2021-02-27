import QrCodeGenerator from './Generator/QrCodeGenerator';
import QrCodeElement from './Generator/QrCodeElement';
import QrCodeRow from './Generator/QrCodeRow';

export default class MainView {
    constructor() {
        this.text = "https://fuseopen.com/docs/basics/introduction-to-fuse.html";
        this.rows = [];
    }

    generate() {
        let codeGen = new QrCodeGenerator();
        let options = codeGen._htOption;
        let qrCode = codeGen.makeCode(this.text);
        var nCount = qrCode.getModuleCount();
        var nWidth = Math.floor(options.width / nCount);
        var nHeight = Math.floor(options.height / nCount);

        let temRows = []; // array of rows

        for (var row = 0; row < nCount; row++) {
            let qrCodeRow = new QrCodeRow();
            for (var col = 0; col < nCount; col++) {
                qrCodeRow.addElement(new QrCodeElement({
                    width: nWidth,
                    height: nHeight,
                    color: qrCode.isDark(row, col) ? options.colorDark : options.colorLight
                }));
            }
            temRows.push(qrCodeRow);
        }

        this.rows = temRows;
    }
}