import {
    fromFirstClassExtension,
    mapFormToResponse,
    mapResponseToForm,
    toFirstClassExtension,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import {
    Questionnaire as FHIRQuestionnaire,
    QuestionnaireResponse as FHIRQuestionnaireResponse,
    Parameters,
} from 'fhir/r4b';
import _ from 'lodash';
import { useCallback } from 'react';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';
import { useFHIRServiceProvider } from 'web/src/services/fhir';

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
    const serviceProvider = useFHIRServiceProvider();
    const remoteDataResult = sequenceMap({
        questionnaireRD,
        questionnaireResponseRD,
        serviceProvider,
    });

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
                    serviceProvider={data.serviceProvider}
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
