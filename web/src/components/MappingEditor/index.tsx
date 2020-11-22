import React from 'react';
import _ from 'lodash';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { CodeEditor } from 'src/components/CodeEditor';
import { displayToObject } from 'src/utils/yaml';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { Mapping } from 'shared/lib/contrib/aidbox';

interface MappingEditorProps {
    mappingRD: RemoteData<Mapping>;
    saveMapping: (mapping: Mapping) => void;
}

export function MappingEditor({ mappingRD, saveMapping }: MappingEditorProps) {
    const onChange = _.debounce(saveMapping, 1000);

    return (
        <RenderRemoteData remoteData={mappingRD}>
            {(mapping) => (
                <CodeEditor
                    valueObject={mapping}
                    onChange={(_editor, _data, value) => onChange(displayToObject(value))}
                />
            )}
        </RenderRemoteData>
    );
}
