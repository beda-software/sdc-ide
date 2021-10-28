import { useReducer } from 'react';
import { OperationOutcome } from 'shared/src/contrib/aidbox';

export interface ErrorDebugState {
    showQuestionnaireErrors: boolean;
    questionnaireErrorCount: number;
    questionnaireErrors: OperationOutcome[];
    showMappingErrors: boolean;
    mappingErrorCount: number;
    mappingErrors: OperationOutcome[];
}

export interface Action {
    type: 'add questionnaire error' | 'reset questionnaire errors' | 'add mapping error' | 'reset mapping errors';
    payload?: number;
    error?: OperationOutcome;
}

const initialState: ErrorDebugState = {
    showQuestionnaireErrors: false,
    questionnaireErrorCount: 0,
    questionnaireErrors: [],
    showMappingErrors: false,
    mappingErrorCount: 0,
    mappingErrors: [],
};

function reducer(state: ErrorDebugState, action: Action) {
    switch (action.type) {
        case 'add questionnaire error':
            return {
                ...state,
                showQuestionnaireErrors: true,
                questionnaireErrorCount: action.payload!,
                questionnaireErrors: [...state.questionnaireErrors, action.error!],
            };
        case 'add mapping error':
            return {
                ...state,
                showMappingErrors: true,
                mappingErrorCount: action.payload!,
                mappingErrors: [...state.mappingErrors, action.error!],
            };
        case 'reset questionnaire errors':
            return { ...state, showQuestionnaireErrors: false, questionnaireErrorCount: 0, questionnaireErrors: [] };
        case 'reset mapping errors':
            return { ...state, showMappingErrors: false, mappingErrorCount: 0, mappingErrors: [] };
        default:
            throw new Error();
    }
}

export function useErrorDebug() {
    return useReducer(reducer, initialState);
}
