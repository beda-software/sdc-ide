import { ViewUpdate } from '@codemirror/view';
import { YAMLException } from 'js-yaml';
import { ReactElement } from 'react';

export interface CodeEditorProps<R> {
    value: R;
    onChange?: (value: R, vu: ViewUpdate) => void;
    onParseError?: (error: YAMLException | null) => void;
    readOnly?: boolean;
    children?: ReactElement;
}
