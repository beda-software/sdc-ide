import React from 'react';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { Mapping } from 'shared/lib/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';
import { useShowMapping } from 'src/containers/DemoPage/MappingBox/hooks';

import s from './MappingBox.module.scss';
import {displayToObject} from "src/utils/yaml";

interface MappingBoxProps {
    mappingId: string;
}

export function MappingBox({ mappingId }: MappingBoxProps) {
    const [mappingResponse] = useService(() =>
        getFHIRResource<Mapping>({
            resourceType: 'Mapping',
            id: mappingId,
        }),
    );

    const saveMapping = async (resource: Mapping) => {
        const resp = await saveFHIRResource(resource);
        console.log('saveMapping', resp);
    };

    const { toggleShowMapping, wrapperStyle, symbol } = useShowMapping();

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
                            onChange={(editor, data, value) => {
                                setTimeout(() => {
                                    saveMapping(displayToObject(value));
                                }, 2000);
                            }}
                        />
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
}
