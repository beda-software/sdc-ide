import { initServicesFromService } from '@beda.software/fhir-react';
import { RemoteDataResult } from '@beda.software/remote-data';
import {
    service as aidboxService,
    resetInstanceToken as resetAidboxInstanceToken,
    setInstanceToken as setAidboxInstanceToken,
} from 'aidbox-react';
import type { AxiosRequestConfig } from 'axios';

import { baseURL, juteURL, fhirpathMappingUrl } from 'shared/src/constants';

export const fhirService = async <S = any, F = any>(
    config: AxiosRequestConfig,
): Promise<RemoteDataResult<S, F>> => {
    return aidboxService({ baseURL: `${baseURL}/fhir`, ...config });
};

export const {
    createFHIRResource,
    updateFHIRResource,
    getFHIRResource,
    getFHIRResources,
    getAllFHIRResources,
    findFHIRResource,
    saveFHIRResource,
    saveFHIRResources,
    patchFHIRResource,
    deleteFHIRResource,
    forceDeleteFHIRResource,
    getConcepts,
    applyFHIRService,
    applyFHIRServices,
    service,
} = initServicesFromService(fhirService);

export { baseURL, juteURL, fhirpathMappingUrl };
export { resetAidboxInstanceToken, setAidboxInstanceToken, aidboxService };
