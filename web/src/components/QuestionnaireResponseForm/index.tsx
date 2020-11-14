import _ from 'lodash';
import * as React from 'react';
import { Field, Form as FinalForm, FormRenderProps } from 'react-final-form';

import {
    FormItems,
    getEnabledQuestions,
    interpolateAnswers,
    mapFormToResponse,
    mapResponseToForm,
} from 'src/utils/questionnaire';
import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'shared/lib/contrib/aidbox';
import { Button } from 'src/components/Button';
import { InputField } from 'src/components/InputField';
import { DateTimePickerField } from 'src/components/DateTimePickerField';
import { FormApi, Unsubscribe } from 'final-form';

interface Props {
    resource: QuestionnaireResponse;
    questionnaire: Questionnaire;
    onSave: (resource: QuestionnaireResponse) => Promise<any> | void;
    onChange?: (resource: QuestionnaireResponse) => void;
    customWidgets?: {
        [linkId: string]: (
            questionItem: QuestionnaireItem,
            fieldPath: string[],
            formParams: FormRenderProps,
        ) => React.ReactNode;
    };
    readOnly?: boolean;
}

interface State {
    activeTab: number;
}

type FormValues = FormItems;

export class QuestionnaireResponseForm extends React.Component<Props, State> {
    public state = { activeTab: 0 };

    public onSave = async (values: FormValues) => {
        const { onSave } = this.props;
        const updatedResource = this.fromFormValues(values);

        return onSave(updatedResource);
    };

    public fromFormValues(values: FormValues) {
        const { questionnaire, resource } = this.props;

        return {
            ...resource,
            ...mapFormToResponse(values, questionnaire),
        };
    }

    public toFormValues(): FormValues {
        const { resource, questionnaire } = this.props;

        return mapResponseToForm(resource, questionnaire);
    }

    public renderRepeatsAnswer(
        renderAnswer: (
            questionItem: QuestionnaireItem,
            parentPath: string[],
            formParams: FormRenderProps,
            index: number,
        ) => React.ReactNode,
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
    ) {
        const { linkId, text, required, repeats } = questionItem;
        const baseFieldPath = [...parentPath, linkId];

        if (!repeats) {
            return renderAnswer(questionItem, parentPath, formParams, 0);
        }

        if (!required) {
            console.error('TODO: Unsupported question which is not required and repeats');
        }

        return (
            <Field name={baseFieldPath.join('.')}>
                {({ input }) => {
                    return (
                        <div>
                            <div>{text}</div>

                            {_.map(input.value.length ? input.value : [{}], (elem, index: number) => {
                                if (index > 0 && !input.value[index]) {
                                    return null;
                                }

                                return (
                                    <div key={index} className="d-flex">
                                        <div className="flex-grow-1">
                                            {renderAnswer(questionItem, parentPath, formParams, index)}
                                        </div>
                                        {index > 0 ? (
                                            <div
                                                style={{ width: 40, height: 40 }}
                                                className="d-flex align-items-center justify-content-center"
                                                onClick={() =>
                                                    input.onChange(
                                                        _.filter(
                                                            input.value,
                                                            (val, valIndex: number) => valIndex !== index,
                                                        ),
                                                    )
                                                }
                                            >
                                                Delete{' '}
                                            </div>
                                        ) : (
                                            <div style={{ width: 40 }} />
                                        )}
                                    </div>
                                );
                            })}
                            <Button
                                onClick={() => input.onChange(input.value.length ? [...input.value, {}] : [{}, {}])}
                            >
                                Add another answer
                            </Button>
                        </div>
                    );
                }}
            </Field>
        );
    }

    public renderAnswerText(
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) {
        const { linkId, text, item } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];

        return (
            <>
                <Field name={[...fieldPath, 'value', 'string'].join('.')}>
                    {({ input, meta }) => {
                        return <InputField input={input} meta={meta} label={text} />;
                    }}
                </Field>
                {item ? this.renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </>
        );
    }

    public renderAnswerDateTime(
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) {
        const { linkId, text, item } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];

        return (
            <>
                <Field name={[...fieldPath, 'value', 'date'].join('.')}>
                    {({ input, meta }) => {
                        return <DateTimePickerField input={input} meta={meta} label={text} />;
                    }}
                </Field>

                {item ? this.renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </>
        );
    }

    public renderAnswer(rawQuestionItem: QuestionnaireItem, parentPath: string[], formParams: FormRenderProps): any {
        const questionItem = {
            ...rawQuestionItem,
            text: interpolateAnswers(rawQuestionItem.text!, parentPath, formParams.values),
        };
        const { linkId, type, item, text } = questionItem;

        if (type === 'string' || type === 'text') {
            return this.renderRepeatsAnswer(this.renderAnswerText, questionItem, parentPath, formParams);
        }

        if (type === 'date' || type === 'dateTime') {
            return this.renderRepeatsAnswer(this.renderAnswerDateTime, questionItem, parentPath, formParams);
        }

        if (type === 'display') {
            return <div>{questionItem.text}</div>;
        }
        if (type === 'group') {
            if (item) {
                return (
                    <>
                        <div>{text}</div>
                        {this.renderQuestions(item, [...parentPath, linkId, 'items'], formParams)}
                    </>
                );
            }
        }

        console.error(`TODO: Unsupported item type ${type}`);

        return null;
    }

    public renderQuestions(items: QuestionnaireItem[], parentPath: string[], formParams: FormRenderProps) {
        return _.map(getEnabledQuestions(items, parentPath, formParams.values), (item, index) => (
            <div key={index}>{this.renderAnswer(item, parentPath, formParams)}</div>
        ));
    }

    public renderForm = (items: QuestionnaireItem[], formParams: FormRenderProps) => {
        const { readOnly } = this.props;
        const { handleSubmit, submitting } = formParams;

        return (
            <>
                <form autoComplete="off">
                    {this.renderQuestions(items, [], formParams)}
                    {!readOnly && (
                        <div className="questionnaire-form-actions">
                            <Button onClick={handleSubmit} disabled={submitting}>
                                Save
                            </Button>
                        </div>
                    )}
                </form>
            </>
        );
    };

    protected onFormChange = (form: FormApi<FormValues>): Unsubscribe => {
        const unsubscribe = form.subscribe(
            ({ values }) => {
                const { onChange } = this.props;
                if (onChange) {
                    const updatedResource = this.fromFormValues(values);
                    onChange(updatedResource);
                }
            },
            { values: true },
        );

        return () => {
            unsubscribe();
        };
    };

    public render() {
        const { questionnaire } = this.props;

        return (
            <FinalForm<FormValues>
                onSubmit={this.onSave}
                initialValues={this.toFormValues()}
                initialValuesEqual={_.isEqual}
                decorators={[this.onFormChange]}
            >
                {(params) => {
                    const items = getEnabledQuestions(questionnaire.item!, [], params.values);

                    // return this.renderForm(items, { ...params, values: params.values });
                    return this.renderForm(items, params);
                }}
            </FinalForm>
        );
    }
}
