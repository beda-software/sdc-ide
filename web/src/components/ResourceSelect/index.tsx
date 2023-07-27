import classNames from 'classnames';
import _ from 'lodash';
import { useCallback } from 'react';
import { MultiValue, SingleValue } from 'react-select';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { AidboxResource, Bundle, Resource } from 'shared/src/contrib/aidbox';

import { AsyncSelect } from '../Select';
import s from './ResourceSelect.module.scss';

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

interface RemoteResourceSelectProps<R extends AidboxResource> {
    value: R | null | undefined;
    onChange: (resource: MultiValue<R> | SingleValue<R> | null | undefined) => void;
    display?: (resource: R) => string;
    resourceType: R['resourceType'];
}

export function RemoteResourceSelect<R extends AidboxResource>({
    value,
    resourceType,
    onChange,
    display,
}: RemoteResourceSelectProps<R>) {
    const loadOptions = useCallback(
        async (searchText: string) => {
            const response = await getFHIRResources(resourceType, { _ilike: `%${searchText}%` });
            const prepared = mapSuccess(response, (bundle) =>
                (bundle.entry ?? []).map((e) => e.resource!),
            );
            if (isSuccess(prepared)) {
                return prepared.data;
            }
            return [];
        },
        [resourceType],
    );

    const debouncedLoadOptions = _.debounce(
        (searchText: string, callback: (options: R[]) => void) => {
            (async () => callback(await loadOptions(searchText)))();
        },
        500,
    );

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
