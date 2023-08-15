import { Position, Editor, Doc } from 'codemirror';
import { Resource, ParametersParameter } from 'fhir/r4b';

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
    debugger?: () => void;
    reload?: () => void;
    undo: () => void;
    redo: () => void;
    cut: () => void;
    copy: () => void;
    paste: () => void;
    selectAll: () => void;
}

export interface ContextMenuInfo {
    cursorPosition: Position;
    menuPosition: ContextMenuPosition;
    editor: Editor;
    showContextMenu: boolean;
    event: any;
    valueObject: ValueObject;
}

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

export type ValueObject = Resource | ParametersParameter;

export type ModalType = 'LaunchContext' | 'QuestionnaireResponse' | 'SourceQueries';

export type ExpressionResultOutput = {
    type: 'success' | 'error';
    result: string;
};

export type OpenContextMenu = (_editor: Editor, event: any, valueObject: ValueObject) => void;

export type Title =
    | 'Launch Context'
    | 'Questionnaire FHIR Resource'
    | 'Patient Form'
    | 'QuestionnaireResponse FHIR resource'
    | 'Patient JUTE Mapping'
    | 'Patient batch request';

export type ReloadType = 'Questionnaire' | 'Mapping';
