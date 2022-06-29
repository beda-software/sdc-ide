import { memo } from 'react';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';

 
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';

import { AidboxResource } from 'shared/src/contrib/aidbox';

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

export const ResourceCodeDisplay = memo(ResourceCodeDisplayRaw);
