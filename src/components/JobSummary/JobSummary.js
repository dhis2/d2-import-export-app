import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Divider } from '@dhis2/ui-core'

import styles from './JobSummary.module.css'
import { jsDateToString } from '../../utils/helper'
import { Tag } from './Tag/'
import { Events } from './Events/'
import { Summary } from './Summary/'
import { Details } from './Details/'

const Header = ({ jobDetails, task, showFileDetails }) => (
    <div className={styles.header}>
        <h3 className={styles.title}>{`${i18n.t('Job summary')}`}</h3>
        {showFileDetails && (
            <span className={styles.taskDetails}>
                <span data-test="job-summary-filename">
                    {jobDetails.file.name}
                </span>{' '}
                -{' '}
                <span data-test="job-summary-date">
                    {jsDateToString(task.created)}{' '}
                </span>
            </span>
        )}
    </div>
)

Header.propTypes = {
    jobDetails: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    showFileDetails: PropTypes.bool,
}

const Tags = ({ jobDetails, task }) => (
    <div className={styles.tags} data-test="job-summary-tags">
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
)

Tags.propTypes = {
    jobDetails: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
}

const JobSummary = ({
    task,
    showFileDetails = true,
    showJobDetails = false,
    dataTest,
}) => {
    if (!task) return null
    const { jobDetails } = task

    return (
        <div className={styles.container} data-test={dataTest}>
            <Header
                jobDetails={jobDetails}
                task={task}
                showFileDetails={showFileDetails}
            />
            <Tags jobDetails={jobDetails} task={task} />
            <Divider />
            {task.completed && task.summary && (
                <Summary summary={task.summary} />
            )}
            <div className={styles.events}>
                <Events events={task.events} />
            </div>
            {showJobDetails && (
                <div className={styles.jobDetails}>
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
