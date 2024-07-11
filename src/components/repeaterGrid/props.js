const props = {
    averageColumnSize: {
        type: 'decimal',
        desc: 'Defines the average column width, used for estimating the size of the scrollbar',
        internal: true
    },
    maxAutoColumnSize: {
        type: 'integer',
        desc: 'When columns are sized automatically (based on content), this is the maximum size that can be set',
        dft: 800
    },
    heightCellHeader: {
        type: 'integer',
        desc: 'The height of each header cell',
        dft: 40
    },
    columnWidths: {
        type: 'array',
        desc: 'The widths of the columns in the table',
        internal: true
    },
    data: {
        type: 'array',
        desc: 'The data to be displayed in the repeaterGrid'
    },
    traitHeaderCell: {
        type: 'string',
        desc: 'The trait that should be rendered for each cell. This trait will receive a single traitPrp: "cpt". When not specified, a plain HTML label will be rendered for each header cell',
    },
    styleCellHeader: {
        type: 'object',
        desc: 'An object defining extra style attributes to be applied to each header cell div'
    },
    growToFillHorizontal: {
        type: 'boolean',
        desc: 'When set to true, columns that do not have static or max width will grow until all horizontal space is used',
        dft: true
    },
    extraWidthPerColumn: {
        type: 'string',
        desc: 'Extra width to add to each column to account for padding',
        dft: 0
    },
    extraWidthForSorting: {
        type: 'string',
        desc: 'Extra width to add to each column if the column can be sorted to account for a sort icon',
        dft: 0
    },
    formattedData: {
        type: 'string',
        desc: 'Data that has been formatted for display',
        internal: true
    },
    traitBodyCell: {
        type: 'string',
        desc: 'The trait that should be rendered for each cell. This trait will receive a single traitPrp: "value". When not specified, a plain HTML label will be rendered for each body cell',
    },
    heightCell: {
        type: 'integer',
        desc: 'The height of each body cell',
        dft: 40
    },
    styleCell: {
        type: 'object',
        desc: 'An object defining extra style attributes to be applied to each body cell div'
    },
    fontStyleHeader: {
        type: 'string',
        desc: '',
        dft: '700 16px serif'
    },
    fontStyleBody: {
        type: 'string',
        desc: '',
        dft: '14px serif'
    },
    parentQuerySelector: {
        type: 'string',
        desc: ''
    },
    columnConfig: {
        type: 'array',
        desc: '',
        spec: [{
            name: 'Column name to be used for the header when traitHeaderCell is not defined',
            
        }]
    }
};

export default props;
