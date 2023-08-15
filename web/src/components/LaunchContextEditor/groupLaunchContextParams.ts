import { Extension, Questionnaire } from 'fhir/r4b';
import _ from 'lodash';

/*
    Group launchContext params by name.
    Should be deleted when $assemble for extensions is fixed.

    Now it looks like:
    extension: [
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
            extension: [
                {
                    url: 'name',
                    valueCoding: {
                        code: 'Patient',
                    },
                },
                {
                    url: 'type',
                    valueCode: 'Patient',
                },
            ],
        },
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
            extension: [
                {
                    url: 'name',
                    valueCoding: {
                        code: 'Author',
                    },
                },
                {
                    url: 'type',
                    valueCode: 'PractitionerRole',
                },
            ],
        },
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
            extension: [
                {
                    url: 'name',
                    valueCoding: {
                        code: 'Author',
                    },
                },
                {
                    url: 'type',
                    valueCode: 'Practitioner',
                },
            ],
        },
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
            extension: [
                {
                    url: 'name',
                    valueCoding: {
                        code: 'Author',
                    },
                },
                {
                    url: 'type',
                    valueCode: 'Patient',
                },
            ],
        },
    ]

    But has to look like:
    extension: [
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
            extension: [
                {
                    url: 'name',
                    valueCoding: {
                        code: 'Patient',
                    },
                },
                {
                    url: 'type',
                    valueCode: 'Patient',
                },
            ],
        },
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
            extension: [
                {
                    url: 'name',
                    valueCoding: {
                        code: 'Author',
                    },
                },
                {
                    url: 'type',
                    valueCode: 'PractitionerRole',
                },
                {
                    url: 'type',
                    valueCode: 'Practitioner',
                },
                {
                    url: 'type',
                    valueCode: 'Patient',
                },
            ],
        },
    ],
*/

export function groupLaunchContextParams(questionnaire: Questionnaire): Extension[] {
    const params = questionnaire.extension
        ? _.chain(questionnaire.extension)
              .filter(
                  (ext) =>
                      ext.url ===
                      'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
              )
              .groupBy((ext) => ext.extension?.find(({ url }) => url === 'name')?.valueCoding?.code)
              .mapValues(
                  (extensions): Extension => ({
                      ...extensions[0]!,
                      extension: [
                          extensions
                              .map((ext) => ext.extension || [])
                              .flat()
                              .filter(({ url }) => url === 'name')![0]!,
                          ...extensions
                              .map((ext) => ext.extension || [])
                              .flat()
                              .filter(({ url }) => url !== 'name'),
                      ],
                  }),
              )
              .toPairs()
              .map(([, extensions]) => extensions)
              .value()
        : [];

    return params;
}
