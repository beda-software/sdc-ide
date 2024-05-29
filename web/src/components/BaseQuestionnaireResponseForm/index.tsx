import {
    QuestionnaireResponseForm,
    questionnaireIdWOAssembleLoader,
} from '@beda.software/fhir-questionnaire';
import { QuestionnaireResponseFormProps } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/questionnaire-response-form-data';
import { ParametersParameter } from '@beda.software/fhir-questionnaire/contrib/aidbox';
import {
    FormItems,
    QuestionnaireResponseFormData,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import { QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import { useRef } from 'react';
import { Form, FormSpy } from 'react-final-form';

import {
    Col,
    Group,
    GTable,
    QuestionBoolean,
    QuestionChoice,
    QuestionDate,
    QuestionDateTime,
    QuestionDecimal,
    QuestionDisplay,
    QuestionString,
    Row,
} from './components';
import { QuestionInteger } from './components/integer';
import { QuestionReference } from './components/reference';
import s from './QuestionnaireResponseForm.module.scss';

interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    serviceProvider: QuestionnaireResponseFormProps['serviceProvider'];
    readOnly?: boolean;
    onChange?: (data: QuestionnaireResponseFormData) => any;
}

type FormValues = FormItems;

export function BaseQuestionnaireResponseForm({
    formData,
    onSubmit,
    readOnly,
    onChange,
    serviceProvider,
}: Props) {
    const previousValues = useRef<FormValues | null>(null);

    const onFormChange = (values: FormValues) => {
        if (_.isEqual(values, previousValues.current)) {
            return;
        }

        onChange?.({ ...formData, formValues: values });

        previousValues.current = values;
    };

    return (
        <QuestionnaireResponseForm
            questionnaireLoader={questionnaireIdWOAssembleLoader(
                formData.context.questionnaire.name ?? 'undefined',
            )}
            initialQuestionnaireResponse={
                formData.context.questionnaireResponse as QuestionnaireResponse
            }
            launchContextParameters={
                formData.context.launchContextParameters as ParametersParameter[]
            }
            serviceProvider={serviceProvider}
            widgetsByQuestionType={{
                date: QuestionDate,
                dateTime: QuestionDateTime,
                string: QuestionString,
                text: QuestionString,
                choice: QuestionChoice,
                boolean: QuestionBoolean,
                display: QuestionDisplay,
                decimal: QuestionDecimal,
                reference: QuestionReference,
                integer: QuestionInteger,
            }}
            widgetsByQuestionItemControl={{
                'inline-choice': QuestionChoice,
            }}
            readOnly={readOnly}
            FormWrapper={({ handleSubmit, items }) => (
                <Form
                    onSubmit={(values) => onSubmit({ ...formData, formValues: values })}
                    initialValues={formData.formValues}
                    render={({ handleSubmit, values, form }) => (
                        <form onSubmit={handleSubmit} className={s.form}>
                            <FormSpy
                                subscription={{ values: true }}
                                onChange={(formState) => {
                                    return onFormChange(formState.values);
                                }}
                            />
                            {items}
                        </form>
                    )}
                />
            )}
            ItemWrapper={({ children }) => <>{children}</>}
            groupItemComponent={Group}
            widgetsByGroupQuestionItemControl={{ col: Col, row: Row, gtable: GTable }}
            autosave
        />
    );
}
