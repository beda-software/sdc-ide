import { Parameters, Resource, QuestionnaireResponse } from 'fhir/r4b';
import { YAMLException } from 'js-yaml';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { usePreviousValue } from 'sdc-qrf';

import { RemoteData } from 'fhir-react/lib/libs/remoteData';

import s from './ResourceCodeEditor.module.scss';
import { CodeEditor } from '../CodeEditor';
import { ContextMenu } from '../CodeEditor/ContextMenu';

interface ResourceCodeEditorProps<R> {
    resource: R;
    onChange: (resource: R) => void;
    onParseError: (error: YAMLException | null) => void;
    onSubmit?: (resource: R) => void;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    reload: () => void;
}

export function ResourceCodeEditor<R extends Pick<Resource, 'id' | 'meta'>>(
    props: ResourceCodeEditorProps<R>,
) {
    const {
        resource,
        onChange: originalOnChange,
        onParseError,
        onSubmit,
        launchContext,
        questionnaireResponseRD,
        reload,
    } = props;
    const previousResource = usePreviousValue(resource);
    const [value, setValue] = useState(clearMeta(resource));

    useEffect(() => {
        // Here we handle changes of external resource prop that happens once the resource is updated (on submit)
        if (
            previousResource &&
            (previousResource.id !== resource.id ||
                previousResource.meta?.versionId !== resource.meta?.versionId)
        ) {
            setValue(clearMeta(resource));
        }
    }, [resource, previousResource]);

    const onChange = (newValue: R) => {
        setValue(newValue);
        originalOnChange(newValue);
    };

    return (
        <div className={s.content}>
            <CodeEditor<R>
                value={value}
                onChange={onChange}
                onParseError={onParseError}
                onSubmit={onSubmit}
            >
                <ContextMenu
                    reload={reload}
                    resource={value}
                    launchContext={launchContext}
                    questionnaireResponseRD={questionnaireResponseRD}
                />
            </CodeEditor>
        </div>
    );
}

function clearMeta<R extends Pick<Resource, 'id' | 'meta'>>(resource: R): R {
    // TODO: it's not optimal, rewrite if it causes performance issues
    const cleanResource = _.cloneDeep(resource);
    if ('versionId' in (cleanResource?.meta ?? {})) {
        // @ts-ignore
        delete cleanResource.meta.versionId;
    }

    if ('lastUpdated' in (cleanResource?.meta ?? {})) {
        // @ts-ignore
        delete cleanResource.meta.lastUpdated;
    }

    return cleanResource;
}
