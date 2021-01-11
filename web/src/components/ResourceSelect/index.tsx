import React from 'react';
import { isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { AidboxResource, Bundle } from 'shared/lib/contrib/aidbox';

interface ResourceSelectProps<R> {
    value: string;
    bundleResponse: RemoteData<Bundle<R>>;
    onChange: (resourceId: string) => void;
}

export function ResourceSelect<R extends AidboxResource>({ value, bundleResponse, onChange }: ResourceSelectProps<R>) {
    if (!isSuccess(bundleResponse)) {
        return null;
    }

    const entries = bundleResponse.data.entry || [];

    return (
        <div>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                {entries.map((entry, key) => (
                    <option key={key} value={entry.resource!.id}>
                        {entry.resource!.id}
                    </option>
                ))}
            </select>
        </div>
    );
}
