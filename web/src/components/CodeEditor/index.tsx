import React, { useRef } from 'react';
import { IUnControlledCodeMirror, UnControlled as CodeMirror } from 'react-codemirror2';

import { ContextMenuInfo, ReloadType, ValueObject } from 'web/src/containers/Main/types';

// import 'codemirror/lib/codemirror.css';
import './styles.css';
import { ContextMenuModal } from 'web/src/components/ContextMenuModal';
import { useContextMenu } from 'web/src/containers/Main/hooks/contextMenuHook';
import { displayToObject, objectToDisplay } from 'web/src/utils/yaml';

require('codemirror/mode/yaml/yaml');

interface CodeEditorProps extends IUnControlledCodeMirror {
    valueObject?: ValueObject;
    onChange?: (object: any) => void; // TODO check for more strict type
    openExpressionModal?: (contextMenuInfo: ContextMenuInfo) => void;
    reload?: (type: ReloadType) => void;
}

export function CodeEditor(props: CodeEditorProps) {
    const { valueObject = {}, options, onChange, openExpressionModal, reload } = props;

    const { contextMenuInfo, contextMenu, openContextMenu } = useContextMenu({
        openExpressionModal,
        valueObject,
        reload,
    });

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
                onContextMenu={(_editor, event) =>
                    openContextMenu && openContextMenu(_editor, event, valueObject)
                }
            />
            {contextMenuInfo?.showContextMenu && (
                <ContextMenuModal
                    contextMenuPosition={contextMenuInfo.menuPosition}
                    contextMenu={contextMenu}
                />
            )}
        </>
    );
}
