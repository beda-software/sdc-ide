import React from 'react';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { Parameters, Patient, Questionnaire, QuestionnaireResponse } from 'shared/lib/contrib/aidbox';
import { useService } from 'aidbox-react/lib/hooks/service';
import { service } from 'aidbox-react/lib/services/service';

interface PatientFormBoxProps {
    questionnaire: Questionnaire;
    patient: Patient;
    setBatchRequest: React.Dispatch<any>;
}

export function PatientFormBox({ questionnaire, patient, setBatchRequest }: PatientFormBoxProps) {
    const [questionnaireResponse] = useService(async () => {
        const params: Parameters = {
            resourceType: 'Parameters',
            parameter: [
                { name: 'LaunchPatient', resource: patient },
                { name: 'questionnaire', resource: questionnaire },
            ],
        };

        const populatedResp = await service<QuestionnaireResponse>({
            method: 'POST',
            url: '/Questionnaire/$populate',
            data: params,
        });
        console.log('populatedResp', populatedResp);
        return populatedResp;
    }, [questionnaire]);
    return (
        <>
            <h2>Patient Form</h2>
            {isSuccess(questionnaireResponse) && (
                <QuestionnaireResponseForm
                    questionnaire={questionnaire}
                    resource={questionnaireResponse.data}
                    onSave={async (resource) => {
                        const response = await service({
                            method: 'POST',
                            url: '/Mapping/patient-extract/$debug',
                            data: resource,
                        });
                        console.log(response);
                        setBatchRequest(response);
                    }}
                />
            )}
        </>
    );
}
