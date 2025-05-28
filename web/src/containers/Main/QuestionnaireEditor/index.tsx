/* eslint-disable import/order */
import classNames from 'classnames';
import { Questionnaire, Parameters, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { useBeforeUnload, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'web/src/components/Button';
import { ResourceCodeEditor } from 'web/src/components/ResourceCodeEditor';
import { ModalCreateQuestionnaire } from 'web/src/components/ModalCreateQuestionnaire';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import {
    RemoteData,
    RemoteDataResult,
    isFailure,
    isLoading,
    isSuccess,
} from 'fhir-react/lib/libs/remoteData';
import s from './QuestionnaireEditor.module.scss';
import formStyles from '../../../components/BaseQuestionnaireResponseForm/QuestionnaireResponseForm.module.scss';
import { PromptForm } from '../PromptForm';
import { toast } from 'react-toastify';
import { YAMLException } from 'js-yaml';
import { RemoteResourceSelect } from 'web/src/components/ResourceSelect';
import { sortKeys } from 'web/src/utils/sort-keys';
import { FCEQuestionnaire, fromFirstClassExtension, toFirstClassExtension } from 'sdc-qrf';
import { legacyQuestionnaireProfileUrl, questionnaireProfileUrl } from 'shared/src/constants';

interface Props {
    onSave: (resource: Questionnaire) => Promise<RemoteDataResult<any>>;
    questionnaireRD: RemoteData<Questionnaire>;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    reload: () => void;
    generateQuestionnaire: (prompt: string) => Promise<RemoteDataResult<any>>;
    createBlankQuestionnaire: (
        partialQuestionnaire: Partial<Questionnaire>,
    ) => Promise<RemoteDataResult<any>>;
}

export function QuestionnaireEditor(props: Props) {
    const {
        onSave,
        questionnaireRD,
        questionnaireResponseRD,
        reload,
        generateQuestionnaire,
        createBlankQuestionnaire,
    } = props;
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const navigate = useNavigate();
    const [showSelect, setShowSelect] = useState(isFailure(questionnaireResponseRD));
    const [showModal, setShowModal] = useState(false);
    const [updatedResource, setUpdatedResource] = useState<FCEQuestionnaire | undefined>();
    const [parseError, setParseError] = useState<YAMLException | null>(null);

    useBeforeUnload((event) => {
        if (updatedResource) {
            event.preventDefault();
        }
    });

    useEffect(() => {
        if (isLoading(questionnaireRD)) {
            setShowSelect(false);
        }
        if (isFailure(questionnaireRD)) {
            setShowSelect(true);
        }
    }, [questionnaireRD]);

    return (
        <div className={s.container}>
            {showSelect ? (
                <>
                    <div className={formStyles.field}>
                        <div className={formStyles.label}>Choose questionnaire from the list</div>
                        <RemoteResourceSelect<Questionnaire>
                            resourceType="Questionnaire"
                            searchParams={{
                                _sort: 'id',
                                profile: `${legacyQuestionnaireProfileUrl},${questionnaireProfileUrl}`,
                            }}
                            value={questionnaireId}
                            onChange={(value) => {
                                if (value) {
                                    setShowSelect(false);
                                    navigate(`/${(value as Questionnaire).id}`);
                                }
                            }}
                            display={(questionnaire) =>
                                questionnaire.title ?? questionnaire.name ?? questionnaire.id!
                            }
                        />
                    </div>
                    <div />
                    <PromptForm
                        id="questionnaire"
                        onSubmit={generateQuestionnaire}
                        goBack={() => setShowSelect(false)}
                        label="or describe requirements to new questionnaire"
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
                            add blank questionnaire
                        </Button>
                    </div>
                    {showModal ? (
                        <ModalCreateQuestionnaire
                            saveQuestionnaire={createBlankQuestionnaire}
                            closeModal={() => setShowModal(false)}
                        />
                    ) : null}
                </>
            ) : (
                <RenderRemoteData remoteData={questionnaireRD}>
                    {(questionnaire) => (
                        <>
                            <ResourceCodeEditor<FCEQuestionnaire>
                                {...props}
                                reload={() => {
                                    reload();
                                    setUpdatedResource(undefined);
                                }}
                                resource={prepareQuestionnaire(
                                    toFirstClassExtension(questionnaire),
                                )}
                                onChange={setUpdatedResource}
                                onSubmit={async (submittedResource) => {
                                    const response = await onSave(
                                        fromFirstClassExtension(submittedResource),
                                    );

                                    if (isSuccess(response)) {
                                        setUpdatedResource(undefined);
                                    }
                                }}
                                onParseError={setParseError}
                            />
                            <div className={s.actions}>
                                <Button
                                    className={s.action}
                                    variant="secondary"
                                    onClick={() => {
                                        setShowSelect(true);
                                    }}
                                >
                                    back
                                </Button>
                                <Button
                                    className={classNames(s.action, {
                                        _active: !!updatedResource,
                                    })}
                                    onClick={async () => {
                                        if (parseError) {
                                            toast.error(
                                                `Cannot parse YAML on line ${parseError.mark.line}: ${parseError.reason}`,
                                                {
                                                    autoClose: false,
                                                },
                                            );

                                            return;
                                        }

                                        if (updatedResource) {
                                            const response = await onSave(
                                                fromFirstClassExtension(updatedResource),
                                            );

                                            if (isSuccess(response)) {
                                                setUpdatedResource(undefined);
                                            }
                                        }
                                    }}
                                >
                                    save questionnaire
                                </Button>
                            </div>
                        </>
                    )}
                </RenderRemoteData>
            )}
        </div>
    );
}

function prepareQuestionnaire(q: FCEQuestionnaire): FCEQuestionnaire {
    return sortKeys(q, [
        'resourceType',
        'id',
        'status',
        'launchContext',
        'linkId',
        'text',
        'type',
        '*',
        'item',
        'meta',
    ]);
}
