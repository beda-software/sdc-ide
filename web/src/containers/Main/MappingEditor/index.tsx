import classNames from 'classnames';
import { Questionnaire, QuestionnaireResponse, Parameters } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { ModalCreateMapper } from 'web/src/components/ModalCreateMapper';
import { ResourceCodeEditor } from 'web/src/components/ResourceCodeEditor';
import { Select } from 'web/src/components/Select';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import {
    RemoteData,
    RemoteDataResult,
    isFailure,
    isLoading,
    isSuccess,
} from 'fhir-react/lib/libs/remoteData';
import { WithId } from 'fhir-react/lib/services/fhir';
import { formatError } from 'fhir-react/lib/utils/error';

import { Mapping } from 'shared/src/contrib/aidbox';

import s from './MappingEditor.module.scss';
import { useMappingEditor } from './useMappingEditor';
import formStyles from '../../../components/BaseQuestionnaireResponseForm/QuestionnaireResponseForm.module.scss';
import { PromptForm } from '../PromptForm';

interface Props {
    questionnaireRD: RemoteData<Questionnaire>;
    onSave: (resource: WithId<Mapping>) => void;
    onChange: (resource: WithId<Mapping>) => void;
    mappingRD: RemoteData<WithId<Mapping>>;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    reload: () => void;
    createMapping: (mapping: Mapping) => Promise<RemoteData<any>>;
    generateMapping: (prompt: string) => Promise<RemoteDataResult<any>>;
}

export function MappingEditor(props: Props) {
    const {
        onSave,
        onChange,
        mappingRD,
        questionnaireRD,
        questionnaireResponseRD,
        createMapping,
        reload,
        generateMapping,
    } = props;
    const { mappingsRD } = useMappingEditor(questionnaireRD);
    const [showSelect, setShowSelect] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updatedResource, setUpdatedResource] = useState<WithId<Mapping> | undefined>();

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
                        <div className={formStyles.field}>
                            <div className={formStyles.label}>Choose mapper from the list</div>
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
                        </div>
                        <div />
                        <PromptForm
                            id="mapping"
                            onSubmit={generateMapping}
                            goBack={() => setShowSelect(false)}
                            label="or describe requirements to new mapper"
                        />
                        <div className={s.actions}>
                            <Button
                                className={s.action}
                                variant="secondary"
                                onClick={() => {
                                    setShowSelect(false);
                                }}
                            >
                                cancel
                            </Button>
                            <Button className={s.action} onClick={() => setShowModal(true)}>
                                Add blank mapper
                            </Button>
                        </div>

                        {showModal ? (
                            <ModalCreateMapper
                                saveMapping={async (mappingId) => {
                                    const response = await createMapping({
                                        resourceType: 'Mapping',
                                        id: mappingId,
                                        body: {},
                                    });

                                    if (isSuccess(response)) {
                                        setShowSelect(false);
                                    }

                                    if (isFailure(response)) {
                                        toast.error(formatError(response.error));
                                    }
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

    const renderEditor = (mapping: WithId<Mapping>) => {
        return (
            <>
                <ResourceCodeEditor<WithId<Mapping>>
                    {...props}
                    reload={() => {
                        reload();
                        setUpdatedResource(undefined);
                    }}
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
                        clear
                    </Button>
                    <Button
                        className={classNames(s.action, {
                            _active: !!updatedResource,
                        })}
                        onClick={() => {
                            if (updatedResource) {
                                onSave(updatedResource);
                                setUpdatedResource(undefined);
                            }
                        }}
                    >
                        save mapping
                    </Button>
                </div>
            </>
        );
    };

    return (
        <div className={s.container}>
            <RenderRemoteData
                renderFailure={(error) =>
                    !showSelect ? (
                        <div>
                            {formatError(error)}
                            {error?.id === 'not-found' ? (
                                <div className={s.actions}>
                                    <Button
                                        className={s.action}
                                        variant="secondary"
                                        onClick={() => {
                                            setShowSelect(true);
                                        }}
                                    >
                                        create new
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div />
                    )
                }
                remoteData={mappingRD}
            >
                {(mapping) => <>{!showSelect ? renderEditor(mapping) : null}</>}
            </RenderRemoteData>
            {showSelect ? renderSelect() : null}
        </div>
    );
}
