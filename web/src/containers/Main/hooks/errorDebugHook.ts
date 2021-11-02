import { useReducer } from 'react';
import { OperationOutcome } from 'shared/src/contrib/aidbox';

export interface ErrorDebugState {
    showQuestionnaireErrors: boolean;
    questionnaireErrors: OperationOutcome[];
    showMappingErrors: boolean;
    mappingErrors: OperationOutcome[];
}

export type Action =
    | { type: 'add questionnaire error'; error: OperationOutcome }
    | { type: 'reset questionnaire errors' }
    | { type: 'add mapping error'; error: OperationOutcome }
    | { type: 'reset mapping errors' };

const initialState: ErrorDebugState = {
    showQuestionnaireErrors: false,
    questionnaireErrors: [],
    showMappingErrors: false,
    mappingErrors: [],
};

function reducer(state: ErrorDebugState, action: Action) {
    switch (action.type) {
        case 'add questionnaire error':
            return {
                ...state,
                showQuestionnaireErrors: true,
                questionnaireErrors: [...state.questionnaireErrors, action.error],
            };
        case 'add mapping error':
            return {
                ...state,
                showMappingErrors: true,
                mappingErrors: [...state.mappingErrors, action.error],
            };
        case 'reset questionnaire errors':
            return { ...state, showQuestionnaireErrors: false, questionnaireErrors: [] };
        case 'reset mapping errors':
            return { ...state, showMappingErrors: false, mappingErrors: [] };
        default:
            throw new Error();
    }
}

export function useErrorDebug() {
    return useReducer(reducer, initialState);
}
