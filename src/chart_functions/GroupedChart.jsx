import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const drawChart = async () => {
	const margin = { top: 20, right: 20, bottom: 30, left: 40 };
	const width = 960 - margin.left - margin.right;
	const height = 500 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3
		.select(".groupChart")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	//parse the data
	const data = await d3.csv("/test_data/barchart.csv", d3.autoType);
	console.log("data", data);
	const headers = data.columns;
	console.log("headers", headers);
	// List of subgroups = header of the csv files
	const subgroups = data.columns.slice(1);
	console.log("subgroups", subgroups);
	// List of groups  = value of the first column called group -> I show them on the X axis
	const groups = data.map((d) => d[headers[0]]);
	console.log("groups", groups);

	// Add X axis
	const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.3]);

	svg
		.append("g")
		.attr("transform", `translate(0,${height})`)
		.call(d3.axisBottom(x).tickSizeOuter(0));

	// Add Y axis
	const y = d3
		.scaleLinear()
		.domain([
			0,
			d3.max(data, (d) => {
				console.log(
					"d",
					d3.max(Object.values(d).filter((item) => typeof item === "number")),
				);
				return d3.max(
					Object.values(d).filter((item) => typeof item === "number"),
				);
				// return 40;
			}),
		])
		.range([height * 0.95, height * 0.05]);

	const yAxisG = svg.append("g").call(d3.axisLeft(y));
	yAxisG.selectAll("text").style("color", "pink").style("font-size", "15px");
	yAxisG.selectAll("line").style("stroke", "pink").style("stroke-width", "5px");
	yAxisG.selectAll("path").style("stroke", "pink").style("stroke-width", "5px");

	//add y axis label

	// Another scale for subgroup position?
	const xSubgroup = d3
		.scaleBand()
		.domain(subgroups)
		.range([0, x.bandwidth()])
		.padding([0.1]);

	// color palette = one color per subgroup
	const color = d3
		.scaleOrdinal()
		.domain(subgroups)
		.range(["#e41a1c", "#377eb8", "#4daf4a"]);

	// Show the bars
	svg
		.append("g")
		.selectAll("g")
		// Enter in data = loop group per group
		.data(data)
		.join("g")
		.attr("transform", (d) => `translate(${x(d[headers[0]])},0)`)
		.selectAll("rect")
		.data((d) => subgroups.map((key) => ({ key, value: d[key] })))
		.join("rect")
		.attr("x", (d) => xSubgroup(d.key))
		.attr("y", (d) => y(d.value))
		.attr("width", xSubgroup.bandwidth())
		.attr("height", (d) => height - y(d.value))
		.attr("fill", (d) => color(d.key));
};

const GroupedChart = () => {
	const [load, setLoad] = useState(false);
	useEffect(() => {
		load && drawChart();
		setLoad(true);
	}, [load]);
	return <div className="groupChart"></div>;
};

export default GroupedChart;
