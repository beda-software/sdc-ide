import fhirpath from 'fhirpath';
import isEqual from 'lodash/isEqual';
import { useContext, useMemo } from 'react';
import * as React from 'react';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';
import { usePreviousValue } from 'shared/src/hooks/previous-value';
import { getByPath, setByPath } from 'shared/src/utils/path';

import { useQuestionnaireResponseFormContext } from '.';
import { QRFContext } from './context';
import { ItemContext, QRFContextData, QuestionItemProps, QuestionItemsProps } from './types';
import {
    calcContext,
    getBranchItems,
    getEnabledQuestions,
    wrapAnswerValue,
    removeDisabledAnswers,
} from './utils';

export function QuestionItems(props: QuestionItemsProps) {
    const { questionItems, parentPath, context } = props;
    const { formValues } = useQuestionnaireResponseFormContext();
    const cleanValues = removeDisabledAnswers(context.questionnaire.item!, formValues);

    return (
        <>
            {getEnabledQuestions(questionItems, parentPath, cleanValues).map((item, index) => {
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
    const { formValues, setFormValues } = useQuestionnaireResponseFormContext();

    const { type, linkId, calculatedExpression, variable, repeats, itemControl } = questionItem;
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
    const prevAnswers = usePreviousValue(getByPath(formValues, fieldPath));

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
                    setFormValues(setByPath(formValues, fieldPath, newAnswers));
                }
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
        questionItem,
        prevAnswers,
        fieldPath,
    ]);

    if (isGroupItem(questionItem, context)) {
        if (itemControl) {
            if (
                !itemControlGroupItemComponents ||
                !itemControlGroupItemComponents[itemControl?.coding?.[0]?.code!]
            ) {
                console.warn(`QRF: Unsupported group itemControl '${itemControl?.coding?.[0]
                    ?.code!}'. 
                Please define 'itemControlGroupWidgets' for '${itemControl?.coding?.[0]?.code!}'`);

                return null;
            }

            const Component = itemControlGroupItemComponents[itemControl?.coding?.[0]?.code!]!;

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
            !itemControlQuestionItemComponents[itemControl.coding?.[0]?.code!]
        ) {
            console.warn(
                `QRF: Unsupported itemControl '${itemControl?.coding?.[0]?.code!}'.
Please define 'itemControlWidgets' for '${itemControl?.coding?.[0]?.code!}'`,
            );

            return null;
        }

        const Component = itemControlQuestionItemComponents[itemControl?.coding?.[0]?.code!]!;

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
