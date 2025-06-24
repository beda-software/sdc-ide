import classNames from 'classnames';
import { FhirResource, Parameters, ParametersParameter, Questionnaire } from 'fhir/r4b';
import { useMemo, useState } from 'react';
import { SingleValue } from 'react-select';

import { success } from 'fhir-react/lib/libs/remoteData';

import { groupLaunchContextParams } from './groupLaunchContextParams';
import s from './LaunchContextEditor.module.scss';
import { LaunchContext } from './types';
import { Button } from '../Button';
import { ModalCreateLaunchContext } from '../ModalCreateLaunchContext';
import { ResourceCodeDisplay } from '../ResourceCodeDisplay';
import { RemoteResourceSelect } from '../ResourceSelect';
import { Select } from '../Select';

interface Props {
    questionnaire: Questionnaire;
    launchContext: Parameters;
    onChange: (parameter: ParametersParameter) => void;
    onRemove: (parameter: ParametersParameter) => void;
    createLaunchContext: (launchContext: LaunchContext) => Promise<any>;
}

function useLaunchContext(questionnaire: Questionnaire) {
    const launchContextParams = groupLaunchContextParams(questionnaire);
    const allParams = launchContextParams
        .map((ext) => ({
            name: ext.extension?.find((ext) => ext?.url === 'name')?.valueCoding?.code,
            types: ext.extension?.filter((ext) => ext?.url === 'type').map((t) => t.valueCode),
        }))
        .filter(
            ({ name, types }) => typeof name !== 'undefined' || types?.length,
        ) as LaunchContext[];

    return { allParams };
}

export function LaunchContextEditor(props: Props) {
    const { questionnaire, launchContext, onChange, onRemove, createLaunchContext } = props;
    const { allParams } = useLaunchContext(questionnaire);
    const [activeTab, setActiveTab] = useState(allParams[0]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const activeParam = useMemo(
        () => launchContext.parameter?.find((p) => p.name === activeTab?.name),
        [launchContext, activeTab],
    );

    const renderTabContent = () => {
        if (!activeTab) {
            return null;
        }

        return (
            <TabContent
                key={`active-tab-${activeTab.name}`}
                activeTab={activeTab}
                activeParam={activeParam}
                onChange={onChange}
                onRemove={onRemove}
            />
        );
    };

    return (
        <>
            <div className={s.tabs}>
                {allParams.map((param) => {
                    return (
                        <Tab
                            key={param.name}
                            tab={param}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    );
                })}

                <NewTab onClick={() => setShowCreateModal(true)} />
            </div>
            {renderTabContent()}
            {showCreateModal && (
                <ModalCreateLaunchContext
                    closeModal={() => setShowCreateModal(false)}
                    saveLaunchContext={createLaunchContext}
                />
            )}
        </>
    );
}

interface TabProps {
    tab: LaunchContext;
    activeTab?: LaunchContext;
    setActiveTab: (v: LaunchContext) => void;
}

function Tab(props: TabProps) {
    const { tab, setActiveTab, activeTab } = props;

    return (
        <button
            type="button"
            onClick={() => setActiveTab(tab)}
            className={classNames(s.tab, {
                _active: tab.name === activeTab?.name,
            })}
        >
            {tab.name}
        </button>
    );
}
function NewTab({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className={s.tab}>
            +
        </button>
    );
}

interface TabContentProps {
    activeTab: LaunchContext;
    activeParam?: ParametersParameter;
    onChange: (parameter: ParametersParameter) => void;
    onRemove: (parameter: ParametersParameter) => void;
}

function TabContent(props: TabContentProps) {
    const { activeTab, activeParam, onChange, onRemove } = props;

    const [resourceType, setResourceType] = useState(activeParam?.resource?.resourceType);

    const renderResourceSelect = (type: string) => {
        return (
            <>
                <RemoteResourceSelect
                    key={type}
                    resourceType={type}
                    value={activeParam?.resource?.id}
                    onChange={(resource) => {
                        if (resource && Array.isArray(resource) === false) {
                            onChange({
                                resource: resource as FhirResource,
                                name: activeTab!.name,
                            });
                        }
                    }}
                />
                <button
                    onClick={() =>
                        onChange({
                            resource: { resourceType: activeTab.types[0] } as FhirResource,
                            name: activeTab!.name,
                        })
                    }
                >
                    Empty
                </button>
            </>
        );
    };

    if (activeParam && activeParam.resource) {
        return (
            <div className={s.tabContent}>
                <ResourceCodeDisplay resourceResponse={success(activeParam.resource)} />
                <Button
                    className={s.remove}
                    variant="secondary"
                    onClick={() => {
                        onRemove(activeParam);
                        setResourceType(undefined);
                    }}
                >
                    back
                </Button>
            </div>
        );
    }

    return (
        <div className={s.tabContent}>
            {activeTab.types.length > 1 ? (
                <>
                    <Select
                        value={
                            resourceType
                                ? {
                                      value: resourceType,
                                      label: resourceType,
                                  }
                                : undefined
                        }
                        options={activeTab.types.map((resourceType) => ({
                            value: resourceType,
                            label: resourceType,
                        }))}
                        onChange={(option) => {
                            if (option && !Array.isArray(option)) {
                                setResourceType((option as SingleValue<any>).value);
                            }
                        }}
                    />
                    {resourceType && renderResourceSelect(resourceType)}
                </>
            ) : (
                renderResourceSelect(activeTab.types[0]!)
            )}
        </div>
    );
}
