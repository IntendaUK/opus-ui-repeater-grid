/* eslint-disable react/prop-types */

//React
import { useRef, useEffect, useCallback, useMemo } from 'react';

//Opus UI
import { createContext, Component } from '@intenda/opus-ui';

//Plugins
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';

//Internal
import { HeaderColumns } from './header';
import { calculateColumnWidths } from './events';

//Styles
import './styles.css';

//Context
const RepeaterGridContext = createContext('repeaterGrid');

//Events
const onGetData = ({ setState, state: { data, pxPerCharacter, extraColumnWidth } }) => {
	if (!data || data.length === 0)
		return;

	const formattedData = data.map(d => Object.values(d));
	const columnWidths = calculateColumnWidths(formattedData, Object.keys(data[0]), pxPerCharacter, extraColumnWidth);

	setState({
		formattedData,
		columnWidths
	});
};

//Components
const cellRendererOpus = (formattedData, traitBodyCell, { columnIndex, key, rowIndex, style }) => (
	<div
		key={key}
		style={style}
	>
		<Component mda={{
			traits: [{
				trait: traitBodyCell,
				traitPrps: {
					value: formattedData[rowIndex][columnIndex] + ''
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

//Export
export const RepeaterGrid = props => {
	const { id, getHandler, setState, state } = props;

	const { data, formattedData, columnWidths, traitHeaderCell, traitBodyCell } = state;
	const { heightCellHeader, heightCell, styleCell, styleCellHeader } = state;

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
	}, [heightCellHeader, styleCellHeader, traitHeaderCell, columnWidths]);

	const memoizedCellRenderer = useCallback(args => {
		if (traitBodyCell)
			return cellRendererOpus(formattedData, traitBodyCell, args);

		return cellRendererHtml(formattedData, styleCell, args);
	}, [traitBodyCell, formattedData, styleCell]);

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
