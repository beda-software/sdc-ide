import React, { useCallback } from 'react';
import _ from 'lodash';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { Mapping } from 'shared/lib/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';

import { displayToObject } from 'src/utils/yaml';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';

interface MappingBoxProps {
    mappingId: string;
    reload: () => void;
}

export function MappingBox({ mappingId, reload }: MappingBoxProps) {
    const [mappingResponse] = useService(() =>
        getFHIRResource<Mapping>({
            resourceType: 'Mapping',
            id: mappingId,
        }),
    );
    const saveMapping = useCallback(
        async (resource: Mapping) => {
            const resp = await saveFHIRResource(resource);
            if (isSuccess(resp)) {
                reload();
            }
        },
        [reload],
    );

    const onChange = useCallback(_.debounce(saveMapping, 1000), [saveMapping]);

    return (
        <RenderRemoteData remoteData={mappingResponse}>
            {(mapping) => (
                <CodeEditor
                    valueObject={mapping}
                    onChange={(_editor, _data, value) => onChange(displayToObject(value))}
                />
            )}
        </RenderRemoteData>
    );
}
