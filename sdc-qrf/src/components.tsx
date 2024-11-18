import { Expression } from 'fhir/r4b';
import fhirpath from 'fhirpath';
import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import React, { ReactChild, useEffect, useContext, useMemo, useRef, useState } from 'react';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import { useQuestionnaireResponseFormContext } from '.';
import { QRFContext } from './context';
import {
    FormAnswerItems,
    ItemContext,
    QRFContextData,
    QuestionItemProps,
    QuestionItemsProps,
} from './types';
import {
    calcContext,
    findExtensionByUrl,
    getBranchItems,
    getEnabledQuestions,
    wrapAnswerValue,
} from './utils';

export function usePreviousValue<T = any>(value: T) {
    const prevValue = useRef<T>();

    useEffect(() => {
        prevValue.current = value;

        return () => {
            prevValue.current = undefined;
        };
    });

    return prevValue.current;
}

export function QuestionItems(props: QuestionItemsProps) {
    const { questionItems, parentPath, context } = props;
    const { formValues } = useQuestionnaireResponseFormContext();

    return (
        <React.Fragment>
            {getEnabledQuestions(questionItems, parentPath, formValues, context).map((item) => {
                return (
                    <QuestionItem
                        key={item.linkId}
                        questionItem={item}
                        context={context}
                        parentPath={parentPath}
                    />
                );
            })}
        </React.Fragment>
    );
}

const cqfExpressionExtensionUrl = 'http://hl7.org/fhir/StructureDefinition/cqf-expression';

export function QuestionItem(props: QuestionItemProps) {
    const { questionItem: initialQuestionItem, context: initialContext, parentPath } = props;
    const {
        questionItemComponents,
        customWidgets,
        groupItemComponent,
        itemControlQuestionItemComponents,
        itemControlGroupItemComponents,
    } = useContext(QRFContext);
    const { formValues, setFormValues } = useQuestionnaireResponseFormContext();
    const [questionItem, setQuestionItem] = useState(initialQuestionItem);
    const prevQuestionItem: QuestionnaireItem | undefined = usePreviousValue(questionItem);

    const {
        type,
        linkId,
        calculatedExpression,
        variable,
        repeats,
        itemControl,
        _text,
        _readOnly,
        _required,
    } = questionItem;
    const fieldPath = useMemo(() => [...parentPath, linkId!], [parentPath, linkId]);

    // TODO: how to do when item is not in QR (e.g. default element of repeatable group)
    const branchItems = getBranchItems(
        fieldPath,
        initialContext.questionnaire,
        initialContext.resource,
    );
    const context =
        type === 'group'
            ? branchItems.qrItems.map((curQRItem) =>
                  calcContext(initialContext, variable, branchItems.qItem, curQRItem),
              )
            : calcContext(initialContext, variable, branchItems.qItem, branchItems.qrItems[0]!);
    const prevAnswers: FormAnswerItems[] | undefined = usePreviousValue(
        _.get(formValues, fieldPath),
    );

    const itemContext = isGroupItem(questionItem, context) ? context[0] : context;

    useEffect(() => {
        // TODO: think about use cases for group context
        if (itemContext && calculatedExpression) {
            const newValues = evaluateQuestionItemExpression(
                linkId,
                'calculatedExpression',
                itemContext,
                calculatedExpression,
            );

            const newAnswers: FormAnswerItems[] | undefined = newValues.length
                ? repeats
                    ? newValues.map((answer: any) => ({
                          value: wrapAnswerValue(type, answer),
                      }))
                    : [{ value: wrapAnswerValue(type, newValues[0]) }]
                : undefined;

            if (
                !isEqual(
                    newAnswers?.map((answer) => answer.value),
                    prevAnswers?.map((answer) => answer.value),
                )
            ) {
                const allValues = _.set(_.cloneDeep(formValues), fieldPath, newAnswers);
                setFormValues(allValues, fieldPath, newAnswers);
            }
        }
    }, [
        setFormValues,
        formValues,
        calculatedExpression,
        context,
        parentPath,
        repeats,
        type,
        linkId,
        itemContext,
        prevAnswers,
        fieldPath,
    ]);

    useEffect(() => {
        if (itemContext && _text) {
            const extension = findExtensionByUrl(cqfExpressionExtensionUrl, _text.extension);
            const cqfExpression = extension?.valueExpression;
            const calculatedValue =
                evaluateQuestionItemExpression(
                    linkId,
                    '_text.cqfExpression',
                    itemContext,
                    cqfExpression,
                )[0] ?? initialQuestionItem.text;

            if (prevQuestionItem?.text !== calculatedValue) {
                setQuestionItem((qi) => ({
                    ...qi,
                    text: calculatedValue,
                }));
            }
        }

        if (itemContext && _readOnly) {
            const extension = findExtensionByUrl(cqfExpressionExtensionUrl, _readOnly.extension);
            const cqfExpression = extension?.valueExpression;
            const calculatedValue =
                evaluateQuestionItemExpression(
                    linkId,
                    '_readOnly.cqfExpression',
                    itemContext,
                    cqfExpression,
                )[0] ?? initialQuestionItem.readOnly;

            if (prevQuestionItem?.readOnly !== calculatedValue) {
                setQuestionItem((qi) => ({
                    ...qi,
                    readOnly: calculatedValue,
                }));
            }
        }

        if (itemContext && _required) {
            const extension = findExtensionByUrl(cqfExpressionExtensionUrl, _required.extension);
            const cqfExpression = extension?.valueExpression;
            const calculatedValue =
                evaluateQuestionItemExpression(
                    linkId,
                    '_required.cqfExpression',
                    itemContext,
                    cqfExpression,
                )[0] ?? initialQuestionItem.required;

            if (prevQuestionItem?.required !== calculatedValue) {
                setQuestionItem((qi) => ({
                    ...qi,
                    required: calculatedValue,
                }));
            }
        }
    }, [linkId, initialQuestionItem, prevQuestionItem, itemContext, _text, _readOnly, _required]);

    if (isGroupItem(questionItem, context)) {
        if (itemControl) {
            if (
                !itemControlGroupItemComponents ||
                !itemControlGroupItemComponents[itemControl.coding![0]!.code!]
            ) {
                console.warn(`QRF: Unsupported group itemControl '${itemControl.coding![0]!
                    .code!}'. 
                Please define 'itemControlGroupWidgets' for '${itemControl.coding![0]!.code!}'`);
                const DefaultComponent = groupItemComponent;
                return DefaultComponent ? (
                    <DefaultComponent
                        context={context}
                        parentPath={parentPath}
                        questionItem={questionItem}
                    />
                ) : null;
            }

            const Component = itemControlGroupItemComponents[itemControl.coding![0]!.code!]!;

            return (
                <Component context={context} parentPath={parentPath} questionItem={questionItem} />
            );
        }
        if (!groupItemComponent) {
            console.warn(`QRF: groupWidget is not specified but used in questionnaire.`);

            return null;
        }

        const GroupWidgetComponent = groupItemComponent;

        return (
            <GroupWidgetComponent
                context={context}
                parentPath={parentPath}
                questionItem={questionItem}
            />
        );
    }

    if (itemControl) {
        if (
            !itemControlQuestionItemComponents ||
            !itemControlQuestionItemComponents[itemControl.coding![0]!.code!]
        ) {
            console.warn(
                `QRF: Unsupported itemControl '${itemControl.coding![0]!.code!}'.
Please define 'itemControlWidgets' for '${itemControl.coding![0]!.code!}'`,
            );

            const DefaultComponent = questionItemComponents[questionItem.type];
            return DefaultComponent ? (
                <DefaultComponent
                    context={context}
                    parentPath={parentPath}
                    questionItem={questionItem}
                />
            ) : null;
        }

        const Component = itemControlQuestionItemComponents[itemControl.coding![0]!.code!]!;

        return <Component context={context} parentPath={parentPath} questionItem={questionItem} />;
    }

    // TODO: deprecate!
    if (customWidgets && linkId && linkId in customWidgets) {
        console.warn(
            `QRF: 'customWidgets' are deprecated, use 'Questionnaire.item.itemControl' instead`,
        );

        if (type === 'group') {
            console.error(`QRF: Use 'itemControl' for group custom widgets`);
            return null;
        }

        const Component = customWidgets[linkId]!;

        return <Component context={context} parentPath={parentPath} questionItem={questionItem} />;
    }

    if (type in questionItemComponents) {
        const Component = questionItemComponents[type]!;

        return <Component context={context} parentPath={parentPath} questionItem={questionItem} />;
    }

    console.error(`QRF: Unsupported item type '${type}'`);

    return null;
}

export function QuestionnaireResponseFormProvider({
    children,
    ...props
}: QRFContextData & { children: ReactChild }) {
    return <QRFContext.Provider value={props}>{children}</QRFContext.Provider>;
}

/* Helper that resolves right context type */
function isGroupItem(
    questionItem: QuestionnaireItem,
    context: ItemContext | ItemContext[],
): context is ItemContext[] {
    return questionItem.type === 'group';
}

export function evaluateQuestionItemExpression(
    linkId: string,
    path: string,
    context: ItemContext,
    expression?: Expression,
) {
    if (!expression) {
        return [];
    }

    if (expression.language !== 'text/fhirpath') {
        console.error('Only fhirpath expression is supported');
        return [];
    }

    try {
        return fhirpath.evaluate(context.context ?? {}, expression.expression!, context);
    } catch (err: unknown) {
        throw Error(`FHIRPath expression evaluation failure for ${linkId}.${path}: ${err}`);
    }
}
