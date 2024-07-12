/* eslint-disable max-lines-per-function, max-lines */

//System
import ReactDOM from 'react-dom/client';

//Components
import { RepeaterGrid } from './components/repeaterGrid';

//PropSpecs
import propsRepeaterGrid from './components/repeaterGrid/props';

//Opus Lib
import Opus, { loadMdaPackage } from '@intenda/opus-ui';

const root = ReactDOM.createRoot(document.getElementById('root'));

//Test Data
const testDataConfig = {
	rows: 100,
	columns: 5,
	maxColumnCharacters: 60
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const getRandomString = length => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const columnCount = testDataConfig.columnConfig?.length ?? testDataConfig.columns;

const columnLengths = Array(columnCount)
	.fill(0)
	.map(() => 1 + ~~(Math.random() * testDataConfig.maxColumnCharacters));

const columnNames = Array(columnCount)
	.fill(0)
	.map((_, i) => {
		const key = testDataConfig.columnConfig?.[i]?.key;
		if (key)
			return key;

		return getRandomString(columnLengths[i]);
	});

const data = Array(testDataConfig.rows)
	.fill(0)
	.map(() => {
		const record = {};

		for (let i = 0; i < columnCount; i++) {
			const config = testDataConfig.columnConfig?.[i];

			let value;

			if (config?.type === 'string' || config?.type === undefined)
				value = getRandomString(columnLengths[i]);
			else if (config?.type === 'boolean')
				value = Math.random() > 0.5;

			record[columnNames[i]] = value;
		}

		return record;
	});

//Test
loadMdaPackage({
	path: 'headerCell',
	contents: {
		index: {
			acceptPrps: {},
			type: 'containerSimple',
			prps: {
				width: '100%',
				height: '100%',
				display: 'flex',
				mainAxisAlign: 'center',
				padding: true,
				paddingSize: '12px 12px',
				borderBottom: '2px solid #eee',
				dir: 'vertical',
				overflow: 'hidden'
			},
			wgts: [{
				type: 'label',
				prps: {
					cpt: '%cpt%',
					bold: true,
					fontSize: '1.17em',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',
					overflow: 'hidden'
				}
			}]
		}
	}
});

root.render(
	<Opus
		registerComponentTypes={[{
			type: 'repeaterGrid',
			component: RepeaterGrid,
			propSpec: propsRepeaterGrid
		}]}
		startupMda={{
			type: 'containerSimple',
			prps: {
				singlePage: true
			},
			wgts: [{
				type: 'repeaterGrid',
				prps: {
					data,
					parentQuerySelector: '#root',
					extraWidthPerColumn: 24,
					fontStyleHeader: '700 16px serif',
					fontStyleBody: '14px serif',
					autoColumnWidths: true,
					columnConfig: testDataConfig.columnConfig,
					styleCell: {
						padding: '10px 12px',
						borderBottom: '2px solid #eee',
						fontSize: '14px',
						opacity: 0.5,
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis'
					},
					heightCellHeader: 68,
					heightCell: 40,
					traitHeaderCell: 'headerCell/index',
					style: {
						'.cpnRepeaterGrid': {
							'.react-resizable-handle': {
								'background-image': 'none',
								transform: 'unset',
								width: '3px',
								height: '42px',
								'background-color': '#eee',
								top: '12px',
								'margin-top': 'unset'
							}
						}
					}
				}
			}]
		}}
	/>
);
