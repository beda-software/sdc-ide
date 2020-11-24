import { IUnControlledCodeMirror, UnControlled as CodeMirror } from 'react-codemirror2';
import { objectToDisplay, displayToObject } from 'src/utils/yaml';
import React, { useRef } from 'react';

// import 'codemirror/lib/codemirror.css';
import './styles.css';

require('codemirror/mode/yaml/yaml');

interface CodeEditorProps extends IUnControlledCodeMirror {
    valueObject?: object;
    onChange?: (object: any) => void;
}

export function CodeEditor(props: CodeEditorProps) {
    const { valueObject = {}, options, onChange } = props;

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
        />
    );
}
