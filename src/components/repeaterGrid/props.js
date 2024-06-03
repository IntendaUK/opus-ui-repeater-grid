const props = {
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
    pxPerCharacter: {
        type: 'integer',
        desc: 'Used to determine how wide each cell should be based on the longest string in each column',
        dft: 10
    },
    extraColumnWidth: {
        type: 'string',
        desc: 'Additional width to be added to columns',
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
    }
};

export default props;
