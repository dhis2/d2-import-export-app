import React from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Form } from '@dhis2/ui-forms'

import {
    Format,
    formatJsonpOptions,
    defaultFormatOption,
    OrgUnitTree,
    OrgUnitMode,
    defaultOrgUnitSelectionModeOption,
    TEITypeFilter,
    defaultTEITypeFilterOption,
    ProgramStatus,
    defaultProgramStatusOption,
    FollowUpStatus,
    defaultFollowUpStatusOption,
    ProgramStartDate,
    ProgramEndDate,
    ProgramPicker,
    TETypePicker,
    Compression,
    defaultCompressionOption,
    LastUpdatedFilter,
    defaultLastUpdatedFilterOption,
    LastUpdatedStartDate,
    LastUpdatedEndDate,
    LastUpdatedDuration,
    AssignedUserMode,
    defaultAssignedUserModeOption,
    UserPicker,
    IncludeDeleted,
    IncludeAllAttributes,
    DataElementIdScheme,
    defaultDataElementIdSchemeOption,
    EventIdScheme,
    defaultEventIdSchemeOption,
    IdScheme,
    defaultIdSchemeOption,
    OrgUnitIdScheme,
    defaultOrgUnitIdSchemeOption,
    ExportButton,
    FormAlerts,
} from '../../components/Inputs/index'
import { Page, MoreOptions, TEIIcon } from '../../components/index'
import { onExport, validate } from './form-helper'

// PAGE INFO
const PAGE_NAME = i18n.t('Tracked entity instances export')
const PAGE_DESCRIPTION = i18n.t(
    'Export tracked entity instances in the XML, JSON, JSONP or CSV format.'
)
const PAGE_ICON = <TEIIcon />

const initialValues = {
    selectedOrgUnits: [],
    selectedPrograms: [],
    selectedTETypes: [],
    selectedUsers: [],
    format: defaultFormatOption,
    ouMode: defaultOrgUnitSelectionModeOption,
    teiTypeFilter: defaultTEITypeFilterOption,
    programStatus: defaultProgramStatusOption,
    followUpStatus: defaultFollowUpStatusOption,
    programStartDate: '',
    programEndDate: '',
    compression: defaultCompressionOption,
    lastUpdatedFilter: defaultLastUpdatedFilterOption,
    lastUpdatedStartDate: '',
    lastUpdatedEndDate: '',
    lastUpdatedDuration: '',
    assignedUserMode: defaultAssignedUserModeOption,
    includeDeleted: false,
    includeAllAttributes: false,
    dataElementIdScheme: defaultDataElementIdSchemeOption,
    eventIdScheme: defaultEventIdSchemeOption,
    orgUnitIdScheme: defaultOrgUnitIdSchemeOption,
    idScheme: defaultIdSchemeOption,
}

const TEIExport = () => {
    const engine = useDataEngine()
    const onSubmit = onExport(engine)

    return (
        <Page
            title={PAGE_NAME}
            desc={PAGE_DESCRIPTION}
            icon={PAGE_ICON}
            dataTest="page-export-tei"
        >
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                subscription={{ values: true, submitError: true }}
                render={({ handleSubmit, form, values, submitError }) => {
                    const showProgramFilters =
                        values.teiTypeFilter.value == 'PROGRAM'
                    const showTEFilters = values.teiTypeFilter.value == 'TE'
                    const showLUDates = values.lastUpdatedFilter.value == 'DATE'
                    const showLUDuration =
                        values.lastUpdatedFilter.value == 'DURATION'
                    const showUserPicker =
                        values.assignedUserMode.value == 'PROVIDED'

                    return (
                        <form onSubmit={handleSubmit}>
                            <OrgUnitTree />
                            <OrgUnitMode />
                            <TEITypeFilter />
                            <ProgramPicker show={showProgramFilters} />
                            <ProgramStatus show={showProgramFilters} />
                            <FollowUpStatus show={showProgramFilters} />
                            <ProgramStartDate show={showProgramFilters} />
                            <ProgramEndDate show={showProgramFilters} />
                            <TETypePicker show={showTEFilters} />
                            <Format availableFormats={formatJsonpOptions} />
                            <Compression />
                            <MoreOptions>
                                <LastUpdatedFilter />
                                <LastUpdatedStartDate show={showLUDates} />
                                <LastUpdatedEndDate show={showLUDates} />
                                <LastUpdatedDuration show={showLUDuration} />
                                <AssignedUserMode />
                                <UserPicker show={showUserPicker} />
                                <IncludeDeleted />
                                <IncludeAllAttributes />
                                <DataElementIdScheme />
                                <EventIdScheme />
                                <OrgUnitIdScheme />
                                <IdScheme />
                            </MoreOptions>
                            <ExportButton />
                            <FormAlerts alerts={submitError} />
                        </form>
                    )
                }}
            />
        </Page>
    )
}

export { TEIExport }