import { extractBundleResources, ResourcesMap, SearchParams } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';
import { Resource } from 'fhir/r4b';
import { getFHIRResources } from 'web/src/services/initialize';

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
