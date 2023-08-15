import { FhirResource } from 'fhir/r4b';
import { memo } from 'react';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';

import { RemoteData } from 'fhir-react/lib/libs/remoteData';

interface ResourceDisplayBoxProps {
    resourceResponse: RemoteData<FhirResource>;
}

function ResourceCodeDisplayRaw({ resourceResponse }: ResourceDisplayBoxProps) {
    return (
        <RenderRemoteData remoteData={resourceResponse}>
            {(resource) => (
                <CodeEditor
                    valueObject={resource}
                    key={JSON.stringify(resource)}
                    options={{
                        readOnly: true,
                    }}
                />
            )}
        </RenderRemoteData>
    );
}

export const ResourceCodeDisplay = memo(ResourceCodeDisplayRaw);
