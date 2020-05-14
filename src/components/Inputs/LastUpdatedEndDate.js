import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { composeValidators } from '@dhis2/ui-forms'
import { DatePickerField } from '../'
import { OPTIONAL_DATE_VALIDATOR } from '../DatePicker/DatePickerField'

const NAME = 'lastUpdatedEndDate'
const DATATEST = 'input-last-updated-end-date'
const LABEL = i18n.t('Last updated end date')
const VALIDATOR = composeValidators(OPTIONAL_DATE_VALIDATOR)

const LastUpdatedEndDate = () => (
    <DatePickerField
        name={NAME}
        validator={VALIDATOR}
        label={LABEL}
        dataTest={DATATEST}
    />
)

export { LastUpdatedEndDate }
