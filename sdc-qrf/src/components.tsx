import fhirpath from 'fhirpath';
import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import React, { ReactChild, useEffect, useContext, useMemo, useRef } from 'react';

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
import { calcContext, getBranchItems, getEnabledQuestions, wrapAnswerValue } from './utils';

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
            {getEnabledQuestions(questionItems, parentPath, formValues, context).map(
                (item, index) => {
                    return (
                        <QuestionItem
                            key={index}
                            questionItem={item}
                            context={context}
                            parentPath={parentPath}
                        />
                    );
                },
            )}
        </React.Fragment>
    );
}

export function QuestionItem(props: QuestionItemProps) {
    const { questionItem, context: initialContext, parentPath } = props;
    const {
        questionItemComponents,
        customWidgets,
        groupItemComponent,
        itemControlQuestionItemComponents,
        itemControlGroupItemComponents,
    } = useContext(QRFContext);
    const { formValues, setFormValues } = useQuestionnaireResponseFormContext();

    const { type, linkId, calculatedExpression, variable, repeats, itemControl, cqfExpression } =
        questionItem;
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

    useEffect(() => {
        if (!isGroupItem(questionItem, context) && calculatedExpression) {
            // TODO: Add support for x-fhir-query
            if (calculatedExpression.language === 'text/fhirpath') {
                try {
                    const newValues = fhirpath.evaluate(
                        context.context || {},
                        calculatedExpression.expression!,
                        context as ItemContext,
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
                } catch (err: unknown) {
                    throw Error(
                        `FHIRPath expression evaluation failure for "calculatedExpression" in ${questionItem.linkId}: ${err}`,
                    );
                }
            }
        }
        if (!isGroupItem(questionItem, context) && cqfExpression) {
            try {
                if (cqfExpression.language === 'text/fhirpath') {
                    questionItem.text = fhirpath.evaluate(
                        context.context || {},
                        cqfExpression.expression!,
                        context as ItemContext,
                    )[0];
                }
            } catch (err: unknown) {
                throw Error(
                    `FHIRPath expression evaluation failure for "cqfExpression" in ${questionItem.linkId}: ${err}`,
                );
            }
        }
    }, [
        setFormValues,
        formValues,
        calculatedExpression,
        cqfExpression,
        context,
        parentPath,
        repeats,
        type,
        questionItem,
        prevAnswers,
        fieldPath,
    ]);

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
