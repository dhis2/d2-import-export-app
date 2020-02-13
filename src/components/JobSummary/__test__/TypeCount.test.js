import React from 'react'
import { render } from 'test-utils'
import '@testing-library/jest-dom/extend-expect'

import { TypeCount } from '../TypeCount'

const props = {
    stats: [
        {
            type: 'DefaultGmlImportService',
            created: 1,
            deleted: 2,
            ignored: 3,
            updated: 4,
            total: 10,
        },
        {
            type: 'SndGmlImportService',
            created: 1,
            deleted: 2,
            ignored: 3,
            updated: 4,
            total: 10,
        },
    ],
}

it(`matches snapshot`, () => {
    const { asFragment } = render(<TypeCount {...props} />)
    expect(asFragment()).toMatchSnapshot()
})
