export interface CursorPosition {
    left: number;
    top: number;
}

export type ExpressionType = 'LaunchContext' | 'QuestionnaireResponse' | 'SourceQueries';

export interface DebuggerState {
    expression: string;
    type: ExpressionType;
}
