import React, { useCallback } from 'react';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Questionnaire, QuestionnaireResponse } from 'shared/lib/contrib/aidbox';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import _ from 'lodash';

interface QRFormWrapperProps {
    questionnaireRD: RemoteData<Questionnaire>;
    questionnaireResponse: QuestionnaireResponse;
    saveQuestionnaireResponse: (resource: QuestionnaireResponse) => void;
}

export function QRFormWrapper({
    questionnaireRD,
    questionnaireResponse,
    saveQuestionnaireResponse,
}: QRFormWrapperProps) {
    const onChange = useCallback(_.debounce(saveQuestionnaireResponse, 1000), [saveQuestionnaireResponse]);

    return (
        <RenderRemoteData remoteData={questionnaireRD}>
            {(questionnaire) => (
                <QuestionnaireResponseForm
                    key={questionnaire.id}
                    readOnly
                    questionnaire={questionnaire}
                    resource={questionnaireResponse}
                    onSave={async () => {}}
                    onChange={onChange}
                />
            )}
        </RenderRemoteData>
    );
}
