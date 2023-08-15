import classNames from 'classnames';
import { Questionnaire, QuestionnaireResponse, Parameters } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { Button } from 'web/src/components/Button';
import { ModalCreateMapper } from 'web/src/components/ModalCreateMapper';
import { ResourceCodeEditor } from 'web/src/components/ResourceCodeEditor';
import { Select } from 'web/src/components/Select';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { RemoteData, isFailure, isLoading, isSuccess } from 'fhir-react/lib/libs/remoteData';

import { Mapping } from 'shared/src/contrib/aidbox';

import s from './MappingEditor.module.scss';
import { useMappingEditor } from './useMappingEditor';

interface Props {
    questionnaireRD: RemoteData<Questionnaire>;
    onSave: (resource: Mapping) => void;
    onChange: (resource: Mapping) => void;
    mappingRD: RemoteData<Mapping>;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    reload: () => void;
    addMapping: (mapping: Mapping) => void;
}

export function MappingEditor(props: Props) {
    const { onSave, onChange, mappingRD, questionnaireRD, questionnaireResponseRD, addMapping } =
        props;
    const { mappingsRD } = useMappingEditor(questionnaireRD);
    const [showSelect, setShowSelect] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updatedResource, setUpdatedResource] = useState<Mapping | undefined>();

    useEffect(() => {
        if (isFailure(questionnaireResponseRD) || isLoading(questionnaireResponseRD)) {
            setShowSelect(false);
        }
    }, [questionnaireResponseRD]);

    const renderSelect = () => {
        return (
            <RenderRemoteData remoteData={mappingsRD}>
                {(mappings) => (
                    <>
                        <Select
                            value={
                                isSuccess(mappingRD)
                                    ? {
                                          value: mappingRD.data,
                                          label: mappingRD.data.id,
                                      }
                                    : undefined
                            }
                            options={mappings.map((mapping) => ({
                                value: mapping,
                                label: mapping.id,
                            }))}
                            onChange={(option) => {
                                if (option && !Array.isArray(option)) {
                                    setShowSelect(false);
                                    onChange((option as SingleValue<any>).value);
                                }
                            }}
                        />
                        <Button onClick={() => setShowModal(true)}>Add new</Button>
                        {showModal ? (
                            <ModalCreateMapper
                                saveMapping={(mappingId) => {
                                    addMapping({
                                        resourceType: 'Mapping',
                                        id: mappingId,
                                        body: {},
                                    });
                                    setShowSelect(false);
                                }}
                                closeModal={() => setShowModal(false)}
                                mappings={mappings}
                            />
                        ) : null}
                    </>
                )}
            </RenderRemoteData>
        );
    };

    const renderEditor = (mapping: Mapping) => {
        return (
            <>
                <ResourceCodeEditor<Mapping>
                    {...props}
                    resource={mapping}
                    onChange={setUpdatedResource}
                />
                <div className={s.actions}>
                    <Button
                        className={s.action}
                        variant="secondary"
                        onClick={() => {
                            setShowSelect(true);
                        }}
                    >
                        remove
                    </Button>
                    <Button
                        className={classNames(s.action, {
                            _active: !!updatedResource,
                        })}
                        disabled={!!updatedResource}
                        onClick={() => {
                            if (updatedResource) {
                                onSave(updatedResource);
                                setUpdatedResource(undefined);
                            }
                        }}
                    >
                        save
                    </Button>
                </div>
            </>
        );
    };

    return (
        <div className={s.container}>
            <RenderRemoteData remoteData={mappingRD}>
                {(mapping) => <>{showSelect ? renderSelect() : renderEditor(mapping)}</>}
            </RenderRemoteData>
        </div>
    );
}
