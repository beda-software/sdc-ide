import React, { useCallback } from 'react';
import _ from 'lodash';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Questionnaire } from 'shared/lib/contrib/aidbox';

import { CodeEditor } from 'src/components/CodeEditor';
import { displayToObject } from 'src/utils/yaml';

import s from './QuestionnaireResourceBox.module.scss';
import { isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';

interface QuestionnaireResourceBoxProps {
    questionanire: RemoteData<Questionnaire>;
    onQuestionnaireUdpate: (q: Questionnaire) => void;
}

export function QuestionnaireResourceBox(props: QuestionnaireResourceBoxProps) {
    const saveQuestionnaire = useCallback(
        async (resource: Questionnaire) => {
            const resp = await saveFHIRResource(resource);
            if (isSuccess(resp)) {
                props.onQuestionnaireUdpate(resp.data);
            }
        },
        [props],
    );

    const onChange = useCallback(_.debounce(saveQuestionnaire, 1000), [saveQuestionnaire]);

    return (
        <>
            <h2>Questionanire FHIR Resource</h2>
            <RenderRemoteData remoteData={props.questionanire}>
                {(questionnaire) => (
                    <div className={s.wrapper}>
                        <CodeEditor
                            valueObject={questionnaire}
                            onChange={(_editor, _data, value) => onChange(displayToObject(value))}
                        />
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
}
