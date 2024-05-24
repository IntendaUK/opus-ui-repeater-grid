//Components
import { RepeaterGrid } from './components/repeaterGrid';

//PropSpecs
import propsRepeaterGrid from './components/repeaterGrid/props';

import { registerComponentTypes } from '@intenda/opus-ui';

registerComponentTypes([{
	type: 'repeaterGrid',
	component: RepeaterGrid,
	propSpec: propsRepeaterGrid
}]);
