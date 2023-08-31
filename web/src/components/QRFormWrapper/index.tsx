import {
    Questionnaire as FHIRQuestionnaire,
    QuestionnaireResponse as FHIRQuestionnaireResponse,
    Parameters,
} from 'fhir/r4b';
import _ from 'lodash';
import { useCallback } from 'react';
import {
    fromFirstClassExtension,
    mapFormToResponse,
    mapResponseToForm,
    toFirstClassExtension,
} from 'sdc-qrf/src';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';

import { RemoteData } from 'fhir-react/lib/libs/remoteData';
import { sequenceMap } from 'fhir-react/lib/services/service';
import { formatError } from 'fhir-react/lib/utils/error';

import { QuestionnaireResponse as FCEQuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { BaseQuestionnaireResponseForm } from '../BaseQuestionnaireResponseForm';

interface QRFormWrapperProps {
    questionnaireRD: RemoteData<FHIRQuestionnaire>;
    questionnaireResponseRD: RemoteData<FHIRQuestionnaireResponse>;
    saveQuestionnaireResponse: (resource: FHIRQuestionnaireResponse) => void;
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
        <RenderRemoteData
            remoteData={remoteDataResult}
            renderFailure={(errors: Error[]) => {
                return <p>{errors.map((e) => formatError(e)).join(',')}</p>;
            }}
        >
            {(data) => (
                <BaseQuestionnaireResponseForm
                    key={data.questionnaireRD.id}
                    formData={{
                        context: {
                            questionnaire: toFirstClassExtension(data.questionnaireRD),
                            questionnaireResponse: toFirstClassExtension(
                                data.questionnaireResponseRD,
                            ),
                            launchContextParameters: launchContextParameters ?? [],
                        },
                        formValues: mapResponseToForm(
                            toFirstClassExtension(data.questionnaireResponseRD),
                            toFirstClassExtension(data.questionnaireRD),
                        ),
                    }}
                    /* TODO: Move to useMemo */
                    onSubmit={async () => {}}
                    onChange={(newFormData) => {
                        const fceQR: FCEQuestionnaireResponse = {
                            ...toFirstClassExtension(data.questionnaireResponseRD),
                            ...mapFormToResponse(newFormData.formValues, data.questionnaireRD),
                        };
                        onChange(fromFirstClassExtension(fceQR));
                    }}
                />
            )}
        </RenderRemoteData>
    );
}
