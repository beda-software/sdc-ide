import { useState } from 'react';
import { commands, Editor } from 'codemirror';
import {
    ContextMenu,
    ContextMenuInfo,
    ReloadType,
    ValueObject,
} from 'web/src/containers/Main/types';
import { hasOwnProperty } from 'web/src/utils/common';

interface Props {
    valueObject: ValueObject;
    openExpressionModal?: (contextMenuInfo: ContextMenuInfo) => void;
    reload?: (type: ReloadType) => void;
}

export function useContextMenu({ valueObject, openExpressionModal, reload }: Props) {
    const [contextMenuInfo, setContextMenuInfo] = useState<ContextMenuInfo | null>(null);

    const isMappingOrQuestionnaire = () => {
        if (
            hasOwnProperty(valueObject, 'resourceType') &&
            (valueObject.resourceType === 'Mapping' || 'Questionnaire')
        ) {
            return valueObject.resourceType;
        }
    };

    const debuggerOption = openExpressionModal
        ? () => {
              contextMenuInfo && openExpressionModal(contextMenuInfo);
              close();
          }
        : undefined;

    const reloadOption =
        reload && isMappingOrQuestionnaire()
            ? () => reload(isMappingOrQuestionnaire() as ReloadType)
            : undefined;

    const undo = () => {
        contextMenuInfo?.editor.undo();
        close();
    };

    const redo = () => {
        contextMenuInfo?.editor.redo();
        close();
    };

    const cut = () => {
        const selectedText = copySelectedText();
        contextMenuInfo?.editor.replaceSelection('', selectedText);
        close();
    };

    const copy = () => {
        copySelectedText();
        close();
    };

    const paste = () => {
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
        close();
    };

    const selectAll = () => {
        contextMenuInfo && commands.selectAll(contextMenuInfo.editor);
        contextMenuInfo?.editor.focus();
        close();
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

    const close = () =>
        setContextMenuInfo(contextMenuInfo && { ...contextMenuInfo, showContextMenu: false });

    const copySelectedText = () => {
        const selectedText = contextMenuInfo?.editor.getSelection();
        selectedText && navigator.clipboard.writeText(selectedText);
        return selectedText;
    };

    const contextMenu: ContextMenu = {
        close,
        debugger: debuggerOption, // TODO: show debug item only in case we clicked on expression, otherwise disable this item
        reload: reloadOption,
        undo,
        redo,
        cut, // TODO: disable items if we use read-only mode
        copy,
        paste,
        selectAll,
    };

    return {
        openContextMenu,
        contextMenuInfo,
        contextMenu,
    };
}
