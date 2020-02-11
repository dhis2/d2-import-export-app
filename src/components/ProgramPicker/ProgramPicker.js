import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader } from '@dhis2/ui-core'

import { SelectableList } from '../SelectableList'
import { FormField } from '../FormField'
import s from './ProgramPicker.module.css'

const programQuery = {
    programs: {
        resource: 'programs',
        params: {
            fields: 'id,displayName',
            paging: 'false',
        },
    },
}

const ProgramPicker = ({
    selected,
    setSelected,
    dataTest,
    multiSelect = true,
    withFilter = true,
    withActions = true,
    autoSelectFirst = false,
}) => {
    const [list, setList] = useState([])
    const { loading, data } = useDataQuery(programQuery, {
        onComplete: data => {
            const programs = data.programs.programs
            const list = programs.map(({ id, displayName }) => ({
                value: id,
                label: displayName,
            }))
            setList(list)

            if (autoSelectFirst) {
                setSelected([list[0].value])
            }
        },
        onError: error => {
            console.error('ProgramPicker error: ', error)
        },
    })

    const onSelect = id => {
        if (multiSelect) {
            const newValue = !selected.includes(id)
            if (newValue == false) {
                setSelected(selected => selected.filter(p => p != id))
            } else {
                setSelected(selected => [...selected, id])
            }
        } else {
            setSelected([id])
        }
    }

    const onSelectAll = () => {
        const all = list.map(({ value }) => value)
        setSelected(all)
    }

    const onClearAll = () => {
        setSelected([])
    }

    return (
        <FormField label={i18n.t('Programs')} dataTest={dataTest}>
            <div className={s.container}>
                {loading && <CircularLoader />}
                {data && (
                    <SelectableList
                        name="programPicker"
                        label={i18n.t('Filter programs by name')}
                        selected={selected}
                        select={onSelect}
                        onSelectAll={onSelectAll}
                        onClearAll={onClearAll}
                        multiSelect={multiSelect}
                        list={list}
                        withFilter={withFilter}
                        withActions={withActions}
                    />
                )}
            </div>
        </FormField>
    )
}

ProgramPicker.propTypes = {
    dataTest: PropTypes.string.isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    setSelected: PropTypes.func.isRequired,
    autoSelectFirst: PropTypes.bool,
    multiSelect: PropTypes.bool,
    withActions: PropTypes.bool,
    withFilter: PropTypes.bool,
}

export { ProgramPicker }
