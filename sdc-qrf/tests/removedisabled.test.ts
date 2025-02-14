import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { removeDisabledAnswers } from '../src';

test('removeDisabledAnswers', () => {
    const result = removeDisabledAnswers(questionnaire, formValues, itemContext);
    expect(result['addressedTo']).toEqual(addressedTo);
});

const questionnaire: Questionnaire = {
    meta: {
        profile: ['https://beda.software/beda-emr-questionnaire'],
    },
    name: 'new',
    item: [
        {
            text: 'Addressed to',
            type: 'choice',
            linkId: 'addressedTo',
            required: true,
            enableWhen: [
                {
                    question: 'authorResourceType',
                    operator: '=',
                    answer: {
                        string: 'Practitioner',
                    },
                },
            ],
            answerOption: [
                {
                    value: {
                        Coding: {
                            code: 'Patient',
                            display: 'Patient',
                        },
                    },
                },
                {
                    value: {
                        Coding: {
                            code: 'Practitioner',
                            display: 'Practitioner',
                        },
                    },
                },
            ],
            itemControl: {
                coding: [
                    {
                        code: 'inline-choice',
                    },
                ],
            },
        },
        {
            text: 'AuthorResourceType',
            type: 'string',
            linkId: 'authorResourceType',
            hidden: true,
            initialExpression: {
                language: 'text/fhirpath',
                expression: '%Author.resourceType',
            },
        },
    ],
    resourceType: 'Questionnaire',
    title: 'New',
    status: 'active',
    launchContext: [
        {
            name: {
                code: 'Patient',
            },
            type: ['Patient'],
        },
        {
            name: {
                code: 'Author',
            },
            type: ['Practitioner', 'Person'],
        },
    ],
    mapping: [
        {
            id: 'new-communication-practitioner',
            resourceType: 'Mapping',
        },
    ],
};

const addressedTo = [
    {
        value: {
            Coding: {
                code: 'Patient',
                display: 'Patient',
            },
        },
    },
];
const formValues = {
    authorResourceType: [
        {
            question: 'AuthorResourceType',
            value: {
                string: 'Practitioner',
            },
            items: {},
        },
    ],
    addressedTo: addressedTo,
};

const questionanireResponse: QuestionnaireResponse = {
    resourceType: 'QuestionnaireResponse',
    questionnaire: undefined,
    status: 'completed',
    item: [
        {
            linkId: 'authorResourceType',
            answer: [
                {
                    value: {
                        string: 'Practitioner',
                    },
                },
            ],
        },
        {
            linkId: 'addressedTo',
            answer: [
                {
                    value: {
                        Coding: {
                            code: 'Patient',
                            display: 'Patient',
                        },
                    },
                },
            ],
        },
    ],
};

const itemContext = {
    Patient: {
        resourceType: 'Patient',
    },
    Author: {
        name: [
            {
                given: ['Basic-1'],
                family: 'Practitioner',
            },
        ],
        id: 'practitioner1',
        resourceType: 'Practitioner',
        meta: {
            lastUpdated: '2025-02-13T23:29:35.632721Z',
            versionId: '1339',
            extension: [
                {
                    url: 'ex:createdAt',
                    valueInstant: '2025-02-11T01:24:26.958252Z',
                },
            ],
        },
    },
    questionnaire: questionnaire,
    resource: questionanireResponse,
    context: questionanireResponse,
    Questionnaire: questionnaire,
    QuestionnaireResponse: questionanireResponse,
};
