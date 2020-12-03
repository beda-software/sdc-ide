import { Questionnaire } from 'shared/lib/contrib/aidbox';

export const questionnaireFHIR: Questionnaire = {
    id: 'demo-1',
    resourceType: 'Questionnaire',
    status: 'active',
    extension: [
        {
            url: 'http://beda.software/fhir-extensions/questionnaire-mapper',
            valueReference: {
                reference: 'Mapping/demo-1',
            },
        },
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
            extension: [
                {
                    url: 'name',
                    valueId: 'LaunchPatient',
                },
                {
                    url: 'type',
                    valueCode: 'Patient',
                },
                {
                    url: 'description',
                    valueString: 'The patient that is to be used to pre-populate the form',
                },
            ],
        },
    ],
    item: [
        {
            text: 'First Name',
            type: 'string',
            linkId: 'first-name',
            extension: [
                {
                    url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                    valueExpression: {
                        language: 'text/fhirpath',
                        expression: '%LaunchPatient.name.given.first()',
                    },
                },
            ],
        },
        {
            text: 'Middle Name',
            type: 'string',
            linkId: 'middle-name',
            extension: [
                {
                    url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                    valueExpression: {
                        language: 'text/fhirpath',
                        expression: '%LaunchPatient.name.given[1]',
                    },
                },
            ],
        },
        {
            text: 'Last Name',
            type: 'string',
            linkId: 'last-name',
            extension: [
                {
                    url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                    valueExpression: {
                        language: 'text/fhirpath',
                        expression: '%LaunchPatient.name.family.first()',
                    },
                },
            ],
        },
        {
            text: 'Date of Birth',
            type: 'date',
            linkId: 'date-of-birth',
            extension: [
                {
                    url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                    valueExpression: {
                        language: 'text/fhirpath',
                        expression: '%LaunchPatient.birthDate',
                    },
                },
            ],
        },
        {
            text: 'ID',
            type: 'string',
            linkId: 'patientId',
            extension: [
                {
                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                    valueBoolean: true,
                },
                {
                    url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                    valueExpression: {
                        language: 'text/fhirpath',
                        expression: '%LaunchPatient.id',
                    },
                },
            ],
        },
    ],
};



export const newQuestionnaireFHIRItem = {
    text: 'Updated',
    type: 'string',
    linkId: 'updated',
    extension: [
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
            valueExpression: {
                language: 'text/fhirpath',
                expression: '%LaunchPatient.name.given.first()',
            },
        },
    ],
};

export const newQuestionnaireFHIR: Questionnaire = {
    ...questionnaireFHIR,
    item: [newQuestionnaireFHIRItem],
};
