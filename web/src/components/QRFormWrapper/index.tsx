import {
    Questionnaire as FHIRQuestionnaire,
    QuestionnaireResponse as FHIRQuestionnaireResponse,
    Parameters,
    QuestionnaireResponse,
} from 'fhir/r4b';
import _ from 'lodash';
import { useCallback } from 'react';
import {
    calcInitialContext,
    mapFormToResponse,
    mapResponseToForm,
    QuestionnaireResponseFormData,
    removeDisabledAnswers,
    toFirstClassExtension,
} from 'sdc-qrf';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';

import { RemoteData } from 'fhir-react/lib/libs/remoteData';
import { sequenceMap } from 'fhir-react/lib/services/service';
import { formatError } from 'fhir-react/lib/utils/error';

import { BaseQuestionnaireResponseForm } from '../BaseQuestionnaireResponseForm';

interface QRData {
    inProgressQR: FHIRQuestionnaireResponse;
    completedQR: FHIRQuestionnaireResponse;
}
interface QRFormWrapperProps {
    questionnaireRD: RemoteData<FHIRQuestionnaire>;
    questionnaireResponseRD: RemoteData<QRData>;
    saveQuestionnaireResponse: (data: QRData) => void;
    launchContextParameters: Parameters['parameter'];
}

export function QRFormWrapper({
    questionnaireRD,
    questionnaireResponseRD,
    saveQuestionnaireResponse,
    launchContextParameters,
}: QRFormWrapperProps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChange = useCallback(_.debounce(saveQuestionnaireResponse, 1000), [
        saveQuestionnaireResponse,
    ]);
    const remoteDataResult = sequenceMap({
        questionnaire: questionnaireRD,
        questionnaireResponse: questionnaireResponseRD,
    });

    return (
        <RenderRemoteData
            remoteData={remoteDataResult}
            renderFailure={(errors: Error[]) => {
                return <p>{errors.map((e) => formatError(e)).join(',')}</p>;
            }}
        >
            {(data) => {
                const context: QuestionnaireResponseFormData['context'] = {
                    fceQuestionnaire: toFirstClassExtension(data.questionnaire),
                    questionnaire: data.questionnaire,
                    questionnaireResponse: data.questionnaireResponse.inProgressQR,
                    launchContextParameters: launchContextParameters ?? [],
                };

                return (
                    <BaseQuestionnaireResponseForm
                        key={data.questionnaire.id}
                        formData={{
                            context,
                            formValues: mapResponseToForm(
                                data.questionnaireResponse.inProgressQR,
                                data.questionnaire,
                            ),
                        }}
                        /* TODO: Move to useMemo */
                        onSubmit={async () => {}}
                        onChange={(newFormData) => {
                            const inProgressQR: QuestionnaireResponse = {
                                ...data.questionnaireResponse.inProgressQR,
                                ...mapFormToResponse(newFormData.formValues, data.questionnaire),
                                status: 'in-progress',
                            };
                            const initialContext = calcInitialContext(
                                context,
                                newFormData.formValues,
                            );
                            const completedQR: QuestionnaireResponse = {
                                ...data.questionnaireResponse.inProgressQR,
                                ...mapFormToResponse(
                                    removeDisabledAnswers(
                                        data.questionnaire,
                                        newFormData.formValues,
                                        initialContext,
                                    ),
                                    data.questionnaire,
                                ),
                                status: 'completed',
                            };
                            onChange({ inProgressQR, completedQR });
                        }}
                    />
                );
            }}
        </RenderRemoteData>
    );
}
