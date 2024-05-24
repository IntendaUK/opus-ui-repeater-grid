/* eslint-disable max-lines-per-function, max-lines */

//System
import React from 'react';
import ReactDOM from 'react-dom/client';

//Components
import { RepeaterGrid } from './components/repeaterGrid';
import { Input } from './components/input';

//PropSpecs
import propsRepeaterGrid from './components/repeaterGrid/props';
import propsInput from './components/input/props';

//Opus Lib
import Opus from '@intenda/opus-ui';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
	<Opus
		registerComponentTypes={[{
			type: 'repeaterGrid',
			component: RepeaterGrid,
			propSpec: propsRepeaterGrid
		}, {
			type: 'input',
			component: Input,
			propSpec: propsInput
		}]}
		startupMda={{
			type: 'containerSimple',
			prps: {
				singlePage: true,
				mainAxisAlign: 'start',
				crossAxisAlign: 'start'
			},
			wgts: [{
				type: 'repeaterGrid',
				prps: {}
			}]
		}}
	/>
);
