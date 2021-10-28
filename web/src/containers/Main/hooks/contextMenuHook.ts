import { useState } from 'react';
import { commands, Editor } from 'codemirror';
import { ContextMenu, ContextMenuInfo, ValueObject } from 'src/containers/Main/types';

interface Props {
    openExpressionModal?: (contextMenuInfo: ContextMenuInfo) => void;
    questionnaireUpdate?: boolean;
    setQuestionnaireUpdate?: (questionnaireUpdate: boolean) => void;
    updateMapping?: () => void;
}

export function useContextMenu({
    openExpressionModal,
    questionnaireUpdate,
    setQuestionnaireUpdate,
    updateMapping,
}: Props) {
    const [contextMenuInfo, setContextMenuInfo] = useState<ContextMenuInfo | null>(null);

    const contextMenu: ContextMenu = {
        close: () => closeContextMenu(),
        // TODO: show debug item only in case we clicked on expression, otherwise disable this item
        debugger: openExpressionModal
            ? () => {
                  contextMenuInfo && openExpressionModal && openExpressionModal(contextMenuInfo);
                  closeContextMenu();
              }
            : undefined,
        reload:
            setQuestionnaireUpdate || updateMapping
                ? () => {
                      if (setQuestionnaireUpdate && questionnaireUpdate !== undefined) {
                          setQuestionnaireUpdate(!questionnaireUpdate);
                      }
                      if (updateMapping) {
                          updateMapping();
                      }
                  }
                : undefined,
        undo: () => {
            contextMenuInfo?.editor.undo();
            closeContextMenu();
        },
        redo: () => {
            contextMenuInfo?.editor.redo();
            closeContextMenu();
        },
        // TODO: disable items if we use read-only mode
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
