const buildColumnConfig = data => {
	const keys = Object.keys(data[0]);

	const columnConfig = keys.map(key => {
		const config = {
			key,
			name: key,
			type: 'string',
			//This will be set later
			columnWidth: undefined
		};

		return config;
	});

	return columnConfig;
};

export default buildColumnConfig;
