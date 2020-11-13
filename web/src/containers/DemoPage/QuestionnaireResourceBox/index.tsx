import React from 'react';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Mapping, Questionnaire } from 'shared/lib/contrib/aidbox';

import './styles.css';

export function QuestionnaireResourceBox() {
    const [questionnaireRemoteData] = useService(() =>
        getFHIRResource<Mapping>({
            resourceType: 'Questionnaire',
            id: 'patient-information',
        }),
    );

    const saveQuestionnaire = async (resource: Questionnaire) => {
        const resp = await saveFHIRResource(resource);
        console.log('Questionnaire save', resp);
    };

    return (
        <>
            <h2>Questionanire FHIR Resource</h2>
            <RenderRemoteData remoteData={questionnaireRemoteData}>
                {(questionnaire) => (
                    <>
                        <CodeMirror
                            value={JSON.stringify(questionnaire, undefined, 2)}
                            options={{
                                lineNumbers: false,
                                mode: 'javascript',
                            }}
                            onChange={(editor, data, value) => {
                                setTimeout(() => {
                                    saveQuestionnaire(JSON.parse(value));
                                }, 2000);
                            }}
                        />
                    </>
                )}
            </RenderRemoteData>
        </>
    );
}
