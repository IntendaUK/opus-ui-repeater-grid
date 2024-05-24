/* eslint-disable max-len */

const props = {
	language: {
		type: 'string',
		desc: 'Unused for now...',
		dft: 'json'
	},
	value: {
		type: 'string',
		desc: 'The value of the input',
		dft: ''
	},
	valueObj: {
		type: 'object',
		desc: 'An object to be stringified and used as the \'value\' state'
	},
	prettyPrint: {
		type: 'boolean',
		desc: 'When set to true, code highlighting will be enabled',
		dft: false
	},
	lint: {
		type: 'boolean',
		desc: 'When set to true, the code will be formatted',
		dft: false
	},
	styleEditor: {
		type: 'object',
		internal: true,
		desc: 'Styles to be applied to the editor textarea. In the future, these will likely be editable but for now, they need to sync up exactly with values in the stylesheet',
		dft: () => ({
			fontSize: 14,
			minHeight: '100%',
			fontFamily: 'monospace',
			lineHeight: 1.3
		})
	}
};

export default props;
