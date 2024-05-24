import { useState, useRef } from 'react';

import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';

import { ResizableBox } from 'react-resizable';

import 'react-resizable/css/styles.css';
import 'react-virtualized/styles.css';
import './styles.css';

import { Component } from '@intenda/opus-ui';

import data from './data.json';

const list = data.map(d => Object.values(d));

// Calculate the maximum width of each column
const calculateColumnWidths = (list) => {
	const maxColumnWidths = Array(list[0].length).fill(0);

	list.forEach(row => {
		row.forEach((cell, columnIndex) => {
			const cellWidth = Math.max(cell.toString().length, Object.keys(list[0])[columnIndex].length, 10) * 10; // Estimate width based on character length
			if (cellWidth > maxColumnWidths[columnIndex]) {
				maxColumnWidths[columnIndex] = cellWidth;
			}
		});
	});

	return maxColumnWidths;
};

const initialColumnWidths = calculateColumnWidths(list);

const cellRenderer = ({ columnIndex, key, rowIndex, style }) => (
	<div
		key={key}
		style={{
			...style,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			border: '1px solid #ddd',
			backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#f7f7f7',
		}}
	>
		<Component mda={{
			type: 'input',
			prps: {
				value: list[rowIndex][columnIndex] + ''
			}
		}} />
	</div>
);

export const RepeaterGrid = () => {
	const [columnWidths, setColumnWidths] = useState(initialColumnWidths);
	const gridRef = useRef(null);
	const headerRef = useRef(null);

	const handleResize = (index, { size: { width } }) => {
		const newColumnWidths = [...columnWidths];
		newColumnWidths[index] = width;
		setColumnWidths(newColumnWidths);

		gridRef.current.recomputeGridSize();
	};

	return (
		<ScrollSync>
			{({ onScroll, scrollLeft }) => (
				<AutoSizer>
					{({ width, height }) => (
						<div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', width }}>
							<div ref={headerRef} style={{ display: 'flex', flexDirection: 'row', width, overflow: 'hidden' }}>
								{columnWidths.map((width, index) => (
									<ResizableBox
										key={Object.keys(data[0])[index]}
										width={columnWidths[index]}
										height={30}
										axis='x'
										onResizeStop={(e, data) => handleResize(index, data)}
										resizeHandles={['e']}
										minConstraints={[30, 30]}
										style={{ flexShrink: 0}}
									>
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ddd' }}>
											{Object.keys(data[0])[index]}
										</div>
									</ResizableBox>
								))}
							</div>
							<Grid
								ref={gridRef}
								cellRenderer={cellRenderer}
								columnCount={columnWidths.length}
								columnWidth={({ index }) => columnWidths[index]}
								height={height - 30}
								rowCount={list.length}
								rowHeight={30}
								width={width}
								onScroll={({ scrollLeft }) => {
                                    onScroll({ scrollLeft });
                                    headerRef.current.scrollLeft = scrollLeft
                                }}
								scrollLeft={scrollLeft}
							/>
						</div>
					)}
				</AutoSizer>
			)}
		</ScrollSync>
	);
};
