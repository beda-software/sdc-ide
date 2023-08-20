import { ViewUpdate } from '@codemirror/view';
import { ReactElement } from 'react';

export interface CodeEditorProps<R> {
    value: R;
    onChange?: (value: R, vu: ViewUpdate) => void;
    readOnly?: boolean;
    children?: ReactElement;
}
