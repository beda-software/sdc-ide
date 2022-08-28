import _ from 'lodash';
import { useRef, useCallback, useMemo } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Select from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';
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
                        onChange={(formState) => {
                            return onFormChange(formState.values);
                        }}
                    />
                    <QuestionnaireResponseFormProvider
                        formValues={values}
                        setFormValues={(newValues) => form.change('', newValues)}
                        groupItemComponent={Group}
                        questionItemComponents={{
                            string: QuestionString,
                        }}
                        itemControlQuestionItemComponents={{
                            select: QuestionSelect,
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

export function QuestionSelectWrapper({ value, onChange, options }: StateManagerProps<any>) {
    const newValue = useMemo(() => {
        if (value.Coding) {
            return { label: value.Coding?.display };
        }
        return { label: value.label };
    }, [value]);
    const newOnChange = useCallback(
        (values: any, option: any) => {
            onChange && onChange(values.value, option);
        },
        [onChange],
    );

    return (
        <Select
            options={options?.map((c: any) => {
                return {
                    label: c.value?.Coding.display,
                    value: c.value,
                };
            })}
            onChange={newOnChange}
            value={newValue}
        />
    );
}

function QuestionSelect({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, answerOption } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value'];
    const fieldName = fieldPath.join('.');
    const children = answerOption ? answerOption : [];

    return (
        <Field name={fieldName}>
            {({ input }) => {
                return (
                    <div>
                        <label>{text}</label>
                        <QuestionSelectWrapper options={children} {...input} />
                    </div>
                );
            }}
        </Field>
    );
}
