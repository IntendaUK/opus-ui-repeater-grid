//React
import { useContext, useMemo } from 'react';

//Opus UI
import { ThemedComponent, createContext } from '@intenda/opus-ui';

//Plugins
import { ResizableBox } from 'react-resizable';

//Styles
import 'react-resizable/css/styles.css';

//Context
const RepeaterGridContext = createContext('repeaterGrid');

//Components
const HeaderColumnsCustom = ({ onResize }) => {
	const { state: { heightCellHeader, columnWidths, data, traitHeaderCell, styleCellHeader } } = useContext(RepeaterGridContext);

	return columnWidths.map((width, index) => (
		<ResizableBox
			key={Object.keys(data[0])[index]}
			width={columnWidths[index]}
			height={heightCellHeader}
			axis='x'
			onResizeStop={(e, data) => onResize(index, data)}
			resizeHandles={['e']}
			minConstraints={[30, 30]}
			style={styleCellHeader}
		>
			<ThemedComponent mda={{
				traits: [{
					trait: traitHeaderCell,
					traitPrps: {
						cpt: Object.keys(data[0])[index]
					}
				}]
			}} />
		</ResizableBox>
	));
};

export const HeaderColumns = ({ onResize }) => {
	const { state: { columnWidths, data, heightCellHeader, styleCellHeader, traitHeaderCell } } = useContext(RepeaterGridContext);

	const res = useMemo(() => {
		if (traitHeaderCell)
			return <HeaderColumnsCustom onResize={onResize} />;

		return columnWidths.map((width, index) => (
			<ResizableBox
				key={Object.keys(data[0])[index]}
				width={columnWidths[index]}
				height={heightCellHeader}
				axis='x'
				onResizeStop={(e, data) => onResize(index, data)}
				resizeHandles={['e']}
				minConstraints={[30, 30]}
				style={styleCellHeader}
			>
				<span>
					{Object.keys(data[0])[index]}
				</span>
			</ResizableBox>
		));
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [traitHeaderCell, columnWidths]);

	return res;
};
