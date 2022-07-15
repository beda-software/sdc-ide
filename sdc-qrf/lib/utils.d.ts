import { Questionnaire, QuestionnaireItem, QuestionnaireResponse, QuestionnaireResponseItem } from 'shared/src/contrib/aidbox';
import { AnswerValue, FormAnswerItems, FormItems, ItemContext, QuestionnaireResponseFormData } from './types';
export declare function wrapAnswerValue(type: QuestionnaireItem['type'], answer: any): {
    Coding: any;
    string?: undefined;
    Attachment?: undefined;
    Reference?: undefined;
    Quantity?: undefined;
} | {
    string: any;
    Coding?: undefined;
    Attachment?: undefined;
    Reference?: undefined;
    Quantity?: undefined;
} | {
    Attachment: any;
    Coding?: undefined;
    string?: undefined;
    Reference?: undefined;
    Quantity?: undefined;
} | {
    Reference: any;
    Coding?: undefined;
    string?: undefined;
    Attachment?: undefined;
    Quantity?: undefined;
} | {
    Quantity: any;
    Coding?: undefined;
    string?: undefined;
    Attachment?: undefined;
    Reference?: undefined;
} | {
    [x: string]: any;
    Coding?: undefined;
    string?: undefined;
    Attachment?: undefined;
    Reference?: undefined;
    Quantity?: undefined;
};
export declare function getBranchItems(fieldPath: string[], questionnaire: Questionnaire, questionnaireResponse: QuestionnaireResponse): {
    qItem: QuestionnaireItem;
    qrItems: QuestionnaireResponseItem[];
};
export declare function calcContext(initialContext: ItemContext, variables: QuestionnaireItem['variable'], qItem: QuestionnaireItem, qrItem: QuestionnaireResponseItem): ItemContext;
export declare function compareValue(firstAnswerValue: AnswerValue, secondAnswerValue: AnswerValue): 0 | 1 | -1;
export declare function mapFormToResponse(values: FormItems, questionnaire: Questionnaire, keepDisabledAnswers?: boolean): Pick<QuestionnaireResponse, 'item'>;
export declare function mapResponseToForm(resource: QuestionnaireResponse, questionnaire: Questionnaire): FormItems;
export declare function findAnswersForQuestionsRecursive(linkId: string, values?: FormItems): any | null;
export declare function findAnswersForQuestion<T = any>(linkId: string, parentPath: string[], values: FormItems): Array<FormAnswerItems<T>>;
export declare function isValueEqual(firstValue: AnswerValue, secondValue: AnswerValue): boolean;
export declare function getChecker(operator: string): (values: Array<{
    value: any;
}>, answerValue: any) => boolean;
export declare function removeDisabledAnswers(questionnaireItems: QuestionnaireItem[], values: FormItems): FormItems;
export declare function getEnabledQuestions(questionnaireItems: QuestionnaireItem[], parentPath: string[], values: FormItems): QuestionnaireItem[];
export declare function calcInitialContext(qrfDataContext: QuestionnaireResponseFormData['context'], values: FormItems): ItemContext;
export declare function parseFhirQueryExpression(expression: string, context: ItemContext): any[];
