import React from 'react';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { Questionnaire } from 'shared/lib/contrib/aidbox';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { CodeEditor } from 'src/components/CodeEditor';
import { displayToObject } from 'src/utils/yaml';
import _ from 'lodash';

interface QuestionnaireEditorProps {
    questionnaireFHIRRD: RemoteData<Questionnaire>;
    saveQuestionnaireFHIR: (resource: Questionnaire) => void;
}

export function QuestionnaireEditor({ questionnaireFHIRRD, saveQuestionnaireFHIR }: QuestionnaireEditorProps) {
    const onChange = _.debounce(saveQuestionnaireFHIR, 1000);

    return (
        <RenderRemoteData remoteData={questionnaireFHIRRD}>
            {(questionnaire) => (
                <CodeEditor
                    valueObject={questionnaire}
                    onChange={(_editor, _data, value) => onChange(displayToObject(value))}
                />
            )}
        </RenderRemoteData>
    );
}
