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
	console.log("code", code);
	console.log("infostring", language);
	console.log("escaped", isEscaped);
	const headingRegex = /^(#{1,6})\s+(.*)/gm;
	console.log("heading", headingRegex.exec(code));
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
					marked.use({ renderer });
					document.getElementById("output").innerHTML = marked(html);
					console.log(html);
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
