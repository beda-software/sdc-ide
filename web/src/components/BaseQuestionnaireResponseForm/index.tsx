import _ from 'lodash';
import { useRef } from 'react';
import { Form, FormSpy } from 'react-final-form';
import {
    calcInitialContext,
    FormItems,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf/src';

import { Group, QuestionBoolean, QuestionChoice, QuestionDate, QuestionDisplay, QuestionString } from './components';

interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    readOnly?: boolean;
    onChange?: (data: QuestionnaireResponseFormData) => any;
}

type FormValues = FormItems;

export function BaseQuestionnaireResponseForm({ formData, onSubmit, readOnly, onChange }: Props) {
    const previousValues = useRef<FormValues | null>(null);

    const onFormChange = (values: FormValues) => {
        if (_.isEqual(values, previousValues.current)) {
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
                <form onSubmit={handleSubmit}>
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
                        questionItemComponents={{
                            date: QuestionDate,
                            string: QuestionString,
                            text: QuestionString,
                            choice: QuestionChoice,
                            boolean: QuestionBoolean,
                            display: QuestionDisplay,
                        }}
                        readOnly={readOnly}
                    >
                        <>
                            <QuestionItems
                                questionItems={formData.context.questionnaire.item!}
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

