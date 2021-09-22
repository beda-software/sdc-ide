import { useState } from 'react';
import { commands, Editor } from 'codemirror';
import { ContextMenu, ContextMenuInfo, ValueObject } from 'src/containers/Main/types';

// interface Props {
//     // openExpressionModal: (contextMenuInfo: ContextMenuInfo) => void;
// }

export function useContextMenu() {
    const [contextMenuInfo, setContextMenuInfo] = useState<ContextMenuInfo | null>(null);

    const contextMenu: ContextMenu = {
        close: () => closeContextMenu(),
        debugger: () => {
            // contextMenuInfo && openExpressionModal(contextMenuInfo);
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
            contextMenuInfo && commands.selectAll(contextMenuInfo.editor);
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

    const closeContextMenu = () =>
        setContextMenuInfo(contextMenuInfo && { ...contextMenuInfo, showContextMenu: false });

    const copySelectedText = () => {
        const selectedText = contextMenuInfo?.editor.getSelection();
        selectedText && navigator.clipboard.writeText(selectedText);
        return selectedText;
    };

    return {
        openContextMenu,
        contextMenuInfo,
        contextMenu,
    };
}
