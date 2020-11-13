import React from 'react';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { Patient } from 'shared/lib/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';

import s from './PatientResourceBox.module.scss';

interface PatientResourceBoxProps {
    patientResponse: RemoteData<Patient>;
}

export function PatientResourceBox({ patientResponse }: PatientResourceBoxProps) {
    return (
        <>
            <h2>Patient FHIR Resource</h2>
            <RenderRemoteData remoteData={patientResponse}>
                {(patient) => (
                    <div className={s.wrapper}>
                        <CodeEditor
                            valueObject={patient}
                            options={{
                                readOnly: true,
                            }}
                        />
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
}
