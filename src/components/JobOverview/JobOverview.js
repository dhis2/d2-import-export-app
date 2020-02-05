import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Chip, Menu, MenuItem } from '@dhis2/ui-core'

import s from './JobOverview.module.css'
import { TaskContext } from '../../contexts/'
import { jsDateToString, trimString } from '../../utils/helper'
import { testIds } from '../../utils/testIds'
import { JobSummary } from '../JobSummary/'
import { DataIcon, EventIcon, GMLIcon, MetadataImportIcon } from '../Icon'

const categoryTypes = [
    {
        key: 'data',
        importType: 'DATAVALUE_IMPORT',
        icon: <DataIcon />,
        label: 'Data',
    },
    {
        key: 'event',
        importType: 'EVENT_IMPORT',
        icon: <EventIcon />,
        label: 'Event',
    },
    {
        key: 'gml',
        importType: 'GML_IMPORT',
        icon: <GMLIcon />,
        label: 'GML',
    },
    {
        key: 'metadata',
        importType: 'METADATA_IMPORT',
        icon: <MetadataImportIcon />,
        label: 'Metadata',
    },
]

const categoryTypesObj = categoryTypes.reduce((acc, cur) => {
    acc[cur.importType] = cur
    return acc
}, {})

const MenuLabel = ({ task }) => {
    return (
        <div
            className={s.MenuLabel}
            data-test={`${testIds.JobOverview.MenuLabel}-${task.id}`}
        >
            <div>
                <span>{trimString(15, task.file)}</span>
                <br />
                <span>
                    {task.completed
                        ? i18n.t('Completed')
                        : i18n.t('In progress')}{' '}
                </span>
            </div>
            <div className={s.MenuLabelDate}>
                {jsDateToString(task.created)}
            </div>
        </div>
    )
}

MenuLabel.propTypes = {
    task: PropTypes.shape({
        completed: PropTypes.bool.isRequired,
        created: PropTypes.instanceOf(Date).isRequired,
        file: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
}

const JobOverview = ({
    activeTypes,
    setActiveTypes,
    selectedJob,
    setSelectedJob,
}) => {
    const tasks = useContext(TaskContext)

    const onChipClick = key => {
        if (activeTypes.includes(key)) {
            setActiveTypes([...activeTypes].filter(k => k != key))
        } else {
            setActiveTypes([...activeTypes, key])
        }
    }

    const allTasks = categoryTypes
        .map(({ key: type }) =>
            Object.keys(tasks[type]).map(id => tasks[type][id])
        )
        .flat()
        .sort((a, b) => {
            if (a.importType > b.importType) return -1
            if (a.createdAt > b.createdAt) return -1
        })

    const filteredTasks = allTasks.filter(t =>
        activeTypes.includes(t.importType)
    )

    if (!selectedJob && allTasks.length > 0) {
        setSelectedJob(allTasks[0])
    }

    if (!selectedJob) {
        return <p>{i18n.t('No jobs started yet.')}</p>
    }

    return (
        <div className={s.container} data-test={testIds.JobOverview.container}>
            <div className={s.items} data-test={testIds.JobOverview.items}>
                <Menu className={s.Menu}>
                    <div
                        className={s.chips}
                        data-test={testIds.JobOverview.chips}
                    >
                        {categoryTypes.map(({ key, importType, label }) => (
                            <Chip
                                onClick={() => onChipClick(importType)}
                                selected={activeTypes.includes(importType)}
                                key={key}
                                data-test={`${testIds.JobOverview.chips}-${key}`}
                            >
                                {label}
                            </Chip>
                        ))}
                    </div>
                    {filteredTasks.map(t => (
                        <MenuItem
                            key={`${testIds.JobOverview.items}-${t.id}`}
                            active={selectedJob.id == t.id}
                            label={<MenuLabel task={t} />}
                            onClick={() => setSelectedJob(t)}
                            icon={categoryTypesObj[t.importType].icon}
                        />
                    ))}
                </Menu>
            </div>
            <div
                className={s.summary}
                data-test={testIds.JobOverview.JobSummary}
            >
                <JobSummary
                    task={selectedJob}
                    dataTest={testIds.JobSummary.container}
                    showDetails={false}
                />
            </div>
        </div>
    )
}

JobOverview.propTypes = {
    activeTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    setActiveTypes: PropTypes.func.isRequired,
    setSelectedJob: PropTypes.func.isRequired,
    selectedJob: PropTypes.object,
}

export { JobOverview, categoryTypes }
