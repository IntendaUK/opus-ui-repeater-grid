//Opus
import { loadApp } from '@intenda/opus-ui';

//Internals
const gateway = 'https://turaco.intenda.dev/legoz/app/gateway';
const gatewayToken = '9098A7DD-E2B4-46C5-9CA0-8A3E0647FBA7';

import '@intenda/opus-ui-components';
import './library';

//Main
const startDevApp = async () => {
	const res = await fetch('http://localhost:5000/app.json');
	const mdaPackage = await res.json();

	loadApp({
		mdaPackage,
		loadUrlParameters: true,
		config: {
			env: 'development',
			gateway,
			gatewayToken,
			dataLocations: [
				'gateway',
				'packaged'
			]
		}
	});
};

startDevApp();
