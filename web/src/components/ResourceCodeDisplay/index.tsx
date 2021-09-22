import React from 'react';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/src/libs/remoteData';
import { AidboxResource } from 'shared/src/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';

interface ResourceDisplayBoxProps {
    resourceResponse: RemoteData<AidboxResource>;
}

function ResourceCodeDisplayRaw({ resourceResponse }: ResourceDisplayBoxProps) {
    return (
        <RenderRemoteData remoteData={resourceResponse}>
            {(resource) => (
                <CodeEditor
                    valueObject={resource}
                    options={{
                        readOnly: true,
                    }}
                />
            )}
        </RenderRemoteData>
    );
}

export const ResourceCodeDisplay = React.memo(ResourceCodeDisplayRaw);
