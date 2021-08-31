import { Questionnaire } from 'shared/src/contrib/aidbox';

export interface MapperInfo {
    mappingId: string;
    resource: Questionnaire;
    index: number;
    indexOfMapper: number;
}
