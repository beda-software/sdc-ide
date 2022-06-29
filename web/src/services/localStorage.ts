import _ from 'lodash';

import { ParametersParameter } from 'shared/src/contrib/aidbox';

import config from './config.json';

interface StorageData {
    connection: {
        client: string;
        secret: string;
        baseUrl: string;
    };
    fhirMode: boolean;
    prevActiveMappingId: string | null;
    launchContextParameters: Record<string, ParametersParameter | null | undefined>;
}

function loadStorageData(): StorageData {
    const storageData = window.localStorage;
    const connection = storageData.getItem('connection');
    const launchContextParameters = storageData.getItem('launchContextParameters');
    return {
        connection: connection
            ? JSON.parse(connection)
            : {
                  client: 'root',
                  secret: 'secret',
                  baseUrl: config.BASE_URL,
              },
        fhirMode: storageData.getItem('fhirMode') === 'true',
        prevActiveMappingId: storageData.getItem('prevActiveMappingId'),
        launchContextParameters: launchContextParameters ? JSON.parse(launchContextParameters) : {},
    };
}

export const data = loadStorageData();

export function getData<T extends keyof StorageData>(key: T): Readonly<StorageData[T]>;
export function getData(): Readonly<StorageData>;
export function getData<T extends keyof StorageData>(k?: T) {
    if (k) {
        return data[k] as Readonly<StorageData[T]>;
    } else {
        return data as Readonly<StorageData>;
    }
}

export function setData<T extends keyof StorageData>(key: T, value: StorageData[T]) {
    data[key] = value;
    flush();
}

function flush() {
    _.forEach(data, (value, key) => {
        if (key === 'prevActiveMappingId' || key === 'fhirMode') {
            window.localStorage[key] = value;
        } else {
            window.localStorage[key] = JSON.stringify(value);
        }
    });
}
