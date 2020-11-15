import React from 'react';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { AidboxResource } from 'shared/lib/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';

interface ResourceDisplayBoxProps {
    resourceResponse: RemoteData<AidboxResource>;
}

export function ResourceDisplayBox({ resourceResponse }: ResourceDisplayBoxProps) {
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
