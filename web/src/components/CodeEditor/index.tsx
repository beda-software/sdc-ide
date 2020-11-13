import { IUnControlledCodeMirror, UnControlled as CodeMirror } from 'react-codemirror2';
import { objectToDisplay } from 'src/utils/yaml';
import React from 'react';

import 'codemirror/lib/codemirror.css';

require('codemirror/mode/yaml/yaml');

interface CodeEditorProps extends IUnControlledCodeMirror {
    valueObject?: object;
}

export function CodeEditor(props: CodeEditorProps) {
    const { valueObject = {}, options, onChange } = props;

    return (
        <CodeMirror
            value={objectToDisplay(valueObject)}
            options={{
                lineNumbers: false,
                mode: 'yaml',
                ...options,
            }}
            onChange={onChange}
        />
    );
}
