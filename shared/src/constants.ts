function getConfig(key: string, defaultValue: string) {
    const value = (window as any)[key];
    if (value === '{{' + key + '}}' || value === null || value === undefined) {
        return defaultValue;
    }
    return value;
}

export const baseURL = getConfig('BASE_URL', 'http://localhost:8080');
export const juteURL = getConfig('JUTE_URL', 'http://localhost:8099');
export const aiQuestionnaireBuilderUrl = getConfig('AI_BUILDER_URL', 'http://localhost:3002');
export const fhirMappingLanguageUrl = getConfig(
    'FHIR_MAPPING_LANGUAGE_URL',
    'http://localhost:8084/matchboxv3/fhir',
);
export const fhirpathMappingUrl = getConfig('FHIRPATH_MAPPING_URL', 'http://localhost:8091');
