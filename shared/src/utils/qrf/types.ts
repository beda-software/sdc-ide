import { ComponentType } from 'react';

import {
    Observation,
    ParametersParameter,
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireResponse,
    QuestionnaireResponseItem,
    QuestionnaireResponseItemAnswer,
} from 'shared/src/contrib/aidbox';

export type GroupItemComponent = ComponentType<GroupItemProps>;
export type QuestionItemComponent = ComponentType<QuestionItemProps>;

export type CustomWidgetsMapping = {
    // [linkId: QuestionnaireItem['linkId']]: QuestionItemComponent;
    [linkId: string]: QuestionItemComponent;
};

export type QuestionItemComponentMapping = {
    // [type: QuestionnaireItem['type']]: QuestionItemComponent;
    [type: string]: QuestionItemComponent;
};

export type ItemControlQuestionItemComponentMapping = {
    [code: string]: QuestionItemComponent;
};

export type ItemControlGroupItemComponentMapping = {
    [code: string]: GroupItemComponent;
};

export type ItemContext = {
    resource: QuestionnaireResponse;
    questionnaire: Questionnaire;
    context: QuestionnaireResponseItem | QuestionnaireResponse;
    qitem?: QuestionnaireItem;
    [x: string]: any;
};

export interface QRFContextData {
    questionItemComponents: QuestionItemComponentMapping;
    groupItemComponent?: GroupItemComponent;
    customWidgets?: CustomWidgetsMapping;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    readOnly?: boolean;

    formValues: FormItems;
    setFormValues: (values: FormItems) => void;
}

export interface QuestionItemsProps {
    questionItems: QuestionnaireItem[];

    context: ItemContext;
    parentPath: string[];
}

export interface QuestionItemProps {
    questionItem: QuestionnaireItem;

    context: ItemContext;
    parentPath: string[];
}

export interface GroupItemProps {
    questionItem: QuestionnaireItem;

    context: ItemContext[];
    parentPath: string[];
}

export type AnswerValue = Required<QuestionnaireResponseItemAnswer>['value'] &
    Required<Observation>['value'];

export interface RepeatableFormGroupItems {
    question?: string;
    items?: FormItems[];
}

interface NotRepeatableFormGroupItems {
    question?: string;
    items?: FormItems;
}

export type FormGroupItems = RepeatableFormGroupItems | NotRepeatableFormGroupItems;

export interface FormAnswerItems<T = any> {
    value: T;
    question?: string;
    items?: FormItems;
}

export type FormItems = Record<string, FormGroupItems | FormAnswerItems[]>;

export interface QuestionnaireResponseFormData {
    formValues: FormItems;
    context: {
        questionnaire: Questionnaire;
        questionnaireResponse: QuestionnaireResponse;
        launchContextParameters: ParametersParameter[];
    };
}
