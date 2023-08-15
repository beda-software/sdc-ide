import classNames from 'classnames';
import { Questionnaire, Parameters, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
    const { onSave, questionnaireRD, questionnaireResponseRD } = props;
    const { questionnairesRD } = useQuestionnaireEditor();
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const history = useHistory();
    const [showSelect, setShowSelect] = useState(false);
    const [updatedResource, setUpdatedResource] = useState<Questionnaire | undefined>();

    useEffect(() => {
        if (isFailure(questionnaireResponseRD) || isLoading(questionnaireResponseRD)) {
            setShowSelect(false);
        }
    }, [questionnaireResponseRD]);

    return (
        <div className={s.container}>
            {showSelect ? (
                <RenderRemoteData remoteData={questionnairesRD}>
                    {(questionnaires) => (
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
                                    history.push(
                                        (option as { value: string; label: string }).value,
                                    );
                                }
                            }}
                        />
                    )}
                </RenderRemoteData>
            ) : (
                <RenderRemoteData remoteData={questionnaireRD}>
                    {(questionnaire) => (
                        <>
                            <ResourceCodeEditor<Questionnaire>
                                {...props}
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
                    )}
                </RenderRemoteData>
            )}
        </div>
    );
}