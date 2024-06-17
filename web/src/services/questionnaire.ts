import {
    extractBundleResources,
    getReference,
    ResourcesMap,
} from '@beda.software/fhir-react';
import { getFHIRResources } from './fhir';
import { SearchParams } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { Resource } from 'shared/src/contrib/aidbox';

export async function loadResourceOptions<R extends Resource, IR extends Resource = any>(
    resourceType: R['resourceType'],
    searchParams: SearchParams,
    getDisplayFn: (resource: R, includedResources: ResourcesMap<R | IR>) => string,
) {
    return mapSuccess(await getFHIRResources<R | IR>(resourceType, searchParams), (bundle) => {
        const resourcesMap = extractBundleResources(bundle);
        return resourcesMap[resourceType].map((resource) => ({
            value: {
                Reference: {
                    ...getReference(resource, getDisplayFn(resource as R, resourcesMap)),
                    resource,
                },
            },
        }));
    });
}
