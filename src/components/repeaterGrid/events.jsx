export const calculateColumnWidths = (formattedData, headings, pxPerCharacter, extraColumnWidth) => {
	const res = Array(formattedData[0].length)
		.fill(0)
		.map((_, i) => Math.max(10, headings[i]?.length ?? 0));

	formattedData.forEach(row => {
		row.forEach((cell, columnIndex) => {
			const cellWidth = (cell ?? '').toString().length;

			if (cellWidth > res[columnIndex])
				res[columnIndex] = cellWidth;
		});
	});

	res.forEach((r, i) => {
		res[i] = extraColumnWidth + (r * pxPerCharacter);
	});

	return res;
};
