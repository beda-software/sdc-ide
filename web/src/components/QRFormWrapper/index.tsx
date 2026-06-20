import {
    QuestionnaireResponseForm,
    questionnaireServiceLoader,
} from '@beda.software/fhir-questionnaire';
import type { FormWrapperProps } from '@beda.software/fhir-questionnaire/components';
import { formatError } from '@beda.software/fhir-react';
import { RemoteData, sequenceMap, success } from '@beda.software/remote-data';
import {
    groupItemComponent,
    itemControlGroupItemComponents,
    itemControlQuestionItemComponents,
    questionItemComponents,
} from '@beda.software/web-item-controls/controls';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ConfigProvider } from 'antd';
import {
    Questionnaire as FHIRQuestionnaire,
    QuestionnaireResponse as FHIRQuestionnaireResponse,
    Parameters,
    QuestionnaireResponse,
} from 'fhir/r4b';
import _ from 'lodash';
import { useCallback, useRef } from 'react';
import {
    calcInitialContext,
    mapFormToResponse,
    QuestionnaireResponseFormData,
    removeDisabledAnswers,
    toFirstClassExtension,
} from 'sdc-qrf';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';

import s from './QRFormWrapper.module.scss';

i18n.load('en', {});
i18n.activate('en');

function FormWrapper({ handleSubmit, items }: FormWrapperProps) {
    return (
        <form onSubmit={handleSubmit} className={s.form} noValidate>
            <div className={s.content}>{items}</div>
        </form>
    );
}

const serviceProvider = {
    service: () => Promise.resolve(success({} as any)),
};

const sdcServiceProvider = {
    saveCompletedQuestionnaireResponse: (qr: FHIRQuestionnaireResponse) =>
        Promise.resolve(success(qr)),
    saveInProgressQuestionnaireResponse: (qr: FHIRQuestionnaireResponse) =>
        Promise.resolve(success(qr)),
};

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
    const onChange = useCallback(_.debounce(saveQuestionnaireResponse, 250), [
        saveQuestionnaireResponse,
    ]);

    const remoteDataResult = sequenceMap({
        questionnaire: questionnaireRD,
        questionnaireResponse: questionnaireResponseRD,
    });

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#3366ff' } }}>
            <I18nProvider i18n={i18n}>
                <RenderRemoteData
                    remoteData={remoteDataResult}
                    renderFailure={(errors: Error[]) => (
                        <p>{errors.map((e) => formatError(e)).join(',')}</p>
                    )}
                >
                    {(data) => (
                        <QRForm
                            questionnaire={data.questionnaire}
                            questionnaireResponse={data.questionnaireResponse}
                            launchContextParameters={launchContextParameters ?? []}
                            onChange={onChange}
                        />
                    )}
                </RenderRemoteData>
            </I18nProvider>
        </ConfigProvider>
    );
}

interface QRFormProps {
    questionnaire: FHIRQuestionnaire;
    questionnaireResponse: QRData;
    launchContextParameters: NonNullable<Parameters['parameter']>;
    onChange: (data: QRData) => void;
}

function QRForm({
    questionnaire,
    questionnaireResponse,
    launchContextParameters,
    onChange,
}: QRFormProps) {
    const questionnaireRef = useRef(questionnaire);
    const keyRef = useRef(0);
    if (questionnaire !== questionnaireRef.current) {
        questionnaireRef.current = questionnaire;
        keyRef.current += 1;
    }

    const handleEdit = useCallback(
        async (formData: QuestionnaireResponseFormData) => {
            const { context } = formData;
            const inProgressQR: QuestionnaireResponse = {
                ...questionnaireResponse.inProgressQR,
                ...mapFormToResponse(formData.formValues, context.questionnaire),
                status: 'in-progress',
            };
            const initialContext = calcInitialContext(context, formData.formValues);
            const completedQR: QuestionnaireResponse = {
                ...questionnaireResponse.inProgressQR,
                ...mapFormToResponse(
                    removeDisabledAnswers(
                        context.questionnaire,
                        formData.formValues,
                        initialContext,
                    ),
                    context.questionnaire,
                ),
                status: 'completed',
            };
            onChange({ inProgressQR, completedQR });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [questionnaireResponse.inProgressQR, onChange],
    );

    return (
        <QuestionnaireResponseForm
            key={keyRef.current}
            questionnaireLoader={questionnaireServiceLoader(() =>
                Promise.resolve(success(toFirstClassExtension(questionnaire))),
            )}
            serviceProvider={serviceProvider}
            sdcServiceProvider={sdcServiceProvider}
            launchContextParameters={launchContextParameters}
            initialQuestionnaireResponse={questionnaireResponse.inProgressQR}
            onEdit={handleEdit}
            groupItemComponent={groupItemComponent}
            questionItemComponents={questionItemComponents}
            itemControlQuestionItemComponents={itemControlQuestionItemComponents}
            itemControlGroupItemComponents={itemControlGroupItemComponents}
            FormWrapper={FormWrapper}
        />
    );
}
