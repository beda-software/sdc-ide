import _ from 'lodash';
import { useCallback } from 'react';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';

import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { sequenceMap } from 'aidbox-react/lib/services/service';

import { Questionnaire, QuestionnaireResponse, Parameters } from 'shared/src/contrib/aidbox';
import { mapFormToResponse, mapResponseToForm } from 'shared/src/utils/qrf';

import { BaseQuestionnaireResponseForm } from '../BaseQuestionnaireResponseForm';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
