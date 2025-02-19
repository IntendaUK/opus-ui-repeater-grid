/* eslint-disable react/prop-types */

//React
import { useRef, useEffect, useCallback, useMemo } from 'react';

//Opus UI
import { createContext, Component } from '@intenda/opus-ui';

//Plugins
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';

//Internal
import { HeaderColumns } from './header';
import setColumnWidths from './setColumnWidths';
import buildColumnConfig from './buildColumnConfig';

//Styles
import './styles.css';

//Context
const RepeaterGridContext = createContext('repeaterGrid');

//Events
const onGetData = props => {
	const { setState, state: { data } } = props;

	let columnConfig = props.state.columnConfig;

	if (
		!data ||
		(
			data.length === 0 &&
			!columnConfig
		)
	)
		return;

	const newState = {};

	if (!columnConfig) {
		columnConfig = buildColumnConfig(data);

		newState.columnConfig = columnConfig;
	}

	const formattedData = data.map(d => columnConfig.map(c => d[c.key]));

	const canvas = document.createElement('canvas');
	const canvasCtx = canvas.getContext('2d');

	let columnWidths;
	if (data.length > 0) {
		setColumnWidths(props, columnConfig, data, canvasCtx);
		columnWidths = columnConfig.map(c => c.columnWidth);
	} else if (columnConfig.some(c => c.columnWidth === undefined))
		columnWidths = columnConfig.map(() => 50);

	if (columnWidths !== undefined) {
		const averageColumnSize = columnWidths.reduce((a, b) => a + b, 0) / columnWidths.length;

		newState.columnWidths = columnWidths;
		newState.averageColumnSize = averageColumnSize;
	}


	newState.formattedData = formattedData;

	setState(newState);
};

//Components
const cellRendererOpus = (formattedData, traitBodyCell, { columnIndex, key, rowIndex, style }, parentId) => (
	<div
		key={key}
		style={style}
	>
		<Component mda={{
			parentId,
			traits: [{
				trait: traitBodyCell,
				traitPrps: {
					value: formattedData[rowIndex][columnIndex]
				}
			}]
		}} />
	</div>
);

const cellRendererHtml = (formattedData, styleCell, { columnIndex, key, rowIndex, style }) => (
	<div
		key={key}
		style={{
			...styleCell,
			...style
		}}
	>
		{(formattedData[rowIndex][columnIndex] ?? '') + ''}
	</div>
);

const getCells = ({ state: { id, parentId, formattedData, traitBodyCell, columnConfig, styleCell } }, args) => {
	const config = columnConfig?.[args.columnIndex];
	const traits = config?.cellTraits;

	if (traits === undefined || traits?.length === 0) {
		if (traitBodyCell)
			return cellRendererOpus(formattedData, traitBodyCell, args, parentId);

		return cellRendererHtml(formattedData, styleCell, args);
	}

	const { rowIndex, columnIndex } = args;

	const keyOuter = `${id}-${args.key}`;
	const keyInner = `${keyOuter}-inner`;

	return (
		<div
			key={keyOuter}
			style={args.style}
		>
			<Component key={keyInner} mda={{
				id: keyInner,
				parentId,
				traits: traits.map(t => {
					const res = { ...t };
					res.traitPrps.columnConfig = { ...config };
					res.traitPrps = { ...t.traitPrps };
					delete res.traitPrps.columnConfig.headerTraits;
					delete res.traitPrps.columnConfig.cellTraits;

					res.traitPrps.columnCellIndex = rowIndex;
					res.traitPrps.columnCellValue = formattedData[rowIndex][columnIndex];
					res.traitPrps.cellId = args.key;

					return res;
				})
			}} />
		</div>
	);
};

//Export
export const RepeaterGrid = props => {
	const { id, getHandler, setState, state } = props;

	const { data, formattedData, columnWidths, traitHeaderCell, traitBodyCell, columnConfig } = state;
	const { heightCellHeader, heightCell, styleCell, styleCellHeader, averageColumnSize } = state;

	const gridRef = useRef(null);
	const headerRef = useRef(null);

	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	useEffect(getHandler(onGetData), [data]);

	const onResize = useCallback((index, { size: { width } }) => {
		const newColumnWidths = [...columnWidths];
		newColumnWidths[index] = width;

		setState({ columnWidths: newColumnWidths });

		gridRef.current.recomputeGridSize();
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [columnWidths]);

	const headerColumns = useMemo(() => {
		return <HeaderColumns onResize={onResize} />;
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [heightCellHeader, styleCellHeader, traitHeaderCell, columnWidths, columnConfig]);

	const memoizedCellRenderer = useCallback(getHandler(getCells), [traitBodyCell, formattedData, styleCell]);

	const getColumnWidth = useCallback(({ index }) => columnWidths[index], [columnWidths]);

	if (!formattedData)
		return null;

	return (
		<RepeaterGridContext.Provider value={props}>
			<div id={id} className='cpnRepeaterGrid'>
				<ScrollSync>
					{({ onScroll, scrollLeft }) => (
						<AutoSizer>
							{({ width, height }) => (
								<div style={{ width }}>
									<div ref={headerRef} style={{ width }}>
										{headerColumns}
									</div>
									<Grid
										ref={gridRef}
										cellRenderer={memoizedCellRenderer}
										columnCount={columnWidths.length}
										columnWidth={getColumnWidth}
										height={height - heightCellHeader}
										estimatedColumnSize={averageColumnSize}
										rowCount={formattedData.length}
										rowHeight={heightCell}
										width={width}
										onScroll={({ scrollLeft: newScrollLeft }) => {
											onScroll({ scrollLeft: newScrollLeft });
											headerRef.current.scrollLeft = newScrollLeft
										}}
										scrollLeft={scrollLeft}
									/>
								</div>
							)}
						</AutoSizer>
					)}
				</ScrollSync>
			</div>
		</RepeaterGridContext.Provider>
	);
};
