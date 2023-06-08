import { marked } from "marked";
import { render } from "react-dom";
import mermaid from "mermaid";
import * as d3 from "d3";
// marked renderer
const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
	const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
	return `<h${level} class="heading">${text}</h${level}>`;
};

renderer.paragraph = function (text) {
	return `<p>${text}</p>`;
};
renderer.image = function (href, title, text) {
	return `<img src="${href}" alt="${text}"/>`;
};
renderer.code = function (code, language, isEscaped) {
	let d3count = 0;
	// console.log("code", code);
	let codeArr = code.split("\n");
	// console.log("codeArr", codeArr);
	let convertedCodeArr = [];

	let result;
		switch (language) {
			case "talk":
				for (let i = 0; i < codeArr.length; i++) {
					convertedCodeArr.push(marked(codeArr[i]));
					// // if code is markdown heading
					// if (codeArr[i].startsWith("#")) {
					// 	// remove the # from the heading
					// 	codeArr[i] = codeArr[i].replace("#", "");
					// 	convertedCodeArr.push(`<h1>${codeArr[i]}</h1>`);
					// }
					// // if code is markdown image
					// else if (codeArr[i].startsWith("![")) {
					// 	// get the image url
					// 	let url = codeArr[i].match(/\(([^)]+)\)/)[1];
					// 	console.log("url", url);
					// 	convertedCodeArr.push(`<img src="${url}" >`);
					// }
					// // if code if markdown paragraph
					// else {
					// 	convertedCodeArr.push(`<p>${codeArr[i]}</p>`);
					// }
				}
				let paragraphArr = [];
				// console.log("convertedCodeArr", convertedCodeArr);
				for (let i = 0; i < convertedCodeArr.length; i++) {
					if (
						(convertedCodeArr[i].startsWith("<p") ||
							convertedCodeArr[i].startsWith("<h1")) &&
						convertedCodeArr[i].startsWith("<p><img") == false
					) {
						paragraphArr.push(convertedCodeArr[i]);
					} else {
						break;
					}
				}
				// console.log("paragraphArr", paragraphArr);
				// an array call imgArr that is the rest of the convertedCodeArr without the paragraphArr
				convertedCodeArr.splice(0, paragraphArr.length);
				let imgArr = convertedCodeArr;

				let textPart =
					'<div class="textPart">' + paragraphArr.join("") + "</div>";
				let imgPart = "<div>" + imgArr.join("") + "</div>";

				result = `<div class="${language}">${textPart}${imgPart}</div>`;
				break;
			case "mermaid":
				// mermaid.initialize();
				// mermaid
				// 	.render("graphDiv", code)
				// 	.then((svgCode) => {
				// 		console.log("Rendered!", svgCode.svg);
				// 		return svgCode.svg;
				// 	})
				// return
				if (
					code.match(/^sequenceDiagram/) ||
					code.match(/^graph/) ||
					code.match(/^flowchart/)
				) {
					result = '<pre class="mermaid">' + code + "</pre>";
				} else {
					result = "<pre><code>" + code + "</code></pre>";
				}
				break;
			case "table":
				// console.log(code)
				// console.log("table", JSON.parse(code));
				function generateHtmlTable(jsonObj) {
					let tableHtml = "<table>\n";

					// Generate table header
					tableHtml += "<thead>\n";
					for (const row of jsonObj.header.rows) {
						tableHtml += "<tr>\n";
						for (const cell of row.cells) {
							tableHtml += `<th rowspan="${cell.rowspan || 1}" colspan="${
								cell.colspan || 1
							}">${cell.content}</th>\n`;
						}
						tableHtml += "</tr>\n";
					}
					tableHtml += "</thead>\n";

					// Generate table body
					tableHtml += "<tbody>\n";
					for (const row of jsonObj.rows) {
						tableHtml += "<tr>\n";
						for (const cell of row.cells) {
							tableHtml += `<td>${cell.content}</td>\n`;
						}
						tableHtml += "</tr>\n";
					}
					tableHtml += "</tbody>\n";

					tableHtml += "</table>";
					return tableHtml;
				}
				console.log("generateHtmlTable", generateHtmlTable(JSON.parse(code)));
				result = `<div class="${language}">${generateHtmlTable(
					JSON.parse(code),
				)}</div>`;
				break;

			case "d3barchart":
				console.log(`${code}`)

				result = `<div class="${language}" id="${language}">${code}</div>`;
			
				break;
			default:
				result = `<pre><code class="${language}">${code}</code></pre>`;
		}
return result;
	// if (language === "talk") {
	// 	let codeArr = code.split("\n");
	// 	let convertedCodeArr = [];
	// 	for (let i = 0; i < codeArr.length; i++) {
	// 		console.log("codeArr[i]", marked(codeArr[i]));
	// 		convertedCodeArr.push(marked(codeArr[i]));
	// 		// // if code is markdown heading
	// 		// if (codeArr[i].startsWith("#")) {
	// 		// 	// remove the # from the heading
	// 		// 	codeArr[i] = codeArr[i].replace("#", "");
	// 		// 	convertedCodeArr.push(`<h1>${codeArr[i]}</h1>`);
	// 		// }
	// 		// // if code is markdown image
	// 		// else if (codeArr[i].startsWith("![")) {
	// 		// 	// get the image url
	// 		// 	let url = codeArr[i].match(/\(([^)]+)\)/)[1];
	// 		// 	console.log("url", url);
	// 		// 	convertedCodeArr.push(`<img src="${url}" >`);
	// 		// }
	// 		// // if code if markdown paragraph
	// 		// else {
	// 		// 	convertedCodeArr.push(`<p>${codeArr[i]}</p>`);
	// 		// }
	// 	}
	// 	let paragraphArr = [];
	// 	console.log("convertedCodeArr", convertedCodeArr);
	// 	for (let i = 0; i < convertedCodeArr.length; i++) {
	// 		if (
	// 			(convertedCodeArr[i].startsWith("<p") ||
	// 				convertedCodeArr[i].startsWith("<h1")) &&
	// 			convertedCodeArr[i].startsWith("<p><img") == false
	// 		) {
	// 			paragraphArr.push(convertedCodeArr[i]);
	// 		} else {
	// 			break;
	// 		}
	// 	}
	// 	console.log("paragraphArr", paragraphArr);
	// 	// an array call imgArr that is the rest of the convertedCodeArr without the paragraphArr
	// 	convertedCodeArr.splice(0, paragraphArr.length);
	// 	let imgArr = convertedCodeArr;

	// 	let textPart = '<div class="textPart">' + paragraphArr.join("") + "</div>";
	// 	let imgPart = "<div>" + imgArr.join("") + "</div>";

	// 	return `<div class="${language}">${textPart}${imgPart}</div>`;
	// }
};

export default renderer;
