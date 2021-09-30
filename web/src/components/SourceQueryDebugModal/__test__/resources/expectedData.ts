export const expectedPreparedSourceQueryData = {
    id: 'DietAndNutrition',
    type: 'batch',
    entry: [
        {
            request: {
                url: '/NutritionOrder?patient=patient-1&status=active',
                method: 'GET',
            },
        },
    ],
    resourceType: 'Bundle',
};

export const expectedNewQuestionnaireData = {
    launchContext: [
        {
            name: 'LaunchPatient',
            type: 'Patient',
            description: 'The patient that is to be used to pre-populate the form',
        },
    ],
    item: [
        {
            text: 'Gender',
            type: 'text',
            hidden: true,
            linkId: 'gender',
            initialExpression: {
                language: 'text/fhirpath',
                expression: '%LaunchPatient.gender',
            },
        },
        {
            text: 'PatientId',
            type: 'string',
            hidden: true,
            linkId: 'patientId',
            initialExpression: {
                language: 'text/fhirpath',
                expression: '%LaunchPatient.id',
            },
        },
        {
            item: [
                {
                    text: 'Diet and Nutrition',
                    type: 'choice',
                    linkId: 'diet',
                    repeats: true,
                    answerValueSet: 'diet',
                    initialExpression: {
                        language: 'text/fhirpath',
                        expression:
                            "%DietAndNutrition.entry[0].resource.entry.resource.oralDiet.type.coding.where(system = 'http://snomed.info/sct')",
                    },
                },
                {
                    text: 'Allergies and Adverse Reactions',
                    type: 'choice',
                    linkId: 'allergies',
                    repeats: true,
                    answerValueSet: 'allergies',
                    initialExpression: {
                        language: 'text/fhirpath',
                        expression:
                            "%AllergiesAndAdverseReactions.entry[0].resource.entry.resource.code.coding.where(system = 'http://snomed.info/sct')",
                    },
                },
                {
                    text: 'Immunizations',
                    type: 'choice',
                    linkId: 'immunization-history',
                    repeats: true,
                    answerValueSet: 'immunization',
                    initialExpression: {
                        language: 'text/fhirpath',
                        expression:
                            "%Immunizations.entry[0].resource.entry.resource.vaccineCode.coding.where(system = 'http://snomed.info/sct')",
                    },
                },
            ],
            text: 'Health and Lifestyle',
            type: 'group',
            linkId: 'health-and-lifestyle',
        },
        {
            item: [
                {
                    text: 'I am Pregnant',
                    type: 'boolean',
                    linkId: 'pregnant',
                    enableWhen: [
                        {
                            answer: {
                                string: 'Male',
                            },
                            operator: '!=',
                            question: 'gender',
                        },
                    ],
                    initialExpression: {
                        language: 'text/fhirpath',
                        expression: '%IAmPregnant.entry[0] .resource.total = 1',
                    },
                },
                {
                    text: 'I am Breastfeeding',
                    type: 'boolean',
                    linkId: 'breastfeeding',
                    enableWhen: [
                        {
                            answer: {
                                string: 'Male',
                            },
                            operator: '!=',
                            question: 'gender',
                        },
                    ],
                    initialExpression: {
                        language: 'text/fhirpath',
                        expression: '%IAmBreastfeeding.entry[0].resource.total = 1',
                    },
                },
            ],
            text: 'Additional information',
            type: 'group',
            linkId: 'additional-information',
        },
    ],
    mapping: [
        {
            id: 'diet-extract',
            resourceType: 'Mapping',
        },
        {
            id: 'allergy-extract',
            resourceType: 'Mapping',
        },
        {
            id: 'immunization-extract',
            resourceType: 'Mapping',
        },
        {
            id: 'additional-info-extract',
            resourceType: 'Mapping',
        },
    ],
    resourceType: 'Questionnaire',
    contained: [
        {
            id: 'DietAndNutrition',
            type: 'batch',
            entry: [
                {
                    request: {
                        url: '/NutritionOrder?patient={{%LaunchPatient.id}}&status=active',
                        method: 'GET',
                    },
                },
            ],
            resourceType: 'Bundle',
        },
        {
            id: 'AllergiesAndAdverseReactions',
            type: 'batch',
            entry: [
                {
                    request: {
                        url: '/AllergyIntolerance?patient={{%LaunchPatient.id}}&clinical-status=active',
                        method: 'GET',
                    },
                },
            ],
            resourceType: 'Bundle',
        },
        {
            id: 'Immunizations',
            type: 'batch',
            entry: [
                {
                    request: {
                        url: '/Immunization?patient={{%LaunchPatient.id}}&status=completed',
                        method: 'GET',
                    },
                },
            ],
            resourceType: 'Bundle',
        },
        {
            id: 'IAmPregnant',
            type: 'batch',
            entry: [
                {
                    request: {
                        url: '/Observation?patient={{%LaunchPatient.id}}&status=active&code=289908002',
                        method: 'GET',
                    },
                },
            ],
            resourceType: 'Bundle',
        },
        {
            id: 'IAmBreastfeeding',
            type: 'batch',
            entry: [
                {
                    request: {
                        url: '/Observation?patient={{%LaunchPatient.id}}&status=active&code=169741004',
                        method: 'GET',
                    },
                },
            ],
            resourceType: 'Bundle',
        },
    ],
    sourceQueries: [
        {
            localRef: 'Bundle#DietAndNutrition',
        },
        {
            localRef: 'Bundle#AllergiesAndAdverseReactions',
        },
        {
            localRef: 'Bundle#Immunizations',
        },
        {
            localRef: 'Bundle#IAmPregnant',
        },
        {
            localRef: 'Bundle#IAmBreastfeeding',
        },
    ],
    status: 'active',
    id: 'health-and-lifestyle',
};
