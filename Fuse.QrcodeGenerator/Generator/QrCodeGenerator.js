import QRCodeModel from "../Utils/QRCodeModel";

export default class QrCodeGenerator {
    constructor(vOption) {
        this.QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 }; 
        this.CorrectLevel = this.QRErrorCorrectLevel;
        this.QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];
		this._htOption = {
			typeNumber: 4,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: this.QRErrorCorrectLevel.H,
			text: ""
		};

		if (typeof vOption === 'string') {
			this._htOption.text = vOption;
		}

		// Overwrites options
		if (vOption) {
			for (var i in vOption) {
				this._htOption[i] = vOption[i];
			}
		}

		this._oQRCode = null;

		if (this._htOption.text) {
			this.makeCode(this._htOption.text);
		}
	}

    makeCode(sText) {
		this._oQRCode = new QRCodeModel(this._getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
		this._oQRCode.addData(sText);
		this._oQRCode.make();
		return this._oQRCode;
	}

	 _getTypeNumber(sText, nCorrectLevel) {
		var nType = 1;
		var length = this._getUTF8Length(sText);

		for (var i = 0, len = this.QRCodeLimitLength.length; i <= len; i++) {
			var nLimit = 0;

			switch (nCorrectLevel) {
				case this.QRErrorCorrectLevel.L:
					nLimit = this.QRCodeLimitLength[i][0];
					break;
				case this.QRErrorCorrectLevel.M:
					nLimit = this.QRCodeLimitLength[i][1];
					break;
				case this.QRErrorCorrectLevel.Q:
					nLimit = this.QRCodeLimitLength[i][2];
					break;
				case this.QRErrorCorrectLevel.H:
					nLimit = this.QRCodeLimitLength[i][3];
					break;
			}

			if (length <= nLimit) {
				break;
			} else {
				nType++;
			}
		}

		if (nType > this.QRCodeLimitLength.length) {
			throw new Error("Too long data");
		}

		return nType;
	}

	_getUTF8Length(sText) {
		var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
		return replacedText.length + (replacedText.length != sText ? 3 : 0);
	}
}