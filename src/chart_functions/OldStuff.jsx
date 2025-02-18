	input form
				<div className="p-5 ">
					{/* file upload */}

					<div className="flex items-center justify-center gap-5 p-5">
						<h2>上傳檔案</h2>
						{/* accept only csv */}
						<input
							type="file"
							name="csvFile"
							id="csvFile"
							accept=".csv"
							onChange={(e) => {
								setFile(e.target.files[0]);
								// const reader = new FileReader();
								// reader.d3
								// 	.csv(e.target.files[0])
								// 	.then((d) => console.log("dapp", d));
							}}
						/>
					</div>
					{/* chart */}
					<h2>圖表長寬</h2>
					<div className="flex items-center justify-center gap-5 p-5">
						<fieldset>
							<label
								htmlFor="chartWidth"
								className="mr-1">
								Width:
							</label>
							<input
								type="number"
								id="chartWidth"
								name="chartWidth"
								onChange={(e) => {
									setChartConfig((prev) => ({
										...prev,
										width: parseInt(e.target.value),
									}));
								}}
							/>
						</fieldset>
						<fieldset>
							<label
								htmlFor="chartHeight"
								className="mr-1">
								Height:
							</label>
							<input
								type="number"
								id="chartHeight"
								name="chartHeight"
								onChange={(e) => {
									setChartConfig((prev) => ({
										...prev,
										height: parseInt(e.target.value),
									}));
								}}
							/>
						</fieldset>
					</div>
					{/* bar */}
					<h2>
						長條圖顏色（若數量低於組數，循環使用顏色，高於組數則依照順序使用顏色）
					</h2>
					<div className="flex items-center justify-center gap-5 p-5">
						<input
							type="color"
							value={selectedColor}
							className="block w-10 aspect-video"
							onChange={(e) => {
								console.log(e.target.value);
								setSelectedColor(e.target.value);
							}}
						/>
						<button
							onClick={() => {
								selectedColor != "" &&
									setChartConfig((prev) => ({
										...prev,
										barColors: [...prev.barColors, selectedColor],
									}));
								setSelectedColor("");
							}}
							type="button"
							className="px-3 py-1 text-white bg-blue-500">
							新增顏色
						</button>
					</div>
					<div className="flex items-center justify-start gap-1 mb-5">
						{chartConfig.barColors.map((color, i) => (
							<div
								className="flex items-center justify-center gap-2"
								key={i}>
								<div
									style={{ backgroundColor: color }}
									className="px-3 py-1 rounded-md">
									{color}
								</div>
								<button
									onClick={() => {
										setChartConfig((prev) => ({
											...prev,
											barColors: [
												...prev.barColors.filter((item) => item != color),
											],
										}));
									}}>
									x
								</button>
							</div>
						))}
					</div>
					{/* axis setting */}
					<h2>xy軸設定</h2>
					<div className="flex items-center justify-center gap-5 p-5">
						<fieldset className="flex items-center justify-center">
							<label htmlFor="axisColor">軸體顏色</label>
							<input
								type="color"
								name="axisColor"
								className="w-10"
								id="axisColor"
								onChange={(e) => {
									setChartConfig((prev) => ({
										...prev,
										axisColor: e.target.value,
									}));
								}}
							/>
						</fieldset>
						<fieldset className="flex items-center justify-center">
							<label htmlFor="axisWidth">軸體寬度</label>
							<input
								type="number"
								name="axisWidth"
								id="axisWidth"
								onChange={(e) => {
									setChartConfig((prev) => ({
										...prev,
										axisWidth: e.target.value,
									}));
								}}
							/>
						</fieldset>
						{/* <fieldset className="flex items-center justify-center">
							<label htmlFor="axisFont">軸體寬度</label>
							<input
								type="number"
								name="axisFont"
								id="axisFont"
							/>
						</fieldset> */}
					</div>
				</div>
				{/* <GroupedChart
					data={parsedFile}
					axisWidth={chartConfig.axisWidth}
					axisColor={chartConfig.axisColor}
					barColors={chartConfig.barColors}
					width={chartConfig.width}
					height={chartConfig.height}
				/> */}