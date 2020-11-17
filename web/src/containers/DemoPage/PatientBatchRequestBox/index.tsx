import React from 'react';
import { Button } from 'src/components/Button';
import { Bundle, Questionnaire, QuestionnaireResponse } from 'shared/lib/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';
import { service } from 'aidbox-react/lib/services/service';

interface PatientBatchRequestBoxProps {
    batchRequest?: Bundle<any>;
    questionnaireResponse?: QuestionnaireResponse;
    questionnaire?: Questionnaire;
}

export function PatientBatchRequestBox(props: PatientBatchRequestBoxProps) {
    const { batchRequest, questionnaireResponse, questionnaire } = props;

    return (
        <div>
            <CodeEditor
                valueObject={batchRequest}
                options={{
                    readOnly: true,
                }}
            />
            <Button
                onClick={async () => {
                    if (questionnaireResponse && questionnaire) {
                        console.log('questionnaire', questionnaire);
                        console.log('questionnaireResponse', questionnaireResponse);
                        await service({
                            method: 'POST',
                            url: '/Questionnaire/$extract',
                            data: {
                                resourceType: 'Parameters',
                                parameter: [
                                    { name: 'questionnaire_response', resource: questionnaireResponse },
                                    { name: 'questionnaire', resource: questionnaire },
                                ],
                            },
                        });
                        window.location.reload();
                    }
                }}
                disabled={!batchRequest}
            >
                Apply
            </Button>
        </div>
    );
}
