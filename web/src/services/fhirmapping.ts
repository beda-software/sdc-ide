import { Bundle, QuestionnaireResponse, StructureMap } from 'fhir/r4b';

import { service } from './fhir';

import { configuration } from 'shared/src/constants';

const CONTENT_TYPE_FHIR_MAPPING = 'text/fhir-mapping';
const CONTENT_TYPE_FHIR_JSON = 'application/fhir+json';
const ACCEPT_FHIR_JSON = 'application/fhir+json';

export async function convert({ mapString }: { mapString: string }) {
    return await service<StructureMap>({
        baseURL: configuration.fhirMappingLanguageUrl,
        url: `/StructureMap/$convert`,
        method: 'POST',
        data: mapString,
        headers: {
            'Content-Type': CONTENT_TYPE_FHIR_MAPPING,
        },
    });
}

export async function createStructureMap({ structureMap }: { structureMap: StructureMap }) {
    return await service<StructureMap>({
        baseURL: configuration.fhirMappingLanguageUrl,
        url: `/StructureMap`,
        method: 'POST',
        data: structureMap,
    });
}

export async function transform({
    structureMapUrl,
    questionnaireResponse,
}: {
    structureMapUrl: string;
    questionnaireResponse: QuestionnaireResponse;
}) {
    return await service<Bundle>({
        baseURL: configuration.fhirMappingLanguageUrl,
        url: `/StructureMap/$transform`,
        method: 'POST',
        data: questionnaireResponse,
        params: {
            source: structureMapUrl,
        },
        headers: {
            'Content-Type': CONTENT_TYPE_FHIR_JSON,
            Accept: ACCEPT_FHIR_JSON,
        },
    });
}
