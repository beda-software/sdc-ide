import { isLoading, RemoteData } from 'fhir-react';
import { ReactElement, useEffect, useState } from 'react';

export function CachedRemoteData<S, E>(props: {
    remoteData: RemoteData<S, E>;
    children: (data: RemoteData<S, E>) => ReactElement;
}) {
    const { children, remoteData } = props;
    const [cachedRD, setCacheRD] = useState(remoteData);

    useEffect(() => {
        if (!isLoading(remoteData)) {
            setCacheRD(remoteData);
        }
    }, [remoteData]);

    return children(cachedRD);
}
