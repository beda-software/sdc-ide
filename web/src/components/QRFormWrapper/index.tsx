import React, { useCallback } from 'react';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';
import { RemoteData } from 'aidbox-react/src/libs/remoteData';
import _ from 'lodash';
import { sequenceMap } from 'aidbox-react/src/services/service';

interface QRFormWrapperProps {
    questionnaireRD: RemoteData<Questionnaire>;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    saveQuestionnaireResponse: (resource: QuestionnaireResponse) => void;
}

export function QRFormWrapper({
    questionnaireRD,
    questionnaireResponseRD,
    saveQuestionnaireResponse,
}: QRFormWrapperProps) {
    const onChange = useCallback(_.debounce(saveQuestionnaireResponse, 1000), [saveQuestionnaireResponse]);
    const remoteDataResult = sequenceMap({ questionnaireRD, questionnaireResponseRD });
    return (
        <RenderRemoteData remoteData={remoteDataResult}>
            {(data) => (
                <QuestionnaireResponseForm
                    key={data.questionnaireRD.id}
                    readOnly
                    questionnaire={data.questionnaireRD}
                    resource={data.questionnaireResponseRD}
                    onSave={async () => {}}
                    onChange={onChange}
                />
            )}
        </RenderRemoteData>
    );
}
