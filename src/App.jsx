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
marked.use({ renderer });
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
					console.log(sections);
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
							console.log("codeBlock=0", codeBlock);
						} else {
							if (
								typeof newArr[i] != "object" &&
								codeBlockStartIndex !== 0 &&
								newArr[i].endsWith("```")
							) {
								codeBlock.push(newArr[i]);
								console.log("codeBlock!!!", codeBlock);
								newArr.splice(codeBlockStartIndex, codeBlock.length, codeBlock);
								console.log("newArr", newArr);
								i = 0;
								codeBlockStartIndex = 0;
								codeBlock = [];
							} else if (
								typeof newArr[i] != "object" &&
								codeBlockStartIndex !== 0 &&
								!newArr[i].endsWith("```")
							) {
								codeBlock.push(newArr[i]);
								console.log("codeBlock!=0", codeBlock);
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
				<button
					onClick={() => {
						marked.use({ renderer });
						let asd = [
							"# 標題",
							"本集團以「成為國際永續標竿企業，積極為後代推動更好的未來」為願景，面對人類本世紀最大挑戰之一的氣候變...候風險並採取積極策略，發揮資金提供者與管理者的影響力，驅動價值鏈低碳轉型，朝向淨零碳排的最終目標。",
							"本報告書透過以下四面向闡述本集團氣候相關風險與機會管理作為，以展現本集團對於氣候變遷減緩與調適之承諾。",
							"```talk",
							"# some heading",
							"# some heading 2",
							"paragraph1",
							"paragraph2asdfklhjjjjlljjjjjjjjjjjjjjjjjjjjjjjjllj…dhfkjsdnf,mn,mnvxc,mnvxcm,vnxcm,nwehfkjwhfwkejfhw",
							"paragraph3",
							"![](https://images.unsplash.com/photo-168537186362…DB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80)",
							"```",
							"random sutff",
							"```www",
							"# some heading123",
							"# some heading 1242",
							"paragraph13423",
							"paragraph2asdfklhjjjjlljjjjjjjjjjjjjjjjjjjjjjjjllj…dhfkjsdnf,mn,mnvxc,mnvxcm,vnxcm,nwehfkjwhfwkejfhw",
							"paragraph233",
							"![](https://images.unsplash.com/photo-168537186362…DB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=99980)",
							"```",
						];
						let newArr = [...asd];
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
								console.log("codeBlock=0", codeBlock);
							} else {
								if (
									typeof newArr[i] != "object" &&
									codeBlockStartIndex !== 0 &&
									newArr[i].endsWith("```")
								) {
									codeBlock.push(newArr[i]);
									console.log("codeBlock!!!", codeBlock);
									newArr.splice(
										codeBlockStartIndex,
										codeBlock.length,
										codeBlock,
									);
									console.log("newArr", newArr);
									i = 0;
									codeBlockStartIndex = 0;
									codeBlock = [];
								} else if (
									typeof newArr[i] != "object" &&
									codeBlockStartIndex !== 0 &&
									!newArr[i].endsWith("```")
								) {
									codeBlock.push(newArr[i]);
									console.log("codeBlock!=0", codeBlock);
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
					}}>
					test
				</button>
				<div
					id="output"
					className="container"></div>
			</div>
		</>
	);
}

export default App;
