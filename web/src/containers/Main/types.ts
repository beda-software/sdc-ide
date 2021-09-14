import CodeMirror, { Position } from 'codemirror';
import { ParametersParameterValue, Resource } from 'shared/src/contrib/aidbox';

export type ValueObject = Resource | ParametersParameterValue;

export type ModalType = 'LaunchContext' | 'QuestionnaireResponse';

export type ExpressionResultOutput = {
    type: 'success' | 'error';
    result: string;
};

export interface ModalInfo {
    type: ModalType;
    expression: string;
    doc: CodeMirror.Doc;
    cursorPosition: Position;
}
