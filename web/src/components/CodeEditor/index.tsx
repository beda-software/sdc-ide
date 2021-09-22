import React, { useRef } from 'react';
import { IUnControlledCodeMirror, UnControlled as CodeMirror } from 'react-codemirror2';
import { objectToDisplay, displayToObject } from 'src/utils/yaml';
import { OpenContextMenu, ValueObject } from 'src/containers/Main/types';

// import 'codemirror/lib/codemirror.css';
import './styles.css';

require('codemirror/mode/yaml/yaml');

interface CodeEditorProps extends IUnControlledCodeMirror {
    valueObject?: ValueObject;
    onChange?: (object: any) => void; // TODO check for more strict type
    openContextMenu: OpenContextMenu;
}

export function CodeEditor(props: CodeEditorProps) {
    const { valueObject = {}, options, onChange, openContextMenu } = props;

    const cache = useRef(valueObject);

    return (
        <CodeMirror
            value={objectToDisplay(options?.readOnly ? valueObject : cache.current)}
            options={{
                lineNumbers: false,
                mode: 'yaml',
                ...options,
            }}
            onChange={(_editor, _change, value) => onChange && onChange(displayToObject(value))}
            onContextMenu={(_editor, event) => openContextMenu(_editor, event, valueObject)}
        />
    );
}
