import { Questionnaire } from 'fhir/r4b';
import {
    LaunchContext,
    launchContextExtensionUrl,
} from 'web/src/components/LaunchContextEditor/types';

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

export function makeLaunchContextExtension(launchContext: LaunchContext) {
    return {
        url: launchContextExtensionUrl,
        extension: [
            { url: 'name', valueCoding: { code: launchContext.name } },
            ...launchContext.types.map((type) => ({ url: 'type', valueCode: type })),
        ],
    };
}
