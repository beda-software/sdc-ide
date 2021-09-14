import CodeMirror, { Position } from 'codemirror';

export const replaceLine = (
    doc: CodeMirror.Doc | undefined,
    cursorPosition: Position | undefined,
    modalType: string,
    expression: string,
) => {
    if (doc && cursorPosition) {
        const lineLength = doc.getLine(cursorPosition.line).length;
        const replacingFromPosition = { line: cursorPosition.line, ch: cursorPosition.ch };
        const replacingToPosition = { line: cursorPosition.line, ch: lineLength };
        let newLine = '';
        if (modalType === 'LaunchContext') {
            newLine = `expression: '${expression}'`;
        }
        if (modalType === 'QuestionnaireResponse') {
            newLine = `fhirpath("${expression}")`;
        }
        doc.replaceRange(newLine, replacingFromPosition, replacingToPosition);
    }
};
