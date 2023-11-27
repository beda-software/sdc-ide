import {
    axiosInstance as aidboxInstance,
    setInstanceBaseURL as setAidboxInstanceBaseURL,
} from 'aidbox-react/lib/services/instance';
import { withRootAccess } from 'aidbox-react/lib/utils/tests';

import { setInstanceBaseURL as setFHIRInstanceBaseURL } from 'fhir-react/lib/services/instance';

beforeAll(async () => {
    setAidboxInstanceBaseURL('http://localhost:8181');
    setFHIRInstanceBaseURL('http://localhost:8181/fhir');
});

let txId: string;

beforeEach(async () => {
    await withRootAccess(async () => {
        const response = await aidboxInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: 'SELECT last_value from transaction_id_seq;' },
        });
        txId = response.data[0].result[0].last_value;

        return response;
    });
});

afterEach(async () => {
    await withRootAccess(async () => {
        await aidboxInstance({
            method: 'POST',
            url: '/$psql',
            data: { query: `select drop_before_all(${txId});` },
        });
    });
});
