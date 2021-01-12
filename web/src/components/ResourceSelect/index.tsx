import React from 'react';
import classNames from 'classnames';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';

import { AidboxResource, Bundle } from 'shared/lib/contrib/aidbox';

import s from './ResourceSelect.module.scss';

interface ResourceSelectProps<R> {
    cssClass: string;
    value: string;
    bundleResponse: RemoteData<Bundle<R>>;
    onChange: (resourceId: string) => void;
    display?: (resource: R) => string;
}

export function ResourceSelect<R extends AidboxResource>({
    cssClass,
    value,
    bundleResponse,
    onChange,
    display,
}: ResourceSelectProps<R>) {
    return (
        <RenderRemoteData<Bundle<R>> remoteData={bundleResponse}>
            {(resource) => (
                <select
                    className={classNames(s.resourceSelect, cssClass)}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {resource.entry!.map((entry, key) => (
                        <option key={key} value={entry.resource!.id}>
                            {display ? display(entry.resource!) : entry.resource!.id}
                        </option>
                    ))}
                </select>
            )}
        </RenderRemoteData>
    );
}
