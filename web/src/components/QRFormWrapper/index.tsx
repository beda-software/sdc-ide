import React, { useCallback } from 'react';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { Questionnaire, QuestionnaireResponse, Parameters } from 'shared/src/contrib/aidbox';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import _ from 'lodash';
import { sequenceMap } from 'aidbox-react/lib/services/service';
import { BaseQuestionnaireResponseForm } from '../BaseQuestionnaireResponseForm';
import { mapFormToResponse, mapResponseToForm } from 'shared/src/utils/qrf';
import s from './QRFormWrapper.module.scss';

interface QRFormWrapperProps {
    questionnaireRD: RemoteData<Questionnaire>;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    saveQuestionnaireResponse: (resource: QuestionnaireResponse) => void;
    launchContextParameters: Parameters['parameter'];
}

export function QRFormWrapper({
    questionnaireRD,
    questionnaireResponseRD,
    saveQuestionnaireResponse,
    launchContextParameters,
}: QRFormWrapperProps) {
    const onChange = useCallback(_.debounce(saveQuestionnaireResponse, 1000), [
        saveQuestionnaireResponse,
    ]);
    const remoteDataResult = sequenceMap({ questionnaireRD, questionnaireResponseRD });

    return (
        <RenderRemoteData remoteData={remoteDataResult}>
            {(data) => (
                <div className={s.patientForm}>
                    <BaseQuestionnaireResponseForm
                        key={data.questionnaireRD.id}
                        formData={{
                            context: {
                                questionnaire: data.questionnaireRD,
                                questionnaireResponse: data.questionnaireResponseRD,
                                launchContextParameters: launchContextParameters ?? [],
                            },
                            formValues: mapResponseToForm(
                                data.questionnaireResponseRD,
                                data.questionnaireRD,
                            ),
                        }}
                        /* TODO: Move to useMemo */
                        onSubmit={async () => {}}
                        onChange={(newFormData) =>
                            onChange({
                                ...data.questionnaireResponseRD,
                                ...mapFormToResponse(newFormData.formValues, data.questionnaireRD),
                            })
                        }
                    />
                </div>
            )}
        </RenderRemoteData>
    );
}
