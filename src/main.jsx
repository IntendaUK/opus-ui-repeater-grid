/* eslint-disable max-lines-per-function, max-lines */

//System
import ReactDOM from 'react-dom/client';

//Components
import { RepeaterGrid } from './components/repeaterGrid';

//PropSpecs
import propsRepeaterGrid from './components/repeaterGrid/props';

//Opus Lib
import Opus, { loadMdaPackage } from '@intenda/opus-ui';
import '@intenda/opus-ui-components';

const root = ReactDOM.createRoot(document.getElementById('root'));

//Test Data
const columns = 1000;
const rows = 1000;

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const getRandomString = length => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const columnLengths = Array(columns)
	.fill(0)
	.map(() => 1 + ~~(Math.random() * 9));

const columnNames = Array(columns)
	.fill(0)
	.map(i => getRandomString(columnLengths[i]));

const data = Array(rows)
	.fill(0)
	.map(() => {
		const record = {};

		for (let i = 0; i < columns; i++) {
			record[columnNames[i]] = getRandomString(columnLengths[i]);
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
					fontSize: '1.17em'
				}
			}]
		}
	}
})

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
					styleCell: {
						display: 'flex',
						alignItems: 'center',
						padding: '0px 12px',
						borderBottom: '2px solid #eee',
						fontSize: '14px',
						opacity: 0.5
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
