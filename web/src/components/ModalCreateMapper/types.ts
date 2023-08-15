import { Questionnaire } from 'fhir/r4b';

export interface MapperInfo {
    mappingId: string;
    resource: Questionnaire;
    index: number;
    indexOfMapper: number;
}
