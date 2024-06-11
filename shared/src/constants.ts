export const baseURL =
    (window as any).BASE_URL === '{{BASE_URL}}'
        ? 'http://localhost:8080/'
        : (window as any).BASE_URL;
export const juteURL =
    (window as any).JUTE_URL === '{{JUTE_URL}}'
        ? 'http://localhost:8099/'
        : (window as any).JUTE_URL;

export const aiQuestionnaireBuilderUrl = 'https://builder.emr.beda.software';
// export const aiQuestionnaireBuilderUrl = 'http://localhost:3002';
export const fhirpathMappingUrl = 'https://fhirpathmapper.emr.beda.software';
// export const fhirpathMappingUrl = 'http://localhost:8091';
