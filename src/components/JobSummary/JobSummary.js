import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Divider } from '@dhis2/ui-core'

import s from './JobSummary.module.css'
import { jsDateToString } from '../../utils/helper'
import { testIds } from '../../utils/testIds'
import { Tag } from './Tag/'
import { Events } from './Events/'
import { Summary } from './Summary/'
import { Details } from './Details/'

const JobSummary = ({
    task,
    showFileDetails = true,
    showJobDetails = false,
    dataTest,
}) => {
    if (!task) return null
    const { jobDetails } = task

    return (
        <div className={s.container} data-test={dataTest}>
            <div className={s.header}>
                <h3 className={s.title}>{`${i18n.t('Job summary')}`}</h3>
                {showFileDetails && (
                    <span className={s.taskDetails}>
                        <span data-test={testIds.JobSummary.filename}>
                            {jobDetails.file.name}
                        </span>{' '}
                        -{' '}
                        <span data-test={testIds.JobSummary.date}>
                            {jsDateToString(task.created)}{' '}
                        </span>
                    </span>
                )}
            </div>
            <div className={s.tags} data-test={testIds.JobSummary.tags}>
                {task.completed ? (
                    <Tag success text={i18n.t('Completed')} />
                ) : (
                    <Tag text={i18n.t('In progress')} />
                )}
                {task.error && <Tag error text={i18n.t('Error')} />}
                {task.summary && task.summary.conflicts && (
                    <Tag warning text={i18n.t('Conflicts')} />
                )}
                {jobDetails.dryRun && <Tag info text={i18n.t('Dry run')} />}
            </div>
            <Divider />
            {task.completed && task.summary && (
                <Summary summary={task.summary} />
            )}
            <div className={s.events}>
                <Events events={task.events} />
            </div>
            {showJobDetails && (
                <div className={s.jobDetails}>
                    <Details details={task.jobDetails} />
                </div>
            )}
        </div>
    )
}

JobSummary.propTypes = {
    dataTest: PropTypes.string.isRequired,
    showFileDetails: PropTypes.bool,
    showJobDetails: PropTypes.bool,
    task: PropTypes.object,
}

export { JobSummary }
