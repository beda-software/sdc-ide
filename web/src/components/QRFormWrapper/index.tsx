import { BaseQuestionnaireResponseForm } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/BaseQuestionnaireResponseForm';
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
import { useFormContext } from 'react-hook-form';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';

import { RemoteData } from 'fhir-react/lib/libs/remoteData';
import { sequenceMap } from 'fhir-react/lib/services/service';
import { formatError } from 'fhir-react/lib/utils/error';

import { QuestionnaireResponse as FCEQuestionnaireResponse } from 'shared/src/contrib/aidbox';

import {
    Col,
    GTable,
    Group,
    QuestionBoolean,
    QuestionChoice,
    QuestionDate,
    QuestionDateTime,
    QuestionDecimal,
    QuestionDisplay,
    QuestionString,
    Row,
} from '../BaseQuestionnaireResponseForm/components';
import { QuestionInteger } from '../BaseQuestionnaireResponseForm/components/integer';
import { QuestionReference } from '../BaseQuestionnaireResponseForm/components/reference';
import s from '../BaseQuestionnaireResponseForm/QuestionnaireResponseForm.module.scss';


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
    const remoteDataResult = sequenceMap({
        questionnaireRD,
        questionnaireResponseRD,
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
                    widgetsByQuestionType={{
                        // date: QuestionDate,
                        //     dateTime: QuestionDateTime,
                        string: QuestionString,
                        //     text: QuestionString,
                        //     choice: QuestionChoice,
                        //     boolean: QuestionBoolean,
                        //     display: QuestionDisplay,
                        decimal: QuestionDecimal,
                        // reference: QuestionReference,
                        //     integer: QuestionInteger,
                    }}
                    widgetsByQuestionItemControl={{
                        'inline-choice': QuestionChoice,
                    }}
                    onSubmit={(newFormData) => {
                        const fceQR: FCEQuestionnaireResponse = {
                            ...toFirstClassExtension(data.questionnaireResponseRD),
                            ...mapFormToResponse(newFormData.formValues, data.questionnaireRD),
                        };
                        onChange(fromFirstClassExtension(fceQR));
                    }}
                    groupItemComponent={Group}
                    widgetsByGroupQuestionItemControl={{ col: Col, row: Row, gtable: GTable }}
                    FormWrapper={FormWrapper}
                />
            )}
        </RenderRemoteData>
    );
}

function FormWrapper({ handleSubmit, items }: { handleSubmit: any; items: any }) {
    const { watch } = useFormContext();

    watch(() => {
        handleSubmit();
    });

    return (
        <form onSubmit={handleSubmit} className={s.form}>
            {items}
        </form>
    );
}
