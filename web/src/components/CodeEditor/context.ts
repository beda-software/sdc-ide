import { EditorView } from '@codemirror/view';
import React from 'react';

interface CodeEditorContextProps {
    view: EditorView | undefined;
    editor: HTMLDivElement | null;
}

export const CodeEditorContext = React.createContext<CodeEditorContextProps>({
    view: undefined,
    editor: null,
});
