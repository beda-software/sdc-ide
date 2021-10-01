import { Doc, Position } from 'codemirror';

interface MultiLineExpression {
    text: string;
    lineCount: number;
    spaceCount: number;
}

export const chooseMultiLineExpression = (innerText: string, doc: Doc, cursorPosition: Position) => {
    const fullExpressionArray = [innerText.trimStart()];
    const firstLineSpaceCount = innerText.length - innerText.trimStart().length;

    let choosenLineNumber = cursorPosition.line;
    let nextLineText = doc.getLineHandle(choosenLineNumber + 1).text;
    let nextLineSpaceCount = nextLineText.length - nextLineText.trimStart().length;

    while (firstLineSpaceCount === nextLineSpaceCount) {
        fullExpressionArray.push(nextLineText.trimStart());
        choosenLineNumber += 1;
        nextLineText = doc.getLineHandle(choosenLineNumber + 1).text;
        nextLineSpaceCount = nextLineText.length - nextLineText.trimStart().length;
    }

    const fullExpression: MultiLineExpression = {
        text: fullExpressionArray.join(' '),
        lineCount: fullExpressionArray.length,
        spaceCount: firstLineSpaceCount,
    };

    return fullExpression;
};

export const replaceLine = (
    doc: Doc | undefined,
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

export const replaceMultiLine = (
    doc: Doc | undefined,
    cursorPosition: Position | undefined,
    multiLineExpression: MultiLineExpression,
) => {
    if (doc && cursorPosition) {
        const lineLength = doc.getLine(cursorPosition.line).length;
        const replacement =
            ' '.repeat(multiLineExpression.spaceCount - 2) +
            'expression: ' +
            '>-' +
            '\n' +
            ' '.repeat(multiLineExpression.spaceCount) +
            multiLineExpression.text;
        const replacingFromPosition = { line: cursorPosition.line - 1, ch: 0 };
        const replacingToPosition = { line: cursorPosition.line + multiLineExpression.lineCount - 1, ch: lineLength };
        if (typeof multiLineExpression.text === 'string') {
            doc.replaceRange(replacement, replacingFromPosition, replacingToPosition);
        }
    }
};
