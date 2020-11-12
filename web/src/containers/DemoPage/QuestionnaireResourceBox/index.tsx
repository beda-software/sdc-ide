import React from 'react';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Mapping } from 'shared/lib/contrib/aidbox';

export function QuestionnaireResourceBox() {
    const [questionnaireRemoteData] = useService(() =>
        getFHIRResource<Mapping>({
            resourceType: 'Questionnaire',
            id: 'patient-information',
        }),
    );

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
                        />
                    </>
                )}
            </RenderRemoteData>
        </>
    );
}
