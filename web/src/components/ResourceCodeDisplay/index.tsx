import React from 'react';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/src/libs/remoteData';
import { AidboxResource } from 'shared/src/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';
import { OpenContextMenu } from 'src/containers/Main/types';

interface ResourceDisplayBoxProps {
    resourceResponse: RemoteData<AidboxResource>;
    openContextMenu: OpenContextMenu;
}

function ResourceCodeDisplayRaw({ resourceResponse, openContextMenu }: ResourceDisplayBoxProps) {
    return (
        <RenderRemoteData remoteData={resourceResponse}>
            {(resource) => (
                <CodeEditor
                    valueObject={resource}
                    openContextMenu={openContextMenu}
                    options={{
                        readOnly: true,
                    }}
                />
            )}
        </RenderRemoteData>
    );
}

export const ResourceCodeDisplay = React.memo(ResourceCodeDisplayRaw);
