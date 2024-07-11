const calculateStringWidth = (str, canvasCtx) => {
	return canvasCtx.measureText(str).width;
}

const growColumns = ({ parentId, state: { parentQuerySelector } }, columnConfig) => {
	const el = parentQuerySelector ?
		document.querySelector(parentQuerySelector) :
		document.getElementById(parentId);

	const totalWidth = el.clientWidth;

	let availableWidth = totalWidth;
	columnConfig.forEach(c => {
		availableWidth -= c.columnWidth;
	});

	while (availableWidth > 0.5) {
		let availableWidthBeforeGrow = availableWidth;

		columnConfig.forEach(c => {
			const { staticWidth, columnWidth, columnMaxWidth } = c;

			if (staticWidth)
				return;

			const percentageOfTotal = columnWidth / totalWidth;
			let newWidth = columnWidth + (percentageOfTotal * availableWidthBeforeGrow);
			if (columnMaxWidth !== undefined && newWidth > columnMaxWidth)
				newWidth = columnMaxWidth;

			availableWidth -= newWidth - columnWidth;

			c.columnWidth = newWidth;
		});
	}
};

const setColumnWidth = ({ state: { extraWidthPerColumn, extraWidthForSorting, maxAutoColumnSize } }, field, width) => {
	width += extraWidthPerColumn;

	if (field.canSort !== false)
		width += extraWidthForSorting;

	if (field.columnMaxWidth !== undefined)
		width = Math.min(field.columnMaxWidth, width);
	if (maxAutoColumnSize !== undefined)
		width = Math.min(maxAutoColumnSize, width);

	field.columnWidth = width;

	if (!field.columnMinWidth)
		field.columnMinWidth = 50;

	if (field.staticWidth)
		field.columnMaxWidth = width;
};

const setColumnWidths = (props, columnConfig, data, canvasCtx) => {
	const { state: { fontStyleHeader, fontStyleBody, growToFillHorizontal } } = props;

	columnConfig.forEach(c => {
		if (c.columnWidth !== undefined)
			return;

		canvasCtx.font = fontStyleHeader;
		let useWidth = calculateStringWidth(c.name, canvasCtx);

		if (data.length === 0 || typeof(data[0][c.key]) !== 'string') {
			setColumnWidth(props, c, useWidth);

			return;
		}

		data.forEach(d => {
			canvasCtx.font = fontStyleBody;
			const width = calculateStringWidth(d[c.key] + '', canvasCtx);

			if (width > useWidth) {
				useWidth = width;
			}
		});

		setColumnWidth(props, c, useWidth);
	});

	//if (growToFillHorizontal)
	//	growColumns(props, columnConfig);
};

export default setColumnWidths;
