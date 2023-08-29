import classNames from 'classnames';
import { Questionnaire, Parameters, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'web/src/components/Button';
import { ResourceCodeEditor } from 'web/src/components/ResourceCodeEditor';
import { Select } from 'web/src/components/Select';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { RemoteData, isFailure, isLoading } from 'fhir-react/lib/libs/remoteData';

import s from './QuestionnaireEditor.module.scss';
import { useQuestionnaireEditor } from './useQuestionnaireEditor';

interface Props {
    onSave: (resource: Questionnaire) => void;
    questionnaireRD: RemoteData<Questionnaire>;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    reload: () => void;
}

export function QuestionnaireEditor(props: Props) {
    const { onSave, questionnaireRD, questionnaireResponseRD, reload } = props;
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
                                                (option as { value: string; label: string }).value
                                            }`,
                                        );
                                    }
                                }}
                            />
                            <RenderRemoteData remoteData={questionnaireRD}>
                                {() => <></>}
                            </RenderRemoteData>
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
