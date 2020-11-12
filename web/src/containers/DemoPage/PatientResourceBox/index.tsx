import React from 'react';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { Patient } from 'shared/lib/contrib/aidbox';

interface PatientResourceBoxProps {
    patientResponse: RemoteData<Patient>;
}

export function PatientResourceBox({ patientResponse }: PatientResourceBoxProps) {
    return (
        <>
            <h2>Patient FHIR Resource</h2>
            <RenderRemoteData remoteData={patientResponse}>
                {(patient) => (
                    <>
                        <CodeMirror
                            value={JSON.stringify(patient, undefined, 2)}
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
