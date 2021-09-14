import CodeMirror, { Position } from 'codemirror';

export const replaceLine = (doc: CodeMirror.Doc | undefined, cursorPosition: Position | undefined, newLine: string) => {
    if (doc && cursorPosition) {
        const lineLength = doc.getLine(cursorPosition.line).length;
        const replacingFromPosition = { line: cursorPosition.line, ch: cursorPosition.ch };
        const replacingToPosition = { line: cursorPosition.line, ch: lineLength };
        doc.replaceRange(newLine, replacingFromPosition, replacingToPosition);
    }
};
