import { Given } from 'cypress-cucumber-preprocessor/steps'

Given('the following options are set', table => {
    const rows = table.rows()
    const data = rows.reduce(
        (params, [name, value, label]) => ({
            ...params,
            [name]: value,
        }),
        {}
    )

    cy.wrap(data).as('defaultData')
    cy.wrap({}).as('changedData')

    rows.forEach(([name, value, label]) => {
        cy.selectFormInput({ name, value, label })
    })
})

Given('the {string} input is set to {string}', (name, value) => {
    cy.selectFormInput({ name, value })
    cy.getAliases('@defaultData', '@changedData').then(
        ([defaultData, changedData]) => {
            const updates = {
                ...changedData,
                [name]: value,
            }

            cy.wrap(updates).as('changedData')
        }
    )
})

/**
 * Can be removed once all pages have been refactored
 */
Given(
    'the {string} input is set to {string} / {string}',
    (name, value, label) => {
        cy.selectFormInput({ name, value, label })
        cy.getAliases('@defaultData', '@changedData').then(
            ([defaultData, changedData]) => {
                const updates = {
                    ...changedData,
                    [name]: value,
                }

                cy.wrap(updates).as('changedData')
            }
        )
    }
)