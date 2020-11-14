import { IUnControlledCodeMirror, UnControlled as CodeMirror } from 'react-codemirror2';
import { objectToDisplay } from 'src/utils/yaml';
import React, { useRef } from 'react';

// import 'codemirror/lib/codemirror.css';
import './styles.css';

require('codemirror/mode/yaml/yaml');

interface CodeEditorProps extends IUnControlledCodeMirror {
    valueObject?: object;
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
            onChange={onChange}
        />
    );
}
