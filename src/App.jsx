import { useState, useEffect } from "react";
import GroupedChart from "./chart_functions/GroupedChart";
import "./App.css";
import * as d3 from "d3";
const reader = new FileReader();
import { marked } from "marked";
import mammoth from "mammoth";

// marked renderer
const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
	const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

	return `
	<h${level} class="nice-ass">
	
	  ${text}
	</h${level}>`;
};
renderer.code = function (code, language, isEscaped) {
	// console.log("code", code);
	// console.log("infostring", language);
	// console.log("escaped", isEscaped);
	const headingRegex = /^(#{1,6})\s+(.*)/gm;
	console.log("heading", code.match(headingRegex));

	const paragraphRegex = /(?<=\n{2}|^)(?!#)([^\n]+)(?=\n{2}|$)/gs;
	const paragraphs = code
		.match(paragraphRegex)
		.map((p) => p.replace(/\n/g, ""));

	console.log(paragraphs);

	const imageRegex = /!\[.*?\]\((.*?)\)/g;
	const images = [];

	let match;
	while ((match = imageRegex.exec(code)) !== null) {
		images.push(match[1]);
	}

	console.log(images);
	return code;
};

function App() {
	function convertToHTML() {
		var fileInput = document.getElementById("fileInput");
		var file = fileInput.files[0];

		var reader = new FileReader();

		reader.onload = function (event) {
			var arrayBuffer = event.target.result;

			var options = {
				arrayBuffer: arrayBuffer,
			};

			var result = mammoth
				.extractRawText(options)
				.then(function (result) {
					var html = result.value;
					console.log(html);
					marked.use({ renderer });
					function separateMarkdownSections(markdownString) {
						// Define the regular expression pattern to split the Markdown string
						const pattern = /\n{2,}/;

						// Split the Markdown string using the regular expression pattern
						const sections = markdownString.split(pattern);

						// Trim leading and trailing whitespace from each section
						const trimmedSections = sections.map((section) => section.trim());

						return trimmedSections;
					}
					const sections = separateMarkdownSections(html);
					console.log(sections);
					document.getElementById("output").innerHTML = marked(html);
					// console.log(html);
				})
				.done();
		};

		reader.readAsArrayBuffer(file);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center">
				<input
					type="file"
					name=""
					id="fileInput"
					className="bg-pink-500"
					onChange={(e) => {}}
				/>
				<button
					className="px-2 py-1 m-5 transition-all duration-150 ease-in-out bg-white border rounded shadow hover:bg-blue-500 hover:text-white"
					id="convert-button"
					onClick={() => convertToHTML()}>
					Convert to HTML
				</button>
				<div id="output"></div>
			</div>
		</>
	);
}

export default App;
