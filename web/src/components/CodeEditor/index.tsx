import { Resource } from 'fhir/r4b';
import { useRef } from 'react';

import s from './CodeEditor.module.scss';
import { CodeEditorContext } from './context';
import { CodeEditorProps } from './types';
import { useCodeEditor } from './useCodeEditor';

export function CodeEditor<R extends Pick<Resource, 'id' | 'meta'>>(props: CodeEditorProps<R>) {
    const { children } = props;
    const editorRef = useRef<HTMLDivElement>(null);

    const { view } = useCodeEditor({
        ...props,
        container: editorRef.current,
    });

    return (
        <CodeEditorContext.Provider value={{ view, editor: editorRef.current }}>
            <div className={s.editor}>
                <div ref={editorRef}></div>
            </div>
            {children}
        </CodeEditorContext.Provider>
    );
}
