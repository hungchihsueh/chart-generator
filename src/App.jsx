// libs
import { useState, useEffect } from "react";
import * as d3 from "d3";
import { marked } from "marked";
import mammoth from "mammoth";
import mermaid from "mermaid";

// utils
import renderer from "./renderer/markedRenderer";
import * as ThemeColor from "./util/chartColors";

marked.use({ renderer });

const A4_WIDTH = 1123;
const A4_HEIGHT = 794;

function App() {
	const [theme, setTheme] = useState("lightBlue");
	async function doMermaid() {
		mermaid.initialize();
		const mermaids = document.querySelectorAll(".mermaid");
		// console.log("mermaids", mermaids);
		mermaids.forEach((m, i) => {
			let graphDefinition = m.innerText;
			mermaid.render(`graphDiv-${i}`, graphDefinition).then((svgObj) => {
				m.innerHTML = svgObj.svg;
			});
		});
	}
	async function doD3BarChart() {
		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const width = A4_WIDTH - margin.left - margin.right;
		const height = A4_HEIGHT - margin.top - margin.bottom;

		// set colors
		const colors = ThemeColor[theme]
			? ThemeColor[theme]
			: ThemeColor["lightBlue"];

		const d3BarCharts = document.querySelectorAll(".d3barchart");

		// loop through all the d3barchart divs
		d3BarCharts.forEach((d, i) => {
			d.setAttribute("id", `d3barchart${i}`);
			const dataString = d.innerText.replaceAll(" ", "\n");
			d.innerText = "";
			const svg = d3
				.select(`#d3barchart${i}`)
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);

			const data = d3.csvParse(dataString, d3.autoType);

			// List of subgroups = header of the csv files = soil condition here
			const subgroups = data.columns.slice(1);

			// List of groups = species here = value of the first column called group -> I show them on the X axis
			const groups = data.map((d) => d[data.columns[0]]);

			// Add X axis
			const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
			svg
				.append("g")
				.attr("transform", `translate(0, ${height + 3})`)
				.call(d3.axisBottom(x).tickSize(0))
				.selectAll("text")
				.style("transform", "translate(0, 10px)");

			// Add Y axis
			const y = d3
				.scaleLinear()
				.domain([
					0,
					d3.max(
						data.map((d) => {
							return d3.max(
								Object.values(d).filter((v) => typeof v == "number"),
							);
						}),
					),
				])
				.range([height, 0]);
			svg.append("g").call(d3.axisLeft(y));

			// make axis blue and thicker
			svg.selectAll("path").style("stroke", colors[0]).style("stroke-width", 5);

			svg.selectAll("line").style("stroke", colors[0]).style("stroke-width", 5);

			svg.selectAll("text").style("fill", colors[0]).style("font-size", 12);

			// Another scale for subgroup position?

			const xSubgroup = d3
				.scaleBand()
				.domain(subgroups)
				.range([0, x.bandwidth()])
				.padding([0.05]);

			// color palette = one color per subgroup

			const color = d3.scaleOrdinal().domain(subgroups).range(colors);

			// Show the bars
			svg
				.append("g")
				.selectAll("g")
				// Enter in data = loop group per group
				.data(data)
				.join("g")
				.attr("transform", (d) => {
					// console.log("d", d);
					// Object.values(d).indexOf(d[data.columns[0]]);
					return `translate(${x(d[data.columns[0]])}, 0)`;
				})
				.selectAll("rect")
				.data(function (d) {
					console.log(d);
					return subgroups.map(function (key) {
						return { key: key, value: d[key] };
					});
				})
				.join("rect")
				.attr("x", (d) => {
					return xSubgroup(d.key);
				})
				.attr("y", (d) => y(d.value))
				.attr("width", xSubgroup.bandwidth())
				.attr("height", (d) => height - y(d.value))
				.attr("fill", (d) => color(d.key))
				// round the only  corners on the top
				.attr("rx", 6)
				.attr("ry", 6);
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
				})
				.then(async () => {
					doMermaid();

					doD3BarChart();
				})
				.done();
		};

		reader.readAsArrayBuffer(file);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center py-5">
				<div className="flex items-center justify-center gap-3 mb-10">
					<input
						type="file"
						name=""
						id="fileInput"
						className="bg-gray-100 border rounded"
						onChange={(e) => {}}
					/>
					<select
						className="rounded shadow-inner"
						onChange={(e) => {
							document.getElementById("output").innerHTML = "";
							setTheme(e.target.value);
						}}
						name="theme"
						id="theme">
						<option value="lightBlue">lightBlue</option>
						<option value="forest">forest</option>
					</select>
					<button
						className="px-2 py-1 m-5 transition-all duration-150 ease-in-out bg-white border rounded shadow hover:bg-blue-500 hover:text-white"
						id="convert-button"
						onClick={() => convertToHTML()}>
						Convert to HTML
					</button>
				</div>

				<div
					id="output"
					className={`${theme} mx-auto w-[${A4_WIDTH}]  flex flex-col justify-start items-center`}></div>
			</div>
			{/* {blueTheme.map((color) => (
				<>
					<div
						className={` p-10`}
						style={{ backgroundColor: color }}>
						1
					</div>
				</>
			))} */}
		</>
	);
}

export default App;
