import React, { useContext, useEffect, useState } from 'react';
import { useConfig, useDataEngine, useDataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui-core';

import s from './MetadataImport.module.css';
import { metadataImportPage as p } from '../../utils/pages';
import { uploadFile } from '../../utils/helper';
import { helpText } from '../../utils/text';
import {
    formatOptions,
    identifierOptions,
    importReportModeOptions,
    preheatModeOptions,
    importStrategyOptions,
    atomicModeOptions,
    mergeModeOptions,
    flushModeOptions,
    inclusionStrategyOptions,
    defaultFormatOption,
    defaultIdentifierOption,
    defaultImportReportModeOption,
    defaultPreheatModeOption,
    defaultImportStrategyOption,
    defaultAtomicModeOption,
    defaultMergeModeOption,
    defaultFlushModeOption,
    defaultInclusionStrategyOption,
} from '../../utils/options';
import { Page } from '../../components/Page';
import { FileUpload } from '../../components/FileUpload';
import { RadioGroup } from '../../components/RadioGroup';
import { Switch } from '../../components/Switch';
import { Select } from '../../components/Select';
import { MoreOptions } from '../../components/MoreOptions';
import { FormAlerts } from '../../components/FormAlerts';
import { TaskContext } from '../../contexts/';

const classKeyQuery = {
    keys: {
        resource: 'metadata/csvImportClasses',
    },
};

const today = new Date();

const MetadataImport = () => {
    const { data: classData, loading: classLoading, error } = useDataQuery(
        classKeyQuery
    );
    const { data, addTask } = useContext(TaskContext);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(undefined);
    const [format, setFormat] = useState(defaultFormatOption);
    const [dryRun, setDryRun] = useState(false);
    const [identifier, setIdentifier] = useState(defaultIdentifierOption);
    const [importReportMode, setImportReportMode] = useState(
        defaultImportReportModeOption
    );
    const [preheatMode, setPreheatMode] = useState(defaultPreheatModeOption);
    const [importStrategy, setImportStrategy] = useState(
        defaultImportStrategyOption
    );
    const [firstRowIsHeader, setFirstRowIsHeader] = useState(false);
    const [classKeyOptions, setClassKeyOptions] = useState([]);
    const [classKey, setClassKey] = useState(undefined);
    const [atomicMode, setAtomicMode] = useState(defaultAtomicModeOption);
    const [mergeMode, setMergeMode] = useState(defaultMergeModeOption);
    const [flushMode, setFlushMode] = useState(defaultFlushModeOption);
    const [inclusionStrategy, setInclusionStrategy] = useState(
        defaultInclusionStrategyOption
    );
    const [skipSharing, setSkipSharing] = useState(false);
    const [skipValidation, setSkipValidation] = useState(false);
    const [async, setAsync] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const { baseUrl } = useConfig();

    useEffect(() => {
        if (classData) {
            setClassKeyOptions(
                classData.keys.map(k => ({ value: k, label: k }))
            );
            setClassKey({ value: classData.keys[0], label: classData.keys[0] });
        }
    }, [classData]);

    const onImport = () => {
        // validate
        let alerts = [];
        const timestamp = new Date().getTime();

        setAlerts(alerts);

        if (!file) {
            alerts.push({
                id: `file-${timestamp}`,
                warning: true,
                message: i18n.t('An import file must be selected'),
            });
        }

        if (alerts.length != 0) {
            return;
        }

        // send xhr
        const apiBaseUrl = `${baseUrl}/api/`;
        const endpoint = 'metadata.json';
        const params = [
            `dryRun=${dryRun}`,
            `importMode=${dryRun ? 'VALIDATE' : 'COMMIT'}`,
            `identifier=${identifier}`,
            `importReportMode=${importReportMode.value}`,
            `preheatMode=${preheatMode.value}`,
            `importStrategy=${importStrategy.value}`,
            `atomicMode=${atomicMode.value}`,
            `mergeMode=${mergeMode.value}`,
            `flushMode=${flushMode.value}`,
            `skipSharing=${skipSharing}`,
            `skipValidation=${skipValidation}`,
            `inclusionStrategy=${inclusionStrategy.value}`,
            `async=${async}`,
            'format=json',
            ...[
                format.value == 'csv'
                    ? [
                          `firstRowIsHeader=${firstRowIsHeader}`,
                          `classKey=${classKey.value}`,
                      ]
                    : [],
            ],
        ].join('&');
        const url = `${apiBaseUrl}${endpoint}?${params}`;

        uploadFile(
            url,
            file,
            format.value,
            'METADATA_IMPORT',
            setLoading,
            setAlerts,
            (id, entry) => addTask('metadata', id, entry)
        );
    };

    return (
        <Page
            title={p.name}
            desc={p.description}
            icon={p.icon}
            loading={loading}
        >
            <FileUpload name="upload" file={file} setFile={setFile} />
            <RadioGroup
                name="format"
                label={i18n.t('Format')}
                options={formatOptions}
                setValue={setFormat}
                checked={format}
            />
            <Switch
                name="dryRun"
                label={i18n.t('Dry run')}
                checked={dryRun}
                setChecked={setDryRun}
                help={helpText.dryRun}
            />
            {format.value == 'csv' && (
                <>
                    <Switch
                        name="firstRowIsHeader"
                        label={i18n.t('First row is header')}
                        checked={firstRowIsHeader}
                        setChecked={setFirstRowIsHeader}
                    />
                    <Select
                        name="classKey"
                        label={i18n.t('Class key')}
                        options={classKeyOptions}
                        selected={classKey}
                        setValue={setClassKey}
                        loading={classLoading}
                        dense
                    />
                </>
            )}
            <RadioGroup
                name="identifier"
                label={i18n.t('Identifier')}
                options={identifierOptions}
                setValue={setIdentifier}
                checked={identifier}
            />
            <RadioGroup
                name="importReportMode"
                label={i18n.t('Import report mode')}
                options={importReportModeOptions}
                setValue={setImportReportMode}
                checked={importReportMode}
            />
            <RadioGroup
                name="preheatMode"
                label={i18n.t('Preheat mode')}
                options={preheatModeOptions}
                setValue={setPreheatMode}
                checked={preheatMode}
            />
            <RadioGroup
                name="importStrategy"
                label={i18n.t('Import strategy')}
                options={importStrategyOptions}
                setValue={setImportStrategy}
                checked={importStrategy}
            />
            <RadioGroup
                name="atomicMode"
                label={i18n.t('Atomic mode')}
                options={atomicModeOptions}
                setValue={setAtomicMode}
                checked={atomicMode}
            />
            <RadioGroup
                name="mergeMode"
                label={i18n.t('Merge mode')}
                options={mergeModeOptions}
                setValue={setMergeMode}
                checked={mergeMode}
            />
            <MoreOptions>
                <RadioGroup
                    name="flushMode"
                    label={i18n.t('Flush mode')}
                    options={flushModeOptions}
                    setValue={setFlushMode}
                    checked={flushMode}
                />
                <Switch
                    name="skipSharing"
                    label={i18n.t('Skip sharing')}
                    checked={skipSharing}
                    setChecked={setSkipSharing}
                />
                <Switch
                    name="skipValidation"
                    label={i18n.t('Skip validation')}
                    checked={skipValidation}
                    setChecked={setSkipValidation}
                />
                <Switch
                    name="async"
                    label={i18n.t('Async')}
                    checked={async}
                    setChecked={setAsync}
                />
                <RadioGroup
                    name="inclusionStrategy"
                    label={i18n.t('Inclusion strategy')}
                    options={inclusionStrategyOptions}
                    setValue={setInclusionStrategy}
                    checked={inclusionStrategy}
                />
            </MoreOptions>
            <Button primary initialFocus onClick={onImport}>
                {i18n.t('Import')}
            </Button>
            <FormAlerts alerts={alerts} />
        </Page>
    );
};

export { MetadataImport };