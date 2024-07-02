import {
    resetInstanceToken as resetFHIRInstanceToken,
    setInstanceBaseURL as setFHIRInstanceBaseURL,
} from 'web/src/services/fhir';

import {
    axiosInstance,
    resetInstanceToken as resetAidboxInstanceToken,
    setInstanceBaseURL as setAidboxInstanceBaseURL,
} from 'aidbox-react/lib/services/instance';
import { withRootAccess } from 'aidbox-react/lib/utils/tests';

beforeAll(async () => {
    setAidboxInstanceBaseURL('http://localhost:8181');
    setFHIRInstanceBaseURL('http://localhost:8181/fhir');
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
    resetAidboxInstanceToken();
    resetFHIRInstanceToken();
    await withRootAccess(async () => {
        await axiosInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: `select drop_before_all(${txId});` },
        });
    });
});
