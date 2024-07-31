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
	const { state: { parentId, heightCellHeader, columnWidths, data, traitHeaderCell, styleCellHeader, columnConfig } } = useContext(RepeaterGridContext);

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
				parentId,
				traits: [{
					trait: traitHeaderCell,
					traitPrps: {
						cpt: columnConfig[index].name
					}
				}]
			}} />
		</ResizableBox>
	));
};

export const HeaderColumns = ({ onResize }) => {
	const { state: { parentId, columnWidths, heightCellHeader, styleCellHeader, traitHeaderCell, columnConfig } } = useContext(RepeaterGridContext);

	const res = useMemo(() => {
		if (traitHeaderCell)
			return <HeaderColumnsCustom onResize={onResize} />;

		return columnConfig.map((config, index) => {
			let inner = null;

			const traits = config?.headerTraits;

			if (traits === undefined || traits.length === 0) {
				inner = (
					<span>
						{columnConfig[index].name}
					</span>
				);
			} else {
				inner = (
					<ThemedComponent mda={{
						parentId,
						traits: traits.map((t, i) => {
							const res = { ...t };
							res.traitPrps.columnIndex = i;
							res.traitPrps.columnConfig = { ... config };
							delete res.traitPrps.columnConfig.headerTraits;
							delete res.traitPrps.columnConfig.cellTraits;

							return res;
						})
					}} />
				)
			}
			
			return (
				<ResizableBox
					key={columnConfig[index].name}
					width={columnWidths[index]}
					height={heightCellHeader}
					axis='x'
					onResizeStop={(e, data) => onResize(index, data)}
					resizeHandles={['e']}
					minConstraints={[30, 30]}
					style={styleCellHeader}
				>
					{inner}
				</ResizableBox>
			);
		});
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [traitHeaderCell, columnWidths, columnConfig]);

	return res;
};
