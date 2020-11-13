import React from 'react';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Mapping, Questionnaire } from 'shared/lib/contrib/aidbox';

import { CodeEditor } from 'src/components/CodeEditor';
import { displayToObject } from 'src/utils/yaml';

import s from './QuestionnaireResourceBox.module.scss'

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
                    <div className={s.wrapper}>
                        <CodeEditor
                            valueObject={questionnaire}
                            onChange={(editor, data, value) => {
                                setTimeout(() => {
                                    saveQuestionnaire(displayToObject(value));
                                }, 2000);
                            }}
                        />
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
}
