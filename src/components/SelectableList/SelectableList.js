import React, { useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputField, MenuItem, Radio } from '@dhis2/ui-core'

import { optionsPropType } from '../../utils/options'
import s from './SelectableList.module.css'

const SelectableList = ({
    label,
    name,
    selected,
    setSelected,
    list,
    multiSelect,
    withFilter,
    withActions,
    dataTest,
}) => {
    const [filter, setFilter] = useState('')

    const onSelectAll = () => {
        const all = list.map(({ value }) => value)
        setSelected(all)
    }

    const onClearAll = () => {
        setSelected([])
    }

    const onSelect = ({ value: id }) => {
        if (multiSelect) {
            const newValue = !selected.includes(id)
            if (newValue == false) {
                setSelected(selected.filter(p => p != id))
            } else {
                setSelected([...selected, id])
            }
        } else {
            setSelected([id])
        }
    }

    return (
        <div data-test={dataTest}>
            {withFilter && (
                <div className={s.filter} data-test={`${dataTest}-filter`}>
                    <InputField
                        name="filter"
                        label={label}
                        value={filter}
                        onChange={({ value }) => setFilter(value)}
                        dense
                    />
                </div>
            )}

            {withActions && (
                <div className={s.actions} data-test={`${dataTest}-actions`}>
                    <Checkbox
                        className={s.action}
                        name="select-all"
                        value="select-all"
                        label={i18n.t('Select all')}
                        onChange={onSelectAll}
                        checked
                    />
                    <Checkbox
                        className={s.action}
                        name="clear-all"
                        value="clear-all"
                        label={i18n.t('Clear all')}
                        onChange={onClearAll}
                    />
                </div>
            )}

            <div className={s.body} data-test={`${dataTest}-body`} name={name}>
                {list
                    .filter(({ label }) =>
                        label.toLowerCase().includes(filter.toLowerCase())
                    )
                    .map(({ value, label }) => {
                        const component = multiSelect ? (
                            <Checkbox
                                value={value}
                                name={value}
                                label={label}
                                checked={selected.includes(value)}
                                onChange={() => 0}
                            />
                        ) : (
                            <Radio
                                value={value}
                                name={value}
                                label={label}
                                checked={selected.includes(value)}
                                onChange={() => 0}
                            />
                        )

                        return (
                            <MenuItem
                                dataTest={`${dataTest}-body-li-${value}`}
                                key={`${dataTest}-body-li-${value}`}
                                value={value}
                                label={component}
                                onClick={onSelect}
                            />
                        )
                    })}
            </div>
        </div>
    )
}

SelectableList.propTypes = {
    dataTest: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    list: optionsPropType.isRequired,
    name: PropTypes.string.isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    setSelected: PropTypes.func.isRequired,
    multiSelect: PropTypes.bool,
    withActions: PropTypes.bool,
    withFilter: PropTypes.bool,
}

export { SelectableList }
