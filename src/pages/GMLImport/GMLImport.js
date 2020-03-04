import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'

import { getPrevJobDetails, uploadFile } from '../../utils/helper'
import { Page } from '../../components/Page'
import { FileUpload } from '../../components/FileUpload'
import { ImportButtonStrip } from '../../components/ImportButtonStrip'
import { FormAlerts } from '../../components/FormAlerts'
import { GMLIcon } from '../../components/Icon'
import { TaskContext, getNewestTask } from '../../contexts/'

const createInitialState = prevJobDetails => ({
    file: prevJobDetails.file,
})

const GMLImport = ({ query }) => {
    const {
        tasks: { gml: gmlTasks },
        addTask,
    } = useContext(TaskContext)

    // recreating a previously run job
    const prevJobDetails = getPrevJobDetails(query, gmlTasks)
    const initialState = createInitialState(prevJobDetails)

    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState(initialState.file)
    const [alerts, setAlerts] = useState([])
    const [showFullSummaryTask, setShowFullSummaryTask] = useState(false)
    const { baseUrl } = useConfig()

    const onImport = ({ dryRun }) => {
        // validate
        const alerts = []
        const timestamp = new Date().getTime()

        setAlerts(alerts)

        if (!file) {
            alerts.push({
                id: `file-${timestamp}`,
                warning: true,
                message: i18n.t('An import file must be selected'),
            })
        }

        if (alerts.length != 0) {
            return
        }

        // send xhr
        const apiBaseUrl = `${baseUrl}/api/`
        const endpoint = 'metadata/gml.json'
        const params = [`dryRun=${dryRun}`, 'format=json'].join('&')
        const url = `${apiBaseUrl}${endpoint}?${params}`

        const jobDetails = {
            file,
            dryRun,
        }

        uploadFile({
            url,
            file,
            format: 'gml',
            type: 'GML_IMPORT',
            setProgress,
            setAlerts,
            addEntry: (id, entry) =>
                addTask('gml', id, { ...entry, jobDetails: jobDetails }),
        })
        setShowFullSummaryTask(true)
    }

    return (
        <Page
            title={PAGE_NAME}
            desc={PAGE_DESCRIPTION}
            icon={PAGE_ICON}
            loading={progress}
            dataTest="page-import-gml"
            summaryTask={getNewestTask(gmlTasks)}
            showFullSummaryTask={showFullSummaryTask}
        >
            <FileUpload
                name="upload"
                file={file}
                setFile={setFile}
                dataTest="input-file-upload"
            />
            <ImportButtonStrip
                onImport={onImport}
                dryRunDataTest="input-dry-run"
                importDataTest="input-import-submit"
                dataTest="input-import-button-strip"
            />
            <FormAlerts alerts={alerts} dataTest="input-form-alerts" />
        </Page>
    )
}

GMLImport.propTypes = {
    query: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
}

// PAGE INFO
const PAGE_NAME = i18n.t('GML import')
const PAGE_DESCRIPTION = i18n.t(
    'Import geographic data for organisation units using the GML format. GML is an XML grammar for expressing geographical features.'
)
const PAGE_ICON = <GMLIcon />

export { GMLImport }
