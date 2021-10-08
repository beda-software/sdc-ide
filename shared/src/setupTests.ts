import { axiosInstance, resetInstanceToken, setInstanceBaseURL } from 'aidbox-react/lib/services/instance';
import { withRootAccess } from 'aidbox-react/lib/utils/tests';

declare const process: any;

beforeAll(async () => {
    jest.useFakeTimers();

    if (process.env.CI) {
        setInstanceBaseURL('http://devbox:8080');
    } else {
        setInstanceBaseURL('http://localhost:8181');
    }
});

let txId: string;

beforeEach(async () => {
    await withRootAccess(async () => {
        const response = await axiosInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: 'SELECT last_value from transaction_id_seq;' },
        });
        txId = response.data[0].result[0].last_value;

        return response;
    });
});

afterEach(async () => {
    resetInstanceToken();
    await withRootAccess(async () => {
        await axiosInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: `select drop_before_all(${txId});` },
        });
    });
});

afterAll(() => {
    jest.clearAllTimers();
});
