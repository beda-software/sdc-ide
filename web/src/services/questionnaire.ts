import { Resource } from 'fhir/r4b';

import {
    extractBundleResources,
    getFHIRResources,
    ResourcesMap,
} from 'fhir-react/lib/services/fhir';
import { SearchParams } from 'fhir-react/lib/services/search';
import { mapSuccess } from 'fhir-react/lib/services/service';

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
                    reference: `${resource.resourceType}/${resource.id}`,
                    display: getDisplayFn(resource as R, resourcesMap),
                },
            },
        }));
    });
}
