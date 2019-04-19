import merge from "../help/merge.js";
import {calculateEncodingAttributes} from "./shared.js";

class HTMLRenderer {
	constructor(object, encodings, options){
		this.object = object;
		this.aHTML = [];
		this.encodings = encodings;
		this.options = options;
	}

	render() {
		this.prepareHTML();

		for (let i = 0; i < this.encodings.length; i++) {
			var encoding = this.encodings[i];
			var encodingOptions = merge(this.options, encoding.options);

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

	prepareHTML(){
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

		calculateEncodingAttributes(this.encodings, this.options);
	}

	drawTableBarcode(parent, options, encoding){
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

	drawTableText(parent, options, encoding, position) {
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

	createTable(options, first, last) {
		var marginLeft = first ? options.marginLeft : 0;
		var marginRight = last ? options.marginRight : 0;

		var table = '<table style="display:inline-block;vertical-align: top;border:0;border-collapse:collapse;margin-top:' + options.marginTop + 'px;margin-bottom:' + options.marginBottom + 'px;margin-left:' + marginLeft + 'px;margin-right:' + marginRight + 'px;">';

		return [table];
	}
}

export default HTMLRenderer;
