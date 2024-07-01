import classNames from 'classnames';
import { Bundle, Resource } from 'fhir/r4b';
import _ from 'lodash';
import { useCallback } from 'react';
import { MultiValue, SingleValue } from 'react-select';

import { RenderRemoteData, WithId} from '@beda.software/fhir-react';
import { getFHIRResources } from 'src/services/fhir';
import { mapSuccess,  isSuccess, RemoteData } from '@beda.software/remote-data';

import s from './ResourceSelect.module.scss';
import { AsyncSelect } from '../Select';

interface ResourceSelectProps<R extends Resource> {
    cssClass?: string;
    value: string;
    onChange: (resourceId: string) => void;
    display?: (resource: R) => string;
    bundleResponse: RemoteData<Bundle<R>>;
}

export function ResourceSelect<R extends Resource>({
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

interface RemoteResourceSelectProps<R extends Resource> {
    value: R | null | undefined;
    onChange: (resource: MultiValue<R> | SingleValue<R> | null | undefined) => void;
    display?: (resource: R) => string;
    resourceType: string;
}

export function RemoteResourceSelect<R extends Resource>({
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
        (searchText: string, callback: (options: WithId<Resource>[]) => void) => {
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
