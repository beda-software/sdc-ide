import React from 'react';
import AsyncSelect from 'react-select/async';
import _ from 'lodash';
import classNames from 'classnames';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';
import { isSuccess, RemoteData } from 'aidbox-react/src/libs/remoteData';

import { AidboxResource, Bundle, Resource } from 'shared/src/contrib/aidbox';

import s from './ResourceSelect.module.scss';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess } from 'aidbox-react/src/services/service';

interface ResourceSelectProps<R extends AidboxResource> {
    cssClass?: string;
    value: string;
    onChange: (resourceId: string) => void;
    display?: (resource: R) => string;
    bundleResponse: RemoteData<Bundle<R>>;
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
            {(resource) => {
                console.log(resource);
                return (
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
                );
            }}
        </RenderRemoteData>
    );
}

interface RemoteResourceSelectProps<R extends AidboxResource> {
    value: R | null | undefined;
    onChange: (resource: R | null | undefined) => void;
    display?: (resource: R) => string;
    resourceType: R['resourceType'];
}

export function RemoteResourceSelect<R extends AidboxResource>({
    value,
    resourceType,
    onChange,
    display,
}: RemoteResourceSelectProps<R>) {
    const loadOptions = React.useCallback(
        async (searchText: string) => {
            const response = await getFHIRResources<R>(resourceType, { _ilike: `%${searchText}%` });
            const prepared = mapSuccess(response, (bundle) => (bundle.entry ?? []).map((e) => e.resource!));
            if (isSuccess(prepared)) {
                return prepared.data;
            }
            return [];
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [resourceType],
    );

    const debouncedLoadOptions = _.debounce((searchText: string, callback: (options: R[]) => void) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    return (
        <AsyncSelect<R>
            loadOptions={debouncedLoadOptions}
            defaultOptions
            getOptionLabel={display ?? getId}
            getOptionValue={_.identity}
            onChange={onChange}
            value={value}
        />
    );
}

const getId = (r: Resource | undefined | null) => r?.id ?? 'undefined';
