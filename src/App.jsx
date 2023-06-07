import { useState, useEffect } from "react";
import GroupedChart from "./chart_functions/GroupedChart";

import * as d3 from "d3";
const reader = new FileReader();
import { marked } from "marked";
import mammoth from "mammoth";
import mermaid from "mermaid";
import renderer from "./renderer/markedRenderer";

marked.use({ renderer });

function App() {
	async function doMermaid() {
		mermaid.initialize();
		const mermaids = document.querySelectorAll(".mermaid");
		console.log("mermaids", mermaids);
		mermaids.forEach((m) => {
			let graphDefinition = m.innerText;
			mermaid.render("graphDiv", graphDefinition).then((svgObj) => {
				m.innerHTML = svgObj.svg;
			});
		});
	}
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
					console.log("html", html);
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
					console.log("sections", sections);
					document.getElementById("output").innerText = html;

					let newArr = [...sections];
					// console.log(newArr);
					let codeBlockStartIndex = 0;
					let codeBlock = [];
					// know the code block start with "```SOMETHONG" and end with "```"
					// try identify where "```SOMETHING" at and where "```" at
					// then try totake the item between index and put it into a new array
					//and put it back to the original array at the same index

					for (let i = 0; i < newArr.length; i++) {
						// console.log(codeBlockStartIndex);
						// console.log("newArr[i]", newArr[i]);

						if (
							typeof newArr[i] != "object" &&
							codeBlockStartIndex == 0 &&
							newArr[i].startsWith("```")
						) {
							codeBlockStartIndex = i;
							codeBlock.push(newArr[i]);
							// console.log("codeBlock=0", codeBlock);
						} else {
							if (
								typeof newArr[i] != "object" &&
								codeBlockStartIndex !== 0 &&
								newArr[i].endsWith("```")
							) {
								codeBlock.push(newArr[i]);
								// console.log("codeBlock!!!", codeBlock);
								newArr.splice(codeBlockStartIndex, codeBlock.length, codeBlock);
								// console.log("newArr", newArr);
								i = 0;
								codeBlockStartIndex = 0;
								codeBlock = [];
							} else if (
								typeof newArr[i] != "object" &&
								codeBlockStartIndex !== 0 &&
								!newArr[i].endsWith("```")
							) {
								codeBlock.push(newArr[i]);
								// console.log("codeBlock!=0", codeBlock);
							}
						}
					}
					console.log("the end", newArr);

					let x = newArr.flatMap((item) => {
						if (typeof item == "object") {
							// console.log("item", marked(item.join("\n")));
							return marked(`${item.join("\n")}`);
						}
						return marked(item);
					});
					// console.log("before join", x);
					x = x.join("");
					// console.log(x);
					document.getElementById("output").innerHTML = x;
					doMermaid();
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

				<div
					id="output"
					className="mx-auto w-[1190px]"></div>

				<table>
					<thead>
						<tr>
							<th rowSpan={2}>Year</th>
							<th colSpan={3}>2022</th>
							<th colSpan={3}>2023</th>
						</tr>
						<tr>
							<th>ha</th>
							<th>hb</th>
							<th>hc</th>
							<th>ha</th>
							<th>hb</th>
							<th>hc</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>head1</td>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>1</td>
							<td>2</td>
							<td>3</td>
						</tr>
						<tr>
							<td>head2</td>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>1</td>
							<td>2</td>
							<td>3</td>
						</tr>
						<tr>
							<td>head3</td>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>1</td>
							<td>2</td>
							<td>3</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}

export default App;
