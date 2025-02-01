export const launchContextExtensionUrl =
    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext';

export interface LaunchContext {
    // TODO: use proper type, e.g. name is Coding
    name: string;
    types: string[];
}
