import React from 'react';
import _ from 'lodash';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { CodeEditor } from 'src/components/CodeEditor';
import { displayToObject } from 'src/utils/yaml';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { AidboxResource } from 'shared/lib/contrib/aidbox';

interface ResourceCodeEditorProps<R> {
    resourceRD: RemoteData<R>;
    onSave: (resource: R) => void;
}

export function ResourceCodeEditor<R extends AidboxResource>({ resourceRD, onSave }: ResourceCodeEditorProps<R>) {
    const onChange = _.debounce(onSave, 1000);

    return (
        <RenderRemoteData remoteData={resourceRD}>
            {(resource) => (
                <CodeEditor
                    valueObject={resource}
                    onChange={(_editor, _data, value) => onChange(displayToObject(value))}
                />
            )}
        </RenderRemoteData>
    );
}
