import { useState } from 'react';
import { commands, Editor } from 'codemirror';
import { ContextMenu, ContextMenuInfo, ExpressionModalInfo, ValueObject } from 'src/containers/Main/types';

export function useContextMenu() {
    const [expressionModalInfo, setExpressionModalInfo] = useState<ExpressionModalInfo | null>(null);
    const [contextMenuInfo, setContextMenuInfo] = useState<ContextMenuInfo | null>(null);

    const copySelectedText = () => {
        const selectedText = contextMenuInfo?.editor.getSelection();
        selectedText && navigator.clipboard.writeText(selectedText);
        return selectedText;
    };

    const closeContextMenu = () =>
        setContextMenuInfo(contextMenuInfo && { ...contextMenuInfo, showContextMenu: false });

    const openExpressionModal = (contextMenuInfo: ContextMenuInfo) => {
        let modalType;
        let choosenExpression;
        if (contextMenuInfo && hasOwnProperty(contextMenuInfo.valueObject, 'resourceType')) {
            if (
                contextMenuInfo.valueObject.resourceType === 'Questionnaire' &&
                contextMenuInfo.event.target.innerText.split('')[0] === "'"
            ) {
                modalType = 'LaunchContext';
                choosenExpression = contextMenuInfo.event.target.innerText.replaceAll("'", '');
            }

            if (
                contextMenuInfo.valueObject.resourceType === 'Mapping' &&
                contextMenuInfo.event.target.innerText.split('')[0] === '"'
            ) {
                modalType = 'QuestionnaireResponse';
                choosenExpression = contextMenuInfo.event.target.innerText.replaceAll('"', '');
            }
        }
        setExpressionModalInfo({
            type: modalType,
            expression: choosenExpression,
            doc: contextMenuInfo.editor.getDoc(),
            cursorPosition: contextMenuInfo.cursorPosition,
        });
    };

    const contextMenu: ContextMenu = {
        close: () => closeContextMenu(),
        debugger: () => {
            contextMenuInfo && openExpressionModal(contextMenuInfo);
            closeContextMenu();
        },
        undo: () => {
            contextMenuInfo?.editor.undo();
            closeContextMenu();
        },
        redo: () => {
            contextMenuInfo?.editor.redo();
            closeContextMenu();
        },
        cut: () => {
            const selectedText = copySelectedText();
            contextMenuInfo?.editor.replaceSelection('', selectedText);
            closeContextMenu();
        },
        copy: () => {
            copySelectedText();
            closeContextMenu();
        },
        paste: () => {
            navigator.clipboard.readText().then((clipText) => {
                if (!contextMenuInfo?.editor.somethingSelected() && contextMenuInfo?.cursorPosition) {
                    contextMenuInfo.editor.setCursor(contextMenuInfo.cursorPosition);
                    contextMenuInfo.editor.replaceRange(clipText, contextMenuInfo.cursorPosition);
                }
                if (contextMenuInfo?.editor.somethingSelected()) {
                    const selectedText = contextMenuInfo?.editor.getSelection();
                    contextMenuInfo.editor.replaceSelection(clipText, selectedText);
                }
            });
            closeContextMenu();
        },
        selectAll: () => {
            contextMenuInfo && commands.selectAll(contextMenuInfo?.editor);
            contextMenuInfo?.editor.focus();
            closeContextMenu();
        },
    };

    const openContextMenu = (_editor: Editor, event: any, valueObject: ValueObject) => {
        event.preventDefault();
        const cursorCoordinates = { left: event.x, right: event.x, top: event.y, bottom: event.y };
        const cursorPosition = _editor.coordsChar(cursorCoordinates);
        setContextMenuInfo({
            cursorPosition,
            menuPosition: cursorCoordinates,
            editor: _editor,
            showContextMenu: true,
            event,
            valueObject,
        });
    };

    const closeExpressionModal = () => {
        setExpressionModalInfo(null);
    };

    const setExpression = (expression: string) => {
        setExpressionModalInfo((modalInfo) => modalInfo && { ...modalInfo, expression });
    };

    return {
        openContextMenu,
        expressionModalInfo,
        closeExpressionModal,
        setExpression,
        contextMenuInfo,
        contextMenu,
    };
}

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}
