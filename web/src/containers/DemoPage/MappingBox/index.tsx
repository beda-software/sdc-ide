import React from 'react';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { Mapping } from 'shared/lib/contrib/aidbox';

import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import './styles.css';

require('codemirror/mode/javascript/javascript');
// require('codemirror/mode/yaml/yaml');

export function MappingBox() {
    const [mappingResponse] = useService(() =>
        getFHIRResource<Mapping>({
            resourceType: 'Mapping',
            id: 'patient-extract',
        }),
    );

    const saveMapping = async (resource: any) => {
        const resp = await saveFHIRResource(resource);
        console.log(resp);
    };

    return (
        <>
            <h2>Patient JUTE Mapping</h2>
            <RenderRemoteData remoteData={mappingResponse}>
                {(mapping) => (
                    <>
                        <CodeMirror
                            value={JSON.stringify(mapping, undefined, 2)}
                            options={{
                                lineNumbers: false,
                                mode: 'javascript',
                            }}
                            onChange={(editor, data, value) => {
                                setTimeout(() => {
                                    saveMapping(JSON.parse(value));
                                }, 2000);
                            }}
                        />
                    </>
                )}
            </RenderRemoteData>
        </>
    );
}
