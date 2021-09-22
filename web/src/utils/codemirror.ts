import CodeMirror, { Position } from 'codemirror';

export const replaceLine = (
    doc: CodeMirror.Doc | undefined,
    cursorPosition: Position | undefined,
    newLine: string | undefined,
) => {
    if (doc && cursorPosition) {
        const lineLength = doc.getLine(cursorPosition.line).length;
        const replacingFromPosition = { line: cursorPosition.line, ch: 0 };
        const replacingToPosition = { line: cursorPosition.line, ch: lineLength };
        if (typeof newLine === 'string') {
            doc.replaceRange(newLine, replacingFromPosition, replacingToPosition);
        }
    }
};
