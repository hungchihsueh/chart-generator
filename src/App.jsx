import { useState } from "react";
import GroupedChart from "./chart_functions/GroupedChart";
import "./App.css";

function App() {
	return (
		<>
			<div className="flex justify-center items-center">
				<GroupedChart />
			</div>
		</>
	);
}

export default App;
