import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { allergiesQuestionnaire } from './resources/questionnaire';
import {
    getEnabledQuestions,
    mapFormToResponse,
    mapResponseToForm,
    removeDisabledAnswers,
} from '../src';

test('Transform nested repeatable-groups from new resource to new resource', () => {
    const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
            {
                linkId: 'root-group',
                type: 'group',
                text: 'Root group',
                item: [
                    {
                        linkId: 'repeatable-group',
                        type: 'group',
                        repeats: true,
                        text: 'Repeatable group',
                        item: [
                            { linkId: 'answer', text: 'Answer', type: 'text', repeats: true },
                            {
                                linkId: 'nested-repeatable-group',
                                text: 'Nested repeatable group',
                                repeats: true,
                                type: 'group',
                                item: [
                                    {
                                        linkId: 'nested-answer',
                                        text: 'Nested answer',
                                        type: 'text',
                                        repeats: true,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const qr: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
                item: [
                    {
                        linkId: 'repeatable-group',
                        item: [
                            {
                                linkId: 'answer',
                                answer: [
                                    { value: { string: 'answer for the first group 1' } },
                                    { value: { string: 'answer for the first group 2' } },
                                ],
                            },
                            {
                                linkId: 'nested-repeatable-group',
                                item: [
                                    {
                                        linkId: 'nested-answer',

                                        answer: [
                                            {
                                                value: {
                                                    string: 'nested answer for the first group 1',
                                                },
                                            },
                                            {
                                                value: {
                                                    string: 'nested answer for the first group 2',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        linkId: 'repeatable-group',
                        item: [
                            {
                                linkId: 'answer',
                                answer: [
                                    { value: { string: 'answer for the second group 1' } },
                                    { value: { string: 'answer for the second group 2' } },
                                ],
                            },
                            {
                                linkId: 'nested-repeatable-group',
                                item: [
                                    {
                                        linkId: 'nested-answer',

                                        answer: [
                                            {
                                                value: {
                                                    string: 'nested answer for the second group 1',
                                                },
                                            },
                                            {
                                                value: {
                                                    string: 'nested answer for the second group 2',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const formItems = mapResponseToForm(qr, questionnaire);
    const actualQR = { ...qr, ...mapFormToResponse(formItems, questionnaire) };

    expect(actualQR).toEqual(qr);
});

test('Transform with initial values', () => {
    const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
            {
                linkId: 'root-group',
                type: 'group',
                text: 'Root group',
                item: [
                    {
                        linkId: 'answer-without-initial',
                        type: 'text',
                    },
                    {
                        linkId: 'answer-with-initial',
                        type: 'text',
                        initial: [{ value: { string: 'initial' } }],
                    },
                ],
            },
        ],
    };

    const initialQR: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
            },
        ],
    };
    const expectedQR: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
                item: [
                    { linkId: 'answer-with-initial', answer: [{ value: { string: 'initial' } }] },
                ],
            },
        ],
    };
    const formItems = mapResponseToForm(initialQR, questionnaire);
    const actualQR = { ...initialQR, ...mapFormToResponse(formItems, questionnaire) };

    expect(actualQR).toEqual(expectedQR);
});

test('enableWhen logic for non-repeatable groups', () => {
    const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
            {
                linkId: 'root-group',
                type: 'group',
                text: 'Root group',
                item: [
                    {
                        linkId: 'non-repeatable-group',
                        type: 'group',
                        text: 'Non Repeatable group',
                        item: [
                            { linkId: 'condition', text: 'Condition', type: 'boolean' },
                            {
                                linkId: 'question-for-yes',
                                text: 'Question for yes',
                                type: 'text',
                                enableWhen: [
                                    {
                                        question: 'condition',
                                        operator: '=',
                                        answer: { boolean: true },
                                    },
                                ],
                            },
                            {
                                linkId: 'question-for-no',
                                text: 'Question for no',
                                type: 'text',
                                enableWhen: [
                                    {
                                        question: 'condition',
                                        operator: '=',
                                        answer: { boolean: false },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const qr: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
                item: [
                    {
                        linkId: 'non-repeatable-group',
                        item: [
                            {
                                linkId: 'condition',
                                answer: [{ value: { boolean: true } }],
                            },
                            {
                                linkId: 'question-for-yes',
                                answer: [{ value: { string: 'yes' } }],
                            },
                            {
                                linkId: 'question-for-no',
                                answer: [{ value: { string: 'no' } }],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const expectedQR: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
                item: [
                    {
                        linkId: 'non-repeatable-group',
                        item: [
                            {
                                linkId: 'condition',
                                answer: [{ value: { boolean: true } }],
                            },
                            {
                                linkId: 'question-for-yes',
                                answer: [{ value: { string: 'yes' } }],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const formItems = mapResponseToForm(qr, questionnaire);
    const enabledFormItems = removeDisabledAnswers(questionnaire, formItems, {
        questionnaire,
        resource: qr,
        context: qr,
    });
    const actualQR = { ...qr, ...mapFormToResponse(enabledFormItems, questionnaire) };

    expect(actualQR).toEqual(expectedQR);
});

test('enableWhen logic for repeatable groups', () => {
    const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
            {
                linkId: 'root-group',
                type: 'group',
                text: 'Root group',
                item: [
                    {
                        linkId: 'repeatable-group',
                        type: 'group',
                        repeats: true,
                        text: 'Repeatable group',
                        item: [
                            { linkId: 'condition', text: 'Condition', type: 'boolean' },
                            {
                                linkId: 'question-for-yes',
                                text: 'Question for yes',
                                type: 'text',
                                enableWhen: [
                                    {
                                        question: 'condition',
                                        operator: '=',
                                        answer: { boolean: true },
                                    },
                                ],
                            },
                            {
                                linkId: 'question-for-no',
                                text: 'Question for no',
                                type: 'text',
                                enableWhen: [
                                    {
                                        question: 'condition',
                                        operator: '=',
                                        answer: { boolean: false },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const qr: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
                item: [
                    {
                        linkId: 'repeatable-group',
                        item: [
                            {
                                linkId: 'condition',
                                answer: [{ value: { boolean: true } }],
                            },
                            {
                                linkId: 'question-for-yes',
                                answer: [{ value: { string: 'yes' } }],
                            },
                            {
                                linkId: 'question-for-no',
                                answer: [{ value: { string: 'no' } }],
                            },
                        ],
                    },
                    {
                        linkId: 'repeatable-group',
                        item: [
                            {
                                linkId: 'condition',
                                answer: [{ value: { boolean: false } }],
                            },
                            {
                                linkId: 'question-for-yes',
                                answer: [{ value: { string: 'yes' } }],
                            },
                            {
                                linkId: 'question-for-no',
                                answer: [{ value: { string: 'no' } }],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const expectedQR: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
                item: [
                    {
                        linkId: 'repeatable-group',
                        item: [
                            {
                                linkId: 'condition',
                                answer: [{ value: { boolean: true } }],
                            },
                            {
                                linkId: 'question-for-yes',
                                answer: [{ value: { string: 'yes' } }],
                            },
                        ],
                    },
                    {
                        linkId: 'repeatable-group',
                        item: [
                            {
                                linkId: 'condition',
                                answer: [{ value: { boolean: false } }],
                            },
                            {
                                linkId: 'question-for-no',
                                answer: [{ value: { string: 'no' } }],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const formItems = mapResponseToForm(qr, questionnaire);
    const enabledFormItems = removeDisabledAnswers(questionnaire, formItems, {
        questionnaire,
        resource: qr,
        context: qr,
    });
    const actualQR = { ...qr, ...mapFormToResponse(enabledFormItems, questionnaire) };

    expect(actualQR).toEqual(expectedQR);
});

test('enableWhenExpression logic', () => {
    const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        status: 'active',
        item: [
            {
                linkId: 'root-group',
                type: 'group',
                text: 'Root group',
                item: [
                    {
                        linkId: 'non-repeatable-group',
                        type: 'group',
                        text: 'Non Repeatable group',
                        item: [
                            { linkId: 'condition', text: 'Condition', type: 'boolean' },
                            {
                                linkId: 'question-for-yes',
                                text: 'Question for yes',
                                type: 'text',
                                enableWhenExpression: {
                                    language: 'text/fhirpath',
                                    expression:
                                        "%resource.repeat(item).where(linkId = 'condition').answer.children().boolean = true",
                                },
                            },
                            {
                                linkId: 'question-for-no',
                                text: 'Question for no',
                                type: 'text',
                                enableWhenExpression: {
                                    language: 'text/fhirpath',
                                    expression:
                                        "%resource.repeat(item).where(linkId = 'condition').answer.children().boolean = false",
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const qr: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
                item: [
                    {
                        linkId: 'non-repeatable-group',
                        item: [
                            {
                                linkId: 'condition',
                                answer: [{ value: { boolean: true } }],
                            },
                            {
                                linkId: 'question-for-yes',
                                answer: [{ value: { string: 'yes' } }],
                            },
                            {
                                linkId: 'question-for-no',
                                answer: [{ value: { string: 'no' } }],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const expectedQR: QuestionnaireResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'completed',
        item: [
            {
                linkId: 'root-group',
                item: [
                    {
                        linkId: 'non-repeatable-group',
                        item: [
                            {
                                linkId: 'condition',
                                answer: [{ value: { boolean: true } }],
                            },
                            {
                                linkId: 'question-for-yes',
                                answer: [{ value: { string: 'yes' } }],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const formItems = mapResponseToForm(qr, questionnaire);
    const enabledQuestionsLinkIds = getEnabledQuestions(
        questionnaire.item?.[0]?.item?.[0]?.item ?? [],
        ['items', 'root-group', 'items'],
        formItems,
        {
            questionnaire,
            resource: qr,
            context: qr,
        },
    ).map((questionnaireItem) => questionnaireItem.linkId);

    expect(enabledQuestionsLinkIds).toStrictEqual(['condition', 'question-for-yes']);

    const enabledFormItems = removeDisabledAnswers(questionnaire, formItems, {
        questionnaire,
        resource: qr,
        context: qr,
    });
    const actualQR = { ...qr, ...mapFormToResponse(enabledFormItems, questionnaire) };

    expect(actualQR).toEqual(expectedQR);
});

test('mapFormToResponse cut empty answers', () => {
    const formValues = {
        type: [
            {
                value: {
                    Coding: {
                        code: '418634005',
                        system: 'http://snomed.ct',
                        display: 'Drug',
                    },
                },
            },
        ],
        reaction: undefined,
        notes: [
            {
                value: {},
            },
        ],
    };

    const result = mapFormToResponse(formValues, allergiesQuestionnaire);
    const answersLinkIds = result.item?.map((answerItem) => answerItem.linkId) ?? [];
    expect(answersLinkIds.includes('reaction')).not.toBe(true);
    expect(answersLinkIds).toEqual(expect.arrayContaining(['type', 'notes']));
});

describe('enableWhen exists logic for non-repeatable groups primitives', () => {
    const testConfigs = [
        {
            name: 'boolean exist',
            q: { linkId: 'condition', text: 'Condition', type: 'boolean' },
            qr: [
                {
                    linkId: 'condition',
                    answer: [{ value: { boolean: true } }],
                },
                {
                    linkId: 'question-for-yes',
                    answer: [{ value: { string: 'yes' } }],
                },
            ],
        },
        {
            name: 'boolean not exist',
            q: { linkId: 'condition', text: 'Condition', type: 'boolean' },
            qr: [
                {
                    linkId: 'question-for-no',
                    answer: [{ value: { string: 'no' } }],
                },
            ],
        },
        {
            name: 'integer exist',
            q: { linkId: 'condition', text: 'Condition', type: 'integer' },
            qr: [
                {
                    linkId: 'condition',
                    answer: [{ value: { integer: 1 } }],
                },
                {
                    linkId: 'question-for-yes',
                    answer: [{ value: { string: 'yes' } }],
                },
            ],
        },
        {
            name: 'integer not exist',
            q: { linkId: 'condition', text: 'Condition', type: 'integer' },
            qr: [
                {
                    linkId: 'question-for-no',
                    answer: [{ value: { string: 'no' } }],
                },
            ],
        },
        {
            name: 'decimal exist',
            q: { linkId: 'condition', text: 'Condition', type: 'decimal' },
            qr: [
                {
                    linkId: 'condition',
                    answer: [{ value: { decimal: 1 } }],
                },
                {
                    linkId: 'question-for-yes',
                    answer: [{ value: { string: 'yes' } }],
                },
            ],
        },
        {
            name: 'decimal not exist',
            q: { linkId: 'condition', text: 'Condition', type: 'decimal' },
            qr: [
                {
                    linkId: 'question-for-no',
                    answer: [{ value: { string: 'no' } }],
                },
            ],
        },
    ];

    test.each(testConfigs)('enableWhen works correctly', async (testConfig) => {
        const questionnaire: Questionnaire = {
            resourceType: 'Questionnaire',
            status: 'active',
            item: [
                {
                    linkId: 'root-group',
                    type: 'group',
                    text: 'Root group',
                    item: [
                        {
                            linkId: 'non-repeatable-group',
                            type: 'group',
                            text: 'Non Repeatable group',
                            item: [
                                testConfig.q,
                                {
                                    linkId: 'question-for-yes',
                                    text: 'Question for yes',
                                    type: 'text',
                                    enableWhen: [
                                        {
                                            question: 'condition',
                                            operator: 'exists',
                                            answer: { boolean: true },
                                        },
                                    ],
                                },
                                {
                                    linkId: 'question-for-no',
                                    text: 'Question for no',
                                    type: 'text',
                                    enableWhen: [
                                        {
                                            question: 'condition',
                                            operator: 'exists',
                                            answer: { boolean: false },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        const qr: QuestionnaireResponse = {
            resourceType: 'QuestionnaireResponse',
            status: 'completed',
            item: [
                {
                    linkId: 'root-group',
                    item: [
                        {
                            linkId: 'non-repeatable-group',
                            item: testConfig.qr,
                        },
                    ],
                },
            ],
        };
        const expectedQR: QuestionnaireResponse = {
            resourceType: 'QuestionnaireResponse',
            status: 'completed',
            item: [
                {
                    linkId: 'root-group',
                    item: [
                        {
                            linkId: 'non-repeatable-group',
                            item: testConfig.qr,
                        },
                    ],
                },
            ],
        };
        const formItems = mapResponseToForm(qr, questionnaire);
        const enabledFormItems = removeDisabledAnswers(questionnaire, formItems, {
            questionnaire,
            resource: qr,
            context: qr,
        });
        const actualQR = { ...qr, ...mapFormToResponse(enabledFormItems, questionnaire) };

        expect(actualQR).toEqual(expectedQR);
    });
});
