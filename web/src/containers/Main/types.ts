import { Parameters, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { RemoteData } from 'fhir-react';

export interface MappingErrorManager {
    errorCount: number;
    showError: () => void;
    isError: (id?: string) => boolean;
    selectMapping: (id?: string) => void;
}

export interface TitleWithErrorManager {
    showError: (title: Title) => void;
    errorCount: (title: Title) => number | undefined;
}

export type ExpressionResultOutput = {
    type: 'success' | 'error';
    result: string;
};

export type Title =
    | 'Launch Context'
    | 'Questionnaire FHIR Resource'
    | 'Patient Form'
    | 'QuestionnaireResponse FHIR resource'
    | 'Patient JUTE Mapping'
    | 'Patient batch request';

export interface QRFormWrapperProps {
    questionnaireRD: RemoteData<Questionnaire>;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    saveQuestionnaireResponse: (resource: QuestionnaireResponse) => void;
    launchContextParameters: Parameters['parameter'];
}

export type QRFWrapper = (props: QRFormWrapperProps) => React.JSX.Element;
