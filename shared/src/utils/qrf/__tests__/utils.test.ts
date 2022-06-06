import { Questionnaire, QuestionnaireResponse } from '../../../contrib/aidbox';
import { mapFormToResponse, mapResponseToForm } from '../';

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
                item: [{ linkId: 'answer-with-initial', answer: [{ value: { string: 'initial' } }] }],
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
    const actualQR = { ...qr, ...mapFormToResponse(formItems, questionnaire) };

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
    const actualQR = { ...qr, ...mapFormToResponse(formItems, questionnaire) };

    expect(actualQR).toEqual(expectedQR);
});
