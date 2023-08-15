import {
    extractBundleResources,
    getFHIRResources,
    getReference,
    ResourcesMap,
} from 'fhir-react/lib/services/fhir';
import { SearchParams } from 'fhir-react/lib/services/search';
import { mapSuccess } from 'fhir-react/lib/services/service';

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
