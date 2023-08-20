import { Questionnaire, Parameters } from 'fhir/r4b';

export interface Props {
    sourceQueryId: string;
    closeExpressionModal: () => void;
    launchContext: Parameters;
    resource: Questionnaire;
}
