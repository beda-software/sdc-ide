import { Questionnaire } from 'fhir/r4b';

export const mappingExtensionUrl = 'http://beda.software/fhir-extensions/questionnaire-mapper';

export function getMappings(questionnaire: Questionnaire) {
    return questionnaire.extension?.filter((ext) => ext.url === mappingExtensionUrl);
}

export function makeMappingExtension(name: string) {
    return {
        url: mappingExtensionUrl,
        valueReference: {
            reference: `Mapping/${name}`,
        },
    };
}
