import _ from 'lodash';
import { useRef } from 'react';
import { Form, FormSpy } from 'react-final-form';
import {
    calcInitialContext,
    FormItems,
    getItemKey,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
    removeItemKey,
} from 'sdc-qrf';

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
    QuestionTime,
    Row,
} from './components';
import { QuestionInteger } from './components/integer';
import { QuestionQuantity } from './components/quantity';
import { QuestionReference } from './components/reference';
import s from './QuestionnaireResponseForm.module.scss';

interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
    onChange?: (data: QuestionnaireResponseFormData) => any;
}

type FormValues = FormItems;

function isFormItemsEqualCustomizer(first: any, second: any) {
    if (
        _.isPlainObject(first) &&
        _.isPlainObject(second) &&
        getItemKey(first) &&
        getItemKey(second)
    ) {
        return _.isEqualWith(
            removeItemKey(first),
            removeItemKey(second),
            isFormItemsEqualCustomizer,
        );
    }

    return undefined;
}

function isFormItemsEqual(first: FormItems, second: FormItems) {
    return _.isEqualWith(first, second, isFormItemsEqualCustomizer);
}

export function BaseQuestionnaireResponseForm({ formData, onSubmit, readOnly, onChange }: Props) {
    const previousValues = useRef<FormValues | null>(null);

    const onFormChange = (values: FormValues) => {
        if (previousValues.current && isFormItemsEqual(values, previousValues.current)) {
            return;
        }

        onChange?.({ ...formData, formValues: values });

        previousValues.current = values;
    };

    return (
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
                    <QuestionnaireResponseFormProvider
                        formValues={values}
                        setFormValues={(newValues) => form.change('', newValues)}
                        groupItemComponent={Group}
                        itemControlGroupItemComponents={{ col: Col, row: Row, gtable: GTable }}
                        questionItemComponents={{
                            date: QuestionDate,
                            time: QuestionTime,
                            dateTime: QuestionDateTime,
                            string: QuestionString,
                            text: QuestionString,
                            choice: QuestionChoice,
                            boolean: QuestionBoolean,
                            display: QuestionDisplay,
                            decimal: QuestionDecimal,
                            reference: QuestionReference,
                            integer: QuestionInteger,
                            quantity: QuestionQuantity,
                        }}
                        readOnly={readOnly}
                    >
                        <>
                            <QuestionItems
                                questionItems={formData.context.fceQuestionnaire.item!}
                                parentPath={[]}
                                context={calcInitialContext(formData.context, values)}
                            />
                        </>
                    </QuestionnaireResponseFormProvider>
                </form>
            )}
        />
    );
}
