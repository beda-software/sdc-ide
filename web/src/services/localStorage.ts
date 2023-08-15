import _ from 'lodash';

interface StorageData {
    connection: {
        client: string;
        baseUrl: string;
        secret?: string;
    };
}

function loadStorageData(): StorageData {
    const storageData = window.localStorage;
    const connection = storageData.getItem('connection');
    return {
        connection: connection
            ? JSON.parse(connection)
            : {
                  client: 'root',
                  secret: 'secret',
                  baseUrl:
                      (window as any).BASE_URL === '{{BASE_URL}}'
                          ? 'http://localhost:8080'
                          : (window as any).BASE_URL,
              },
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
        window.localStorage[key] = JSON.stringify(value);
    });
}
