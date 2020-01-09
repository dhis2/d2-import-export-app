import { useField } from 'react-final-form'
import { SelectField } from '@dhis2/ui-core'
import React from 'react'
import propTypes from 'prop-types'

export const Select = ({
    label,
    name,
    options,
    resetOnUnmount,
    defaultValue,
    dataTest,
}) => {
    const { input } = useField(name, {
        type: 'select',
        defaultValue: defaultValue,
        allowNull: true,
        parse: value => (value === '' ? null : value),
    })

    return (
        <div data-test={dataTest}>
            <SelectField
                {...input}
                value={input.value || ''}
                label={label}
                outlined
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </SelectField>
        </div>
    )
}

Select.propTypes = {
    label: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    options: propTypes.arrayOf(
        propTypes.shape({
            value: propTypes.string,
            label: propTypes.string.isRequired,
        })
    ).isRequired,

    defaultValue: propTypes.string,
}
