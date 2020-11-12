import React from 'react';
import s from './DemoPage.module.scss';

import { Logo } from 'src/components/Logo';
import { MappingBox } from 'src/containers/DemoPage/MappingBox';
import { PatientResourceBox } from 'src/containers/DemoPage/PatientResourceBox';
import { PatientBatchRequestBox } from 'src/containers/DemoPage/PatientBatchRequestBox';
import { QuestionnaireResourceBox } from 'src/containers/DemoPage/QuestionnaireResourceBox';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Questionnaire, Patient, Bundle } from 'shared/lib/contrib/aidbox';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { PatientFormBox } from 'src/containers/DemoPage/PatientFormBox';

export function DemoPage() {
    const [questionnaireRemoteData] = useService(async () => {
        return getFHIRResource<Questionnaire>({
            resourceType: 'Questionnaire',
            id: 'patient-information',
        });
    });

    const [patientResponse] = useService(() =>
        getFHIRResource<Patient>({
            resourceType: 'Patient',
            id: 'demo-patient',
        }),
    );

    const [batchRequest, setBatchRequest] = React.useState<Bundle<any> | undefined>();

    return (
        <div className={s.mainContainer}>
            <div className={s.upperRowContainer}>
                <div className={s.patientFHIRResourceBox}>
                    <PatientResourceBox patientResponse={patientResponse} />
                </div>
                <div className={s.questFHIRResourceBox}>
                    <QuestionnaireResourceBox />
                </div>
                <div className={s.patientFormBox}>
                    {isSuccess(questionnaireRemoteData) && isSuccess(patientResponse) && (
                        <PatientFormBox
                            questionnaire={questionnaireRemoteData.data}
                            patient={patientResponse.data}
                            setBatchRequest={setBatchRequest}
                        />
                    )}
                </div>
                <div className={s.patientBatchRequestBox}>
                    <PatientBatchRequestBox batchRequest={batchRequest} />
                </div>
            </div>

            <div className={s.lowerRowContainer}>
                <div className={s.patientMapperBox}>
                    <MappingBox />
                </div>
            </div>
            <Logo />
        </div>
    );
}
