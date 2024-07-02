import { RemoteData } from '@beda.software/remote-data';
import { Parameters, Resource, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';

import s from './ResourceCodeEditor.module.scss';
import { CodeEditor } from '../CodeEditor';
import { ContextMenu } from '../CodeEditor/ContextMenu';

interface ResourceCodeEditorProps<R> {
    resource: R;
    onChange: (resource: R) => void;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    reload: () => void;
}

export function ResourceCodeEditor<R extends Resource>(props: ResourceCodeEditorProps<R>) {
    const {
        resource: initialResource,
        onChange,
        launchContext,
        questionnaireResponseRD,
        reload,
    } = props;
    const [resource, setResource] = useState(initialResource);

    useEffect(() => {
        if (
            initialResource.id !== resource.id ||
            initialResource.meta?.versionId !== resource.meta?.versionId
        ) {
            setResource(initialResource);
        }
    }, [initialResource, resource]);

    return (
        <div className={s.content}>
            <CodeEditor<R> value={resource} onChange={onChange}>
                <ContextMenu
                    reload={reload}
                    resource={resource}
                    launchContext={launchContext}
                    questionnaireResponseRD={questionnaireResponseRD}
                />
            </CodeEditor>
        </div>
    );
}
