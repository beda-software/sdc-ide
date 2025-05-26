import { Questionnaire } from 'fhir/r4b';
import {
    LaunchContext,
    launchContextExtensionUrl,
} from 'web/src/components/LaunchContextEditor/types';

import { legacyMappingExtensionUrl, mappingExtensionUrl } from 'shared/src/constants';

export function getMappings(questionnaire: Questionnaire) {
    return questionnaire.extension?.filter(
        (ext) => ext.url === mappingExtensionUrl || ext.url === legacyMappingExtensionUrl,
    );
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
