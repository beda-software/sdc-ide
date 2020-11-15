import React, { useCallback } from 'react';
import _ from 'lodash';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { Questionnaire } from 'shared/lib/contrib/aidbox';

import { CodeEditor } from 'src/components/CodeEditor';
import { displayToObject } from 'src/utils/yaml';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { service } from 'aidbox-react/lib/services/service';
import { useService } from 'aidbox-react/lib/hooks/service';

interface QuestionnaireResourceBoxProps {
    id: string;
    onQuestionnaireUdpate: () => void;
}

export function QuestionnaireResourceBox(props: QuestionnaireResourceBoxProps) {
    const saveQuestionnaire = useCallback(
        async (resource: Questionnaire) => {
            const resp = await service({
                method: 'PUT',
                data: resource,
                url: `/fhir/Questionnaire/${props.id}`,
            });
            if (isSuccess(resp)) {
                props.onQuestionnaireUdpate();
            }
        },
        [props],
    );

    const [questionnaire] = useService(() =>
        service({
            method: 'GET',
            url: `/fhir/Questionnaire/${props.id}`,
        }),
    );

    const onChange = useCallback(_.debounce(saveQuestionnaire, 1000), [saveQuestionnaire]);

    return (
        <RenderRemoteData remoteData={questionnaire}>
            {(questionnaire) => (
                <CodeEditor
                    valueObject={questionnaire}
                    onChange={(_editor, _data, value) => onChange(displayToObject(value))}
                />
            )}
        </RenderRemoteData>
    );
}
