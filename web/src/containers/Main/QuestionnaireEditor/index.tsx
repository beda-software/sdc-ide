import classNames from 'classnames';
import { Questionnaire, Parameters, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'web/src/components/Button';
import { ResourceCodeEditor } from 'web/src/components/ResourceCodeEditor';
import { Select } from 'web/src/components/Select';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { RemoteData, RemoteDataResult, isFailure, isLoading } from 'fhir-react/lib/libs/remoteData';

import s from './QuestionnaireEditor.module.scss';
import { useQuestionnaireEditor } from './useQuestionnaireEditor';
import formStyles from '../../../components/QRFormWrapper/QuestionnaireResponseForm.module.scss';
import { PromptForm } from '../PromptForm';

interface Props {
    onSave: (resource: Questionnaire) => void;
    questionnaireRD: RemoteData<Questionnaire>;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    reload: () => void;
    generateQuestionnaire: (prompt: string) => Promise<RemoteDataResult<any>>;
}

export function QuestionnaireEditor(props: Props) {
    const { onSave, questionnaireRD, questionnaireResponseRD, reload, generateQuestionnaire } =
        props;
    const { questionnairesRD } = useQuestionnaireEditor();
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const navigate = useNavigate();
    const [showSelect, setShowSelect] = useState(isFailure(questionnaireResponseRD));
    const [updatedResource, setUpdatedResource] = useState<Questionnaire | undefined>();

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
                <RenderRemoteData remoteData={questionnairesRD}>
                    {(questionnaires) => (
                        <>
                            <div className={formStyles.field}>
                                <div className={formStyles.label}>
                                    Choose questionnaire from the list
                                </div>
                                <Select
                                    value={{
                                        value: questionnaireId,
                                        label: questionnaireId,
                                    }}
                                    options={questionnaires.map((questionnaire) => ({
                                        value: questionnaire.id,
                                        label: questionnaire.title ?? questionnaire.id,
                                    }))}
                                    onChange={(option) => {
                                        if (option) {
                                            setShowSelect(false);
                                            navigate(
                                                `/${
                                                    (option as { value: string; label: string })
                                                        .value
                                                }`,
                                            );
                                        }
                                    }}
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
                            </div>
                        </>
                    )}
                </RenderRemoteData>
            ) : (
                <RenderRemoteData remoteData={questionnaireRD}>
                    {(questionnaire) => (
                        <>
                            <ResourceCodeEditor<Questionnaire>
                                {...props}
                                reload={() => {
                                    reload();
                                    setUpdatedResource(undefined);
                                }}
                                resource={questionnaire}
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
