import { Position, Editor, Doc } from 'codemirror';
import { ParametersParameterValue, Resource } from 'shared/src/contrib/aidbox';

export interface ExpressionModalInfo {
    type: ModalType;
    expression: string;
    doc: Doc;
    cursorPosition: Position;
}

export interface ContextMenuPosition {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface ContextMenu {
    close: () => void;
    debugger: () => void;
    undo: () => void;
    redo: () => void;
    cut: () => void;
    copy: () => void;
    paste: () => void;
    selectAll: () => void;
}

// interface ExpressionStringInfo {
//     _editor: Editor;
//     cursorPosition: Position;
//     choosenExpression: string;
//     modalType: ModalType;
// }

export interface ContextMenuInfo {
    cursorPosition: Position;
    menuPosition: ContextMenuPosition;
    editor: Editor;
    showContextMenu: boolean;
    event: any;
    valueObject: ValueObject;
}

export type ValueObject = Resource | ParametersParameterValue;

export type ModalType = 'LaunchContext' | 'QuestionnaireResponse';

export type ExpressionResultOutput = {
    type: 'success' | 'error';
    result: string;
};

export type OpenContextMenu = (_editor: Editor, event: any, valueObject: ValueObject) => void;
