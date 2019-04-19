"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _merge = require("../help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _shared = require("./shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HTMLRenderer = function () {
	function HTMLRenderer(object, encodings, options) {
		_classCallCheck(this, HTMLRenderer);

		this.object = object;
		this.aHTML = [];
		this.encodings = encodings;
		this.options = options;
	}

	_createClass(HTMLRenderer, [{
		key: "render",
		value: function render() {
			this.prepareHTML();

			for (var i = 0; i < this.encodings.length; i++) {
				var encoding = this.encodings[i];
				var encodingOptions = (0, _merge2.default)(this.options, encoding.options);

				var table = this.createTable(encodingOptions, i == 0, i == this.encodings.length - 1);

				this.drawTableText(table, encodingOptions, encoding, "top");
				this.drawTableBarcode(table, encodingOptions, encoding);
				this.drawTableText(table, encodingOptions, encoding, "bottom");

				table.push('</table>');
				this.object.barcode = this.object.barcode.concat(table);
				this.aHTML.push(table.join(""));
			}

			this.aHTML.push('</body>');
			this.aHTML.push('</html>');
			this.object.barcode = this.object.barcode.join("");
			this.object.HTML = this.aHTML.join("");
		}
	}, {
		key: "prepareHTML",
		value: function prepareHTML() {
			// Clear the HTML
			this.object.HTML = "";
			this.object.barcode = [];

			// Initial HTML structure
			this.aHTML = [];
			this.aHTML.push('<!DOCTYPE html>');
			this.aHTML.push('<html>');
			this.aHTML.push('<head>');
			this.aHTML.push('<meta charset="utf-8">');
			this.aHTML.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
			this.aHTML.push('<title>Barcode</title>');
			this.aHTML.push('</head>');
			this.aHTML.push('<body>');

			(0, _shared.calculateEncodingAttributes)(this.encodings, this.options);
		}
	}, {
		key: "drawTableBarcode",
		value: function drawTableBarcode(parent, options, encoding) {
			var binary = encoding.data;

			// Creates the barcode out of the encoded binary
			parent.push('<tr>');

			for (var b = 0; b < binary.length; b++) {
				if (binary[b] === "1") {
					parent.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + options.width + 'px;height:' + options.height + 'px;background-color:' + options.lineColor + ';"></td>');
				} else {
					parent.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + options.width + 'px;height:' + options.height + 'px;background-color:' + options.background + ';"></td>');
				}
			}

			parent.push('</tr>');
		}
	}, {
		key: "drawTableText",
		value: function drawTableText(parent, options, encoding, position) {
			// Draw the text if displayValue is set
			if (options.displayValue && options.textPosition == position) {
				var padding = position == "top" ? "bottom" : "top";

				parent.push('<tr>');
				parent.push('<td colspan="' + encoding.data.length + '" style="padding:0;text-align:' + options.textAlign + ';padding-' + padding + ':' + options.textMargin + 'px;font:' + options.fontOptions + ' ' + options.fontSize + 'px ' + options.font + ';">');
				parent.push(encoding.text);
				parent.push('</td>');
				parent.push('</tr>');
			}
		}
	}, {
		key: "createTable",
		value: function createTable(options, first, last) {
			var marginLeft = first ? options.marginLeft : 0;
			var marginRight = last ? options.marginRight : 0;

			var table = '<table style="display:inline-block;vertical-align: top;border:0;border-collapse:collapse;margin-top:' + options.marginTop + 'px;margin-bottom:' + options.marginBottom + 'px;margin-left:' + marginLeft + 'px;margin-right:' + marginRight + 'px;">';

			return [table];
		}
	}]);

	return HTMLRenderer;
}();

exports.default = HTMLRenderer;