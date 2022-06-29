import { useReducer } from 'react';

import { OperationOutcome } from 'shared/src/contrib/aidbox';

export interface ErrorDebugState {
    showQuestionnaireErrors: boolean;
    questionnaireErrors: OperationOutcome[];
    showMappingErrors: boolean;
    mappingErrors: OperationOutcome[];
}

enum ActionType {
    AddQuestionnaireError = 'add questionnaire error',
    ResetQuestionnaireError = 'reset questionnaire error',
    AddMappingError = 'add mapping error',
    ResetMappingError = 'reset mapping error',
}

interface AddQuestionnaireErrorAction {
    type: ActionType.AddQuestionnaireError;
    error: OperationOutcome;
}

interface ResetQuestionnaireErrorAction {
    type: ActionType.ResetQuestionnaireError;
}

interface AddMappingErrorAction {
    type: ActionType.AddMappingError;
    error: OperationOutcome;
}

interface ResetMappingErrorAction {
    type: ActionType.ResetMappingError;
}

export function addQuestionnaireErrorAction(error: OperationOutcome): AddQuestionnaireErrorAction {
    return { type: ActionType.AddQuestionnaireError, error };
}

export function resetQuestionnaireErrorAction(): ResetQuestionnaireErrorAction {
    return { type: ActionType.ResetQuestionnaireError };
}

export function addMappingErrorAction(error: OperationOutcome): AddMappingErrorAction {
    return { type: ActionType.AddMappingError, error };
}

export function resetMappingErrorAction(): ResetMappingErrorAction {
    return { type: ActionType.ResetMappingError };
}

type Action =
    | AddQuestionnaireErrorAction
    | ResetQuestionnaireErrorAction
    | AddMappingErrorAction
    | ResetMappingErrorAction;

const initialState: ErrorDebugState = {
    showQuestionnaireErrors: false,
    questionnaireErrors: [],
    showMappingErrors: false,
    mappingErrors: [],
};

function reducer(state: ErrorDebugState, action: Action) {
    switch (action.type) {
        case ActionType.AddQuestionnaireError:
            return {
                ...state,
                showQuestionnaireErrors: true,
                questionnaireErrors: [...state.questionnaireErrors, action.error],
            };
        case ActionType.AddMappingError:
            return {
                ...state,
                showMappingErrors: true,
                mappingErrors: [...state.mappingErrors, action.error],
            };
        case ActionType.ResetQuestionnaireError:
            return { ...state, showQuestionnaireErrors: false, questionnaireErrors: [] };
        case ActionType.ResetMappingError:
            return { ...state, showMappingErrors: false, mappingErrors: [] };
        default:
            const _exhaustiveCheck: never = action;
            return _exhaustiveCheck;
    }
}

export function useErrorDebug() {
    return useReducer(reducer, initialState);
}
