import _ from 'lodash';
import { useRef } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import {
    calcInitialContext,
    FormItems,
    GroupItemProps,
    QuestionItemProps,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
    useQuestionnaireResponseFormContext,
} from 'sdc-qrf/src';

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
                        onChange={(formState) => onFormChange(formState.values)}
                    />
                    <QuestionnaireResponseFormProvider
                        formValues={values}
                        setFormValues={(newValues) => form.change('', newValues)}
                        groupItemComponent={Group}
                        questionItemComponents={{
                            string: QuestionString,
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

function Group({ parentPath, questionItem, context }: GroupItemProps) {
    const { linkId, text, item } = questionItem;
    const fieldPath = [...parentPath, linkId, 'items'];

    return (
        <div>
            <div>
                <b>{text}</b>
            </div>
            <QuestionItems questionItems={item!} parentPath={fieldPath} context={context[0]} />
        </div>
    );
}

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'string'];
    const fieldName = fieldPath.join('.');

    return (
        <Field name={fieldName}>
            {({ input, meta }) => (
                <div>
                    <label>{text}</label>
                    <input
                        type="text"
                        {...input}
                        readOnly={qrfContext.readOnly || readOnly || hidden}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                </div>
            )}
        </Field>
    );
}
