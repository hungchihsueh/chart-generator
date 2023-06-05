import {marked} from "marked";
// marked renderer
const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
	const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

	return `
	<h${level} class="heading">
	  ${text}
	</h${level}>`;
};
renderer.code = function (code, language, isEscaped) {
	let codeArr = code.split("\n");
	console.log("codeArr", codeArr);
	let convertedCodeArr = [];
	for (let i = 0; i < codeArr.length; i++) {
		// if code is markdown heading
		if (codeArr[i].startsWith("#")) {
			convertedCodeArr.push(`<h1>${codeArr[i]}</h1>`);
		}
		// if code is markdown image
		else if (codeArr[i].startsWith("![")) {
			// get the image url
			let url = codeArr[i].match(/\(([^)]+)\)/)[1];
			console.log("url", url);
			convertedCodeArr.push(`<img src="${url}" >`);
		}
		// if code if markdown paragraph
		else {
			convertedCodeArr.push(`<p>${codeArr[i]}</p>`);
		}
	}

	console.log("convertedCodeArr", convertedCodeArr);
	return `<div class="${language}">${convertedCodeArr.join("")}}</div>`;
};

export default renderer;