import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Help } from '@dhis2/ui-core'

import styles from './ImportButtonStrip.module.css'
import { helpText } from '../../utils/text'

const ImportButtonStrip = ({
    dryRunDataTest,
    importDataTest,
    form,
    dataTest,
}) => {
    return (
        <div data-test={dataTest}>
            <ButtonStrip dataTest={`${dataTest}-button-strip`}>
                <Button
                    primary
                    type="submit"
                    onClick={() => form.change('dryRun', true)}
                    dataTest={dryRunDataTest}
                    className={styles.dryRun}
                >
                    {i18n.t('Dry run')}
                </Button>
                <Button
                    secondary
                    type="submit"
                    onClick={() => form.change('dryRun', false)}
                    dataTest={importDataTest}
                >
                    {i18n.t('Import')}
                </Button>
            </ButtonStrip>
            <Help dataTest={`${dataTest}-help`}>{`${i18n.t('Dry run')}: ${
                helpText.dryRun
            }`}</Help>
        </div>
    )
}

ImportButtonStrip.propTypes = {
    dataTest: PropTypes.string.isRequired,
    dryRunDataTest: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    importDataTest: PropTypes.string.isRequired,
}

export { ImportButtonStrip }
