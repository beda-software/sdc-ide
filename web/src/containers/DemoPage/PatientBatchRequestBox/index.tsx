import React from 'react';
import { Button } from 'src/components/Button';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Bundle } from 'shared/lib/contrib/aidbox';
import { service } from 'aidbox-react/lib/services/service';

interface PatientBatchRequestBoxProps {
    batchRequest?: Bundle<any>;
}

export function PatientBatchRequestBox({ batchRequest }: PatientBatchRequestBoxProps) {
    const applyBundle = async (batchRequest: Bundle<any>) => {
        const bundleResponse = await service({
            method: 'POST',
            url: '/',
            data: batchRequest,
        });
        console.log(bundleResponse);
    };

    return (
        <>
            <h2>Patient batch request</h2>
            {batchRequest && (
                <>
                    <CodeMirror
                        value={JSON.stringify(batchRequest, undefined, 2)}
                        options={{
                            lineNumbers: false,
                            mode: 'javascript',
                            readOnly: true,
                        }}
                    />
                    <Button
                        onClick={async () => {
                            await applyBundle(batchRequest);
                        }}
                    >
                        Apply
                    </Button>
                </>
            )}
        </>
    );
}
