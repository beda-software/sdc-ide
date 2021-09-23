import React, { useRef } from 'react';
import { IUnControlledCodeMirror, UnControlled as CodeMirror } from 'react-codemirror2';
import { displayToObject, objectToDisplay } from 'src/utils/yaml';
import { ContextMenuInfo, ValueObject } from 'src/containers/Main/types';

// import 'codemirror/lib/codemirror.css';
import './styles.css';
import { ContextMenuModal } from 'src/components/ContextMenuModal';
import { useContextMenu } from 'src/containers/Main/hooks/contextMenuHook';

require('codemirror/mode/yaml/yaml');

interface CodeEditorProps extends IUnControlledCodeMirror {
    valueObject?: ValueObject;
    onChange?: (object: any) => void; // TODO check for more strict type
    openExpressionModal?: (contextMenuInfo: ContextMenuInfo) => void;
}

export function CodeEditor(props: CodeEditorProps) {
    const { valueObject = {}, options, onChange, openExpressionModal } = props;

    const { contextMenuInfo, contextMenu, openContextMenu } = useContextMenu({ openExpressionModal });

    const cache = useRef(valueObject);

    return (
        <>
            <CodeMirror
                value={objectToDisplay(options?.readOnly ? valueObject : cache.current)}
                options={{
                    lineNumbers: false,
                    mode: 'yaml',
                    ...options,
                }}
                onChange={(_editor, _change, value) => onChange && onChange(displayToObject(value))}
                onContextMenu={(_editor, event) => openContextMenu && openContextMenu(_editor, event, valueObject)}
            />
            {contextMenuInfo?.showContextMenu && (
                <ContextMenuModal contextMenuPosition={contextMenuInfo.menuPosition} contextMenu={contextMenu} />
            )}
        </>
    );
}
