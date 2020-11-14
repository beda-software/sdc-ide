import React, { useCallback } from 'react';
import _ from 'lodash';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { Mapping } from 'shared/lib/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';
import { useShowMapping } from 'src/containers/DemoPage/MappingBox/hooks';

import s from './MappingBox.module.scss';
import { displayToObject } from 'src/utils/yaml';

interface MappingBoxProps {
    mappingId: string;
}

async function saveMapping(resource: Mapping) {
    const resp = await saveFHIRResource(resource);
    console.log('saveMapping', resp);
}

export function MappingBox({ mappingId }: MappingBoxProps) {
    const [mappingResponse] = useService(() =>
        getFHIRResource<Mapping>({
            resourceType: 'Mapping',
            id: mappingId,
        }),
    );

    const { toggleShowMapping, wrapperStyle, symbol } = useShowMapping();

    const onChange = useCallback(_.debounce(saveMapping, 2000), [saveMapping]);

    return (
        <>
            <h2 onClick={toggleShowMapping}>
                <span className={s.toggleArrow}>{symbol}</span>
                Patient JUTE Mapping
            </h2>
            <RenderRemoteData remoteData={mappingResponse}>
                {(mapping) => (
                    <div className={s.wrapper} style={wrapperStyle}>
                        <CodeEditor
                            valueObject={mapping}
                            onChange={(_editor, _data, value) => onChange(displayToObject(value))}
                        />
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
}
