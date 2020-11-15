import React from 'react';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { AidboxResource } from 'shared/lib/contrib/aidbox';
import { CodeEditor } from 'src/components/CodeEditor';

import s from './ResourceDisplayBox.module.scss';

interface ResourceDisplayBoxProps {
    resourceResponse: RemoteData<AidboxResource>;
}

export function ResourceDisplayBox({ resourceResponse }: ResourceDisplayBoxProps) {
    return (
        <RenderRemoteData remoteData={resourceResponse}>
            {(resource) => (
                <div className={s.wrapper}>
                    <CodeEditor
                        valueObject={resource}
                        options={{
                            readOnly: true,
                        }}
                    />
                </div>
            )}
        </RenderRemoteData>
    );
}
