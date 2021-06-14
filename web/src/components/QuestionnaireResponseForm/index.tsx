import _ from 'lodash';
import * as React from 'react';
import { Field, Form as FinalForm, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
    FormAnswerItems,
    FormItems,
    getEnabledQuestions,
    interpolateAnswers,
    isValueEqual,
    mapFormToResponse,
    mapResponseToForm,
} from 'src/utils/questionnaire';
import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'shared/src/contrib/aidbox';
import { Button } from 'src/components/Button';
import { InputField } from 'src/components/InputField';
import { DateTimePickerField } from 'src/components/DateTimePickerField';
import { FormApi, Unsubscribe } from 'final-form';
import { ChoiceField } from 'src/components/ChoiceField';
import { BooleanField } from 'src/components/BooleanField';
import { TerminologyField } from 'src/components/TerminologyField';

import s from './QuestionnaireResponseForm.module.scss';

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

        const initial = mapResponseToForm(resource, questionnaire);
        return initial;
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
        const { linkId, text, item, hidden } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];

        return (
            <div style={hidden ? { opacity: '0.3' } : {}}>
                <Field name={[...fieldPath, 'value', 'string'].join('.')}>
                    {({ input, meta }) => {
                        const inputProps = {
                            ...input,
                            ...(hidden ? { disabled: true } : {}),
                        };
                        return <InputField input={inputProps} meta={meta} label={text} />;
                    }}
                </Field>
                {item ? this.renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </div>
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

    public renderAnswerChoice(questionItem: QuestionnaireItem, parentPath: string[], _formParams: FormRenderProps) {
        const { linkId, text, answerOption, repeats, required, answerValueSet, hidden } = questionItem;
        if (answerValueSet) {
            const fieldPath = [...parentPath, linkId, ...(repeats ? [] : ['0'])];
            const fieldName = fieldPath.join('.');
            return <TerminologyField repeats={repeats} name={fieldName} label={text!} valueSetId={answerValueSet} />;
        }

        const fieldPath = [...parentPath, linkId, ...(repeats ? [] : ['0']), 'value', 'string'];
        const fieldName = fieldPath.join('.');

        return (
            <ChoiceField<FormAnswerItems>
                disabled={hidden}
                name={fieldName}
                label={text}
                options={_.map(answerOption, (opt) => ({
                    value: opt.value.string!,
                    label: opt.value.string!,
                }))}
                initialValue={{
                    value: 'mobile',
                }}
                fieldProps={{
                    validate: required
                        ? (inputValue?: Array<any>) => {
                              if (repeats) {
                                  if (!inputValue?.length) {
                                      return 'Choose at least one option';
                                  }
                              } else {
                                  if (!inputValue) {
                                      return 'Required';
                                  }
                              }

                              return undefined;
                          }
                        : undefined,
                }}
                isEqual={(value1: any, value2: any) => isValueEqual(value1.value, value2.value)}
            />
        );
    }

    public renderBoolean(questionItem: QuestionnaireItem, parentPath: string[], _formParams: FormRenderProps) {
        const { linkId, text, repeats } = questionItem;
        const fieldPath = [...parentPath, linkId, ...(repeats ? [] : ['0']), 'value', 'boolean'];
        const fieldName = fieldPath.join('.');

        return <BooleanField name={fieldName} label={text!} />;
    }

    public renderGroup(
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        // fieldsRenderConfig: FieldsRenderConfig,
    ) {
        const { linkId, item, text, repeats } = questionItem;

        if (item) {
            const baseFieldPath = [...parentPath, linkId];

            if (repeats) {
                return (
                    <Field name={baseFieldPath.join('.')}>
                        {({ input }) => {
                            return (
                                <div>
                                    <p className={s.questLabel}>{text}</p>
                                    <div className={s.repeatsGroupItemsContainer}>
                                        {_.map(
                                            input.value.items && input.value.items.length ? input.value.items : [{}],
                                            (_elem, index: number) => {
                                                if (index > 0 && !input.value.items[index]) {
                                                    return null;
                                                }
                                                return (
                                                    <div key={index} className={s.repeatsGroupItemTitle}>
                                                        <div className={s.repeatsGroupItemHeader}>
                                                            <span className={s.repeatsGroupItemTitle}>{`${
                                                                questionItem.text
                                                            } #${index + 1}`}</span>
                                                            <div
                                                                onClick={() => {
                                                                    const filteredArray = _.filter(
                                                                        input.value.items,
                                                                        (_val, valIndex: number) => valIndex !== index,
                                                                    );
                                                                    input.onChange({ items: [...filteredArray] });
                                                                }}
                                                                className={s.repeatsGroupRemoveItemButton}
                                                            >
                                                                <span className={s.repeatsGroupRemoveItemButtonTitle}>
                                                                    Remove
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={s.repeatsGroupItemBody}>
                                                            {this.renderQuestions(
                                                                item,
                                                                [...parentPath, linkId, 'items', index.toString()],
                                                                formParams,
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                    <div
                                        className={s.repeatsGroupAddItemButton}
                                        onClick={() => {
                                            const existingItems = input.value.items || [];
                                            const updatedInput = { items: [...existingItems, {}] };
                                            input.onChange(updatedInput);
                                        }}
                                    >
                                        <p className={s.repeatsGroupAddItemButtonTitle}>{`+ Add another ${text}`}</p>
                                    </div>
                                </div>
                            );
                        }}
                    </Field>
                );
            }

            return (
                <div style={{ paddingBottom: 10 }}>
                    <p className={s.questLabel}>{text}</p>
                    {this.renderQuestions(item, [...parentPath, linkId, 'items'], formParams)}
                </div>
            );
        }
        return null;
    }

    public renderAnswer(rawQuestionItem: QuestionnaireItem, parentPath: string[], formParams: FormRenderProps): any {
        const questionItem = {
            ...rawQuestionItem,
            text: interpolateAnswers(rawQuestionItem.text!, parentPath, formParams.values),
        };
        // const { linkId, type, item, text } = questionItem;
        const { type } = questionItem;

        if (type === 'string' || type === 'text') {
            return this.renderRepeatsAnswer(this.renderAnswerText, questionItem, parentPath, formParams);
        }

        if (type === 'date' || type === 'dateTime') {
            return this.renderRepeatsAnswer(this.renderAnswerDateTime, questionItem, parentPath, formParams);
        }

        if (type === 'choice') {
            return this.renderAnswerChoice(questionItem, parentPath, formParams);
        }

        if (type === 'boolean') {
            return this.renderBoolean(questionItem, parentPath, formParams);
        }

        if (type === 'display') {
            return <div>{questionItem.text}</div>;
        }

        if (type === 'group') {
            return this.renderGroup(questionItem, parentPath, formParams);
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
        );
    };

    protected onFormChange = (form: FormApi<FormValues>): Unsubscribe => {
        const unsubscribe = form.subscribe(
            ({ values }) => {
                const { onChange } = this.props;
                if (onChange) {
                    if (!_.isEqual(values, this.toFormValues())) {
                        const updatedResource = this.fromFormValues(values);
                        onChange(updatedResource);
                    }
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
                mutators={{ ...arrayMutators }}
                // debug={console.log}
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
