import { OperationOutcome, Patient, Questionnaire } from 'shared/src/contrib/aidbox';
import { MapperInfo } from 'src/components/ModalCreateMapper/types';
import {
    newQuestionnaireFHIR,
    newQuestionnaireFHIRItem,
    questionnaireFHIR,
} from 'src/containers/Main/__test__/resources/questionnaireFHIRExpected';

const patient: Patient = {
    name: [
        {
            given: ['Jane', 'Jr.'],
            family: 'Smith',
        },
    ],
    gender: 'female',
    telecom: [
        {
            use: 'Mobile',
            value: '+123456789d',
            system: 'phone',
        },
        {
            use: 'Mobile',
            value: '+198765432',
            system: 'phone',
        },
    ],
    birthDate: '1980-01-01',
    id: 'patient-1',
    resourceType: 'Patient',
};

const questionnaire = {
    id: 'demo-1',
    resourceType: 'Questionnaire',
    status: 'active',
    mapping: [
        {
            id: 'demo-1',
            resourceType: 'Mapping',
        },
    ],
    launchContext: [
        {
            name: 'LaunchPatient',
            type: 'Patient',
            description: 'The patient that is to be used to pre-populate the form',
        },
    ],
    item: [
        {
            text: 'First Name',
            type: 'string',
            linkId: 'first-name',
            initialExpression: {
                language: 'text/fhirpath',
                expression: '%LaunchPatient.name.given.first()',
            },
        },
        {
            text: 'Middle Name',
            type: 'string',
            linkId: 'middle-name',
            initialExpression: {
                language: 'text/fhirpath',
                expression: '%LaunchPatient.name.given[1]',
            },
        },
        {
            text: 'Last Name',
            type: 'string',
            linkId: 'last-name',
            initialExpression: {
                language: 'text/fhirpath',
                expression: '%LaunchPatient.name.family.first()',
            },
        },
        {
            text: 'Date of Birth',
            type: 'date',
            linkId: 'date-of-birth',
            initialExpression: {
                language: 'text/fhirpath',
                expression: '%LaunchPatient.birthDate',
            },
        },
        {
            text: 'ID',
            type: 'string',
            hidden: true,
            linkId: 'patientId',
            initialExpression: {
                language: 'text/fhirpath',
                expression: '%LaunchPatient.id',
            },
        },
    ],
};

const questRespPopulated = {
    resourceType: 'QuestionnaireResponse',
    questionnaire: null,
    item: [
        {
            linkId: 'Demographics',
            text: 'Demographics',
            item: [
                {
                    linkId: 'first-name',
                    text: 'First Name',
                    answer: [{ value: { string: 'Jane' } }],
                },
                {
                    linkId: 'middle-name',
                    text: 'Middle Name',
                    answer: [{ value: { string: 'Jr.' } }],
                },
                {
                    linkId: 'last-name',
                    text: 'Last Name',
                    answer: [{ value: { string: 'Smith' } }],
                },
                {
                    linkId: 'date-of-birth',
                    text: 'Date of Birth',
                    answer: [{ value: { date: '1980-01-01' } }],
                },
                {
                    linkId: 'gender',
                    text: 'Gender',
                    answer: [{ value: { string: 'Female' } }],
                },

                { linkId: 'patientId', text: 'ID', answer: [{ value: { string: 'patient-1' } }] },
            ],
        },
    ],
};

const mappingListDemo1 = [{ resourceType: 'Mapping', id: 'demo-1' }];

const mappingListDemo3 = [
    { resourceType: 'Mapping', id: 'demo-1' },
    { resourceType: 'Mapping', id: 'demo-2' },
];

const mappingDemo1 = {
    body: {
        type: 'transaction',
        entry: [
            {
                request: {
                    url:
                        '$ "/Patient/" + fhirpath("QuestionnaireResponse.repeat(item).where(linkId=\'patientId\').answer.children().string").0',
                    method: 'PATCH',
                },
                resource: {
                    name: [
                        {
                            given: [
                                '$ fhirpath("QuestionnaireResponse.repeat(item).where(linkId=\'first-name\').answer.value.string").0',
                                '$ fhirpath("QuestionnaireResponse.repeat(item).where(linkId=\'middle-name\').answer.value.string").0',
                            ],
                            family:
                                '$ fhirpath("QuestionnaireResponse.repeat(item).where(linkId=\'last-name\').answer.value.string").0',
                        },
                    ],
                    birthDate:
                        '$ fhirpath("QuestionnaireResponse.repeat(item).where(linkId=\'date-of-birth\').answer.value.date").0',
                    gender:
                        '$ fhirpath("QuestionnaireResponse.repeat(item).where(linkId=\'gender\').answer.value.string").0',
                    resourceType: 'Patient',
                },
            },
        ],
        resourceType: 'Bundle',
    },
    id: 'demo-1',
    resourceType: 'Mapping',
};

const mappingDemo1New = {
    body: {
        type: 'transaction',
        entry: [
            {
                request: {
                    url:
                        '$ "/Patient/" + fhirpath("QuestionnaireResponse.repeat(item).where(linkId=\'patientId\').answer.children().string").0',
                    method: 'PATCH',
                },
                resource: {
                    birthDate: '2000-01-01',
                },
            },
        ],
        resourceType: 'Bundle',
    },
    id: 'demo-1',
    resourceType: 'Mapping',
};

const batchRequestDemo1 = {
    type: 'transaction',
    entry: [
        {
            request: { url: '/Patient/patient', method: 'PATCH' },
            resource: {
                name: [{ given: ['Jane', 'Jr.'], family: 'Smith' }],
                birthDate: '1980-01-01',
                resourceType: 'Patient',
            },
        },
    ],
    resourceType: 'Bundle',
};

const idExtractionIssue = { expression: ['Questionnaire.mapping.2'], code: 'invalid', severity: 'fatal' };
const idExtractionResource: Questionnaire = {
    mapping: [
        { id: 'demo-1', resourceType: 'Mapping' },
        { id: 'demo-2', resourceType: 'Mapping' },
        { id: 'foobar', resourceType: 'Mapping' },
    ],
    resourceType: 'Questionnaire',
    status: 'active',
};
const idExtractionResourceUndefined: Questionnaire = {
    mapping: [],
    resourceType: 'Questionnaire',
    status: 'active',
};
const idExtractionError: OperationOutcome = {
    resourceType: 'OperationOutcome',
    issue: [],
};
const idExtractionErrorUndefined: OperationOutcome = {
    //@ts-ignore
    resourceType: '',
    issue: [],
};

const mappingIdList = ['foobar-101'];

const mappingIdListEmpty: [] = [];

const mappingInfoList: MapperInfo[] = [
    {
        mappingId: 'foobar-101',
        resource: {
            item: [
                {
                    item: [
                        {
                            text: 'First Name',
                            type: 'string',
                            linkId: 'first-name',
                            initialExpression: {
                                language: 'text/fhirpath',
                                expression: '%LaunchPatient.name.given.first()',
                            },
                        },
                        {
                            text: 'Middle Name',
                            type: 'string',
                            linkId: 'middle-name',
                            initialExpression: {
                                language: 'text/fhirpath',
                                expression: '%LaunchPatient.name.given[1]',
                            },
                        },
                        {
                            text: 'Last Name',
                            type: 'string',
                            linkId: 'last-name',
                            initialExpression: {
                                language: 'text/fhirpath',
                                expression: '%LaunchPatient.name.family.first()',
                            },
                        },
                        {
                            text: 'Date of Birth',
                            type: 'date',
                            linkId: 'date-of-birth',
                            initialExpression: {
                                language: 'text/fhirpath',
                                expression: '%LaunchPatient.birthDate',
                            },
                        },
                        {
                            text: 'Gender',
                            type: 'string',
                            linkId: 'gender',
                            initialExpression: {
                                language: 'text/fhirpath',
                                expression: '%LaunchPatient.gender',
                            },
                        },
                        {
                            text: 'ID',
                            type: 'string',
                            hidden: true,
                            linkId: 'patientId',
                            initialExpression: {
                                language: 'text/fhirpath',
                                expression: '%LaunchPatient.id',
                            },
                        },
                    ],
                    text: 'Demographics',
                    type: 'group',
                    linkId: 'Demographics',
                },
            ],
            status: 'active',
            mapping: [
                {
                    id: 'demo-1',
                    resourceType: 'Mapping',
                },
                {
                    id: 'foobar-101',
                    resourceType: 'Mapping',
                },
            ],
            launchContext: [
                {
                    name: 'LaunchPatient',
                    type: 'Patient',
                    description: 'The patient that is to be used to pre-populate the form',
                },
            ],
            id: 'demo-1',
            resourceType: 'Questionnaire',
        },
        index: 0,
        indexOfMapper: 1,
    },
];

const showToastType = 'error';

const showToastError: OperationOutcome = {
    resourceType: 'OperationOutcome',
    text: {
        status: 'generated',
        div: 'Invalid resource',
    },
    issue: [
        {
            severity: 'fatal',
            code: 'invalid',
            expression: ['Questionnaire.mapping.1.resourceType'],
            diagnostics: 'expected one of Mapping',
        },
        {
            severity: 'fatal',
            code: 'invalid',
            expression: ['Questionnaire.mapping.1'],
            diagnostics: "Resource Type 'Mappin' does not exist",
        },
    ],
};

const showToastIndex = 1;

export const EXPECTED_RESOURCES = {
    patient,
    questionnaire,
    questionnaireFHIR,
    newQuestionnaireFHIRItem,
    newQuestionnaireFHIR,
    questRespPopulated,
    mappingListDemo1,
    mappingListDemo3,
    mappingDemo1,
    mappingDemo1New,
    batchRequestDemo1,
    idExtractionIssue,
    idExtractionResource,
    idExtractionResourceUndefined,
    idExtractionError,
    idExtractionErrorUndefined,
    mappingIdList,
    mappingInfoList,
    mappingIdListEmpty,
    showToastType,
    showToastError,
    showToastIndex,
};
