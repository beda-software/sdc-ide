import { useRef } from 'react';
// eslint-disable-next-line import/order
import { IUnControlledCodeMirror, UnControlled as CodeMirror } from 'react-codemirror2';

// eslint-disable-next-line import/order
import { ContextMenuModal } from 'web/src/components/ContextMenuModal';
import { ContextMenuInfo, ReloadType, ValueObject } from 'web/src/containers/Main/types';
import { displayToObject, objectToDisplay } from 'web/src/utils/yaml';

// import 'codemirror/lib/codemirror.css';
import './styles.css';

import s from './CodeEditor.module.scss';
import { useContextMenu } from './contextMenuHook';

import 'codemirror/mode/yaml/yaml';

interface CodeEditorProps extends IUnControlledCodeMirror {
    valueObject: ValueObject;
    onChange?: (object: any) => void; // TODO check for more strict type
    openExpressionModal?: (contextMenuInfo: ContextMenuInfo) => void;
    reload?: (type: ReloadType) => void;
}

export function CodeEditor(props: CodeEditorProps) {
    const { valueObject, options, onChange, openExpressionModal, reload } = props;

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
                onChange={(_editor, _change, value) => {
                    onChange && onChange(displayToObject(value));
                }}
                onContextMenu={(_editor, event) =>
                    openContextMenu && openContextMenu(_editor, event, valueObject)
                }
                className={s.editor}
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
