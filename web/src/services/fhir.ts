import { initServices } from '@beda.software/fhir-react';

import { configuration } from 'shared/src/constants';

export const {
    axiosInstance,
    service,
    setInstanceToken,
    resetInstanceToken,
    getFHIRResource,
    getFHIRResources,
    getAllFHIRResources,
    saveFHIRResource,
    updateFHIRResource,
    createFHIRResource,
    forceDeleteFHIRResource,
    patchFHIRResource,
    setInstanceBaseURL,
} = initServices(configuration.baseURL + '/fhir');
