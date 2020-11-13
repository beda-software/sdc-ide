import React from 'react';
import { Button } from 'src/components/Button';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Bundle, QuestionnaireResponse } from 'shared/lib/contrib/aidbox';
import { service } from 'aidbox-react/lib/services/service';

interface PatientBatchRequestBoxProps {
    batchRequest?: Bundle<any>;
    mappingId: string;
    questionnaireResponse?: QuestionnaireResponse;
}

export function PatientBatchRequestBox(props: PatientBatchRequestBoxProps) {
    const { batchRequest, mappingId, questionnaireResponse } = props;

    const applyMapping = async (mappingId: string, questionnaireResponse: QuestionnaireResponse) => {
        const response = await service({
            method: 'POST',
            url: `/Mapping/${mappingId}/$apply`,
            data: questionnaireResponse,
        });
        console.log('applyMapping response', response);
    };

    return (
        <>
            <h2>Patient batch request</h2>
            <div style={{ maxHeight: '37vh', overflowY: 'auto' }}>
                <CodeMirror
                    value={JSON.stringify(batchRequest, undefined, 2)}
                    options={{
                        lineNumbers: false,
                        mode: 'javascript',
                        readOnly: true,
                    }}
                />
            </div>
            <Button
                onClick={async () => {
                    if (questionnaireResponse) {
                        await applyMapping(mappingId, questionnaireResponse);
                        window.location.reload();
                    }
                }}
                disabled={!batchRequest}
            >
                Apply
            </Button>
        </>
    );
}
