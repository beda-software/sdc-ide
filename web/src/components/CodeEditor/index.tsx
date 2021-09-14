import React, { useRef } from 'react';
import codemirror from 'codemirror';
import { IUnControlledCodeMirror, UnControlled as CodeMirror } from 'react-codemirror2';
import { objectToDisplay, displayToObject } from 'src/utils/yaml';
import { ValueObject } from 'src/containers/Main/types';

// import 'codemirror/lib/codemirror.css';
import './styles.css';

require('codemirror/mode/yaml/yaml');

interface CodeEditorProps extends IUnControlledCodeMirror {
    valueObject?: ValueObject;
    onChange?: (object: any) => void; // TODO check for more strict type
    openExpressionModal?: (_editor: codemirror.Editor, event: any, valueObject: ValueObject) => void;
}

export function CodeEditor(props: CodeEditorProps) {
    const { valueObject = {}, options, onChange, openExpressionModal } = props;

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
            onDblClick={(_editor, event) => openExpressionModal && openExpressionModal(_editor, event, valueObject)} // TODO replace to onContextMenu
        />
    );
}
