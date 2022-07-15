import { ComponentType } from 'react';
import { Observation, ParametersParameter, Questionnaire, QuestionnaireItem, QuestionnaireResponse, QuestionnaireResponseItem, QuestionnaireResponseItemAnswer } from 'shared/src/contrib/aidbox';
export declare type GroupItemComponent = ComponentType<GroupItemProps>;
export declare type QuestionItemComponent = ComponentType<QuestionItemProps>;
export declare type CustomWidgetsMapping = {
    [linkId: string]: QuestionItemComponent;
};
export declare type QuestionItemComponentMapping = {
    [type: string]: QuestionItemComponent;
};
export declare type ItemControlQuestionItemComponentMapping = {
    [code: string]: QuestionItemComponent;
};
export declare type ItemControlGroupItemComponentMapping = {
    [code: string]: GroupItemComponent;
};
export declare type ItemContext = {
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
export declare type AnswerValue = Required<QuestionnaireResponseItemAnswer>['value'] & Required<Observation>['value'];
export interface RepeatableFormGroupItems {
    question?: string;
    items?: FormItems[];
}
interface NotRepeatableFormGroupItems {
    question?: string;
    items?: FormItems;
}
export declare type FormGroupItems = RepeatableFormGroupItems | NotRepeatableFormGroupItems;
export interface FormAnswerItems<T = any> {
    value: T;
    question?: string;
    items?: FormItems;
}
export declare type FormItems = Record<string, FormGroupItems | FormAnswerItems[]>;
export interface QuestionnaireResponseFormData {
    formValues: FormItems;
    context: {
        questionnaire: Questionnaire;
        questionnaireResponse: QuestionnaireResponse;
        launchContextParameters: ParametersParameter[];
    };
}
export {};
