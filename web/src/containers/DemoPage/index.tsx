import React from 'react';
import s from './DemoPage.module.scss';

import { Logo } from 'src/components/Logo';
import { MappingBox } from 'src/containers/DemoPage/MappingBox';
import { PatientResourceBox } from 'src/containers/DemoPage/PatientResourceBox';
import { PatientBatchRequestBox } from 'src/containers/DemoPage/PatientBatchRequestBox';
import { QuestionnaireResourceBox } from 'src/containers/DemoPage/QuestionnaireResourceBox';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Questionnaire, Patient, Bundle, QuestionnaireResponse } from 'shared/lib/contrib/aidbox';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { PatientFormBox } from 'src/containers/DemoPage/PatientFormBox';

export function DemoPage() {
    const patientId = 'demo-patient';
    const mappingId = 'patient-extract';
    const questionnaireId = 'patient-information';

    const [batchRequest, setBatchRequest] = React.useState<Bundle<any> | undefined>();
    const [questionnaireResponse, setQuestionnaireResponse] = React.useState<QuestionnaireResponse | undefined>();

    const [questionnaireRemoteData, questionnaireManager] = useService(async () => {
        return getFHIRResource<Questionnaire>({
            resourceType: 'Questionnaire',
            id: questionnaireId,
        });
    });

    const [patientResponse] = useService(() =>
        getFHIRResource<Patient>({
            resourceType: 'Patient',
            id: patientId,
        }),
    );

    return (
        <div className={s.mainContainer}>
            <div className={s.upperRowContainer}>
                <div className={s.patientFHIRResourceBox}>
                    <PatientResourceBox patientResponse={patientResponse} />
                </div>
                <div className={s.questFHIRResourceBox}>
                    <QuestionnaireResourceBox
                        questionanire={questionnaireRemoteData}
                        onQuestionnaireUdpate={questionnaireManager.set}
                    />
                </div>
                <div className={s.patientFormBox}>
                    <>
                        <h2>Patient Form</h2>
                        {isSuccess(questionnaireRemoteData) && isSuccess(patientResponse) && (
                            <PatientFormBox
                                questionnaire={questionnaireRemoteData.data}
                                patient={patientResponse.data}
                                setBatchRequest={setBatchRequest}
                                mappingId={mappingId}
                                setQuestionnaireResponse={setQuestionnaireResponse}
                            />
                        )}
                    </>
                </div>
                <div className={s.patientBatchRequestBox}>
                    <PatientBatchRequestBox
                        batchRequest={batchRequest}
                        questionnaireResponse={questionnaireResponse}
                        mappingId={mappingId}
                    />
                </div>
            </div>

            <div className={s.lowerRowContainer}>
                <div className={s.patientMapperBox}>
                    <MappingBox mappingId={mappingId} />
                </div>
            </div>
            <Logo />
        </div>
    );
}
