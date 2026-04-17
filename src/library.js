//Components
import { RepeaterGrid } from './components/repeaterGrid';

//PropSpecs
import propsRepeaterGrid from './components/repeaterGrid/props';

import { registerComponentTypes } from '@intenda/opus-ui';

//Components
export * from './libraryComponents';

registerComponentTypes([{
	type: 'repeaterGrid',
	component: RepeaterGrid,
	propSpec: propsRepeaterGrid
}]);
