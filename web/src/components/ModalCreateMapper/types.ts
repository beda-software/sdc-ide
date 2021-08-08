import { OperationOutcomeIssue, Questionnaire } from 'shared/src/contrib/aidbox';

export interface MapperInfo {
    mappingId: string;
    resource: Questionnaire;
    index: number;
    indexOfMapper: number;
}

export interface Response {
    error: {
        issue: OperationOutcomeIssue[];
        resourceType: string;
        text?: {
            status: string;
            div: string;
        };
    };
    status?: string;
}
