import fhirpath from 'fhirpath';
import isEqual from 'lodash/isEqual';
import { useContext } from 'react';
import * as React from 'react';
import { useForm, useFormState } from 'react-final-form';

import { QuestionnaireItem } from '../../contrib/aidbox';
import { usePreviousValue } from '../../hooks/previous-value';
import { getByPath } from '../path';
import { QRFContext } from './context';
import {
    FormItems,
    ItemContext,
    QRFContextData,
    QuestionItemProps,
    QuestionItemsProps,
} from './types';
import { calcContext, getBranchItems, getEnabledQuestions, wrapAnswerValue } from './utils';

export function QuestionItems(props: QuestionItemsProps) {
    const { questionItems, parentPath, context } = props;
    const { values } = useFormState<FormItems>();

    return (
        <>
            {getEnabledQuestions(questionItems, parentPath, values).map((item, index) => {
                return (
                    <QuestionItem
                        key={index}
                        questionItem={item}
                        context={context}
                        parentPath={parentPath}
                    />
                );
            })}
        </>
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

    const { values } = useFormState<FormItems>();
    const form = useForm<FormItems>();

    const { type, linkId, calculatedExpression, variable, repeats, hidden, itemControl } =
        questionItem;
    const fieldPath = [...parentPath, linkId];
    const fieldName = fieldPath.join('.');
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
            : calcContext(initialContext, variable, branchItems.qItem, branchItems.qrItems[0]);
    const prevAnswers = usePreviousValue(getByPath(values, fieldPath));

    React.useEffect(() => {
        if (!isGroupItem(questionItem, context) && calculatedExpression) {
            // TODO:
            if (calculatedExpression.language === 'text/fhirpath') {
                const newValues = fhirpath.evaluate(
                    context.context || {},
                    calculatedExpression.expression!,
                    context as ItemContext,
                );
                const newAnswers = newValues.length
                    ? repeats
                        ? newValues.map((answer) => ({ value: wrapAnswerValue(type, answer) }))
                        : [{ value: wrapAnswerValue(type, newValues[0]) }]
                    : undefined;

                if (!isEqual(newAnswers, prevAnswers)) {
                    form.change(fieldName, newAnswers);
                }
            }
        }
    }, [
        form,
        values,
        calculatedExpression,
        context,
        parentPath,
        repeats,
        type,
        questionItem,
        prevAnswers,
        fieldName,
    ]);

    if (hidden) {
        return null;
    }

    if (isGroupItem(questionItem, context)) {
        if (itemControl) {
            if (
                !itemControlGroupItemComponents ||
                !itemControlGroupItemComponents[itemControl.code!]
            ) {
                console.warn(`QRF: Unsupported group itemControl '${itemControl.code!}'. 
                Please define 'itemControlGroupWidgets' for '${itemControl.code!}'`);

                return null;
            }

            const Component = itemControlGroupItemComponents[itemControl.code!];

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
            !itemControlQuestionItemComponents[itemControl.code!]
        ) {
            console.warn(
                `QRF: Unsupported itemControl '${itemControl.code!}'. Please define 'itemControlWidgets' for '${itemControl.code!}'`,
            );

            return null;
        }

        const Component = itemControlQuestionItemComponents[itemControl.code!];

        return <Component context={context} parentPath={parentPath} questionItem={questionItem} />;
    }

    // TODO: deprecate!
    if (customWidgets && linkId in customWidgets) {
        console.warn(
            `QRF: 'customWidgets' are deprecated, use 'Questionnaire.item.itemControl' instead`,
        );

        if (type === 'group') {
            console.error(`QRF: Use 'itemControl' for group custom widgets`);
            return null;
        }

        const Component = customWidgets[linkId];

        return <Component context={context} parentPath={parentPath} questionItem={questionItem} />;
    }

    if (type in questionItemComponents) {
        const Component = questionItemComponents[type];

        return <Component context={context} parentPath={parentPath} questionItem={questionItem} />;
    }

    console.error(`QRF: Unsupported item type '${type}'`);

    return null;
}

export function QuestionnaireResponseFormProvider({
    children,
    ...props
}: QRFContextData & { children: React.ReactChild }) {
    return <QRFContext.Provider value={props}>{children}</QRFContext.Provider>;
}

/* Helper that resolves right context type */
function isGroupItem(
    questionItem: QuestionnaireItem,
    context: ItemContext | ItemContext[],
): context is ItemContext[] {
    return questionItem.type === 'group';
}
