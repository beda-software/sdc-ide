import React, { useCallback } from 'react';
import _ from 'lodash';
import { RemoteData } from 'aidbox-react/src/libs/remoteData';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { CodeEditor } from 'src/components/CodeEditor';
import { AidboxResource } from 'shared/src/contrib/aidbox';

interface ResourceCodeEditorProps<R> {
    resourceRD: RemoteData<R>;
    onSave: (resource: R) => void;
}

export function ResourceCodeEditor<R extends AidboxResource>({ resourceRD, onSave }: ResourceCodeEditorProps<R>) {
    const onChange = useCallback(_.debounce(onSave, 1000), [onSave]);

    return (
        <RenderRemoteData remoteData={resourceRD}>
            {(resource) => <CodeEditor key={resource.id} valueObject={resource} onChange={onChange} />}
        </RenderRemoteData>
    );
}
