import { act, renderHook } from '@testing-library/react-hooks';
import { NutritionOrder, Patient } from 'fhir/r4b';
import { useSourceQueryDebugModal } from 'web/src/components/SourceQueryDebugModal/hooks';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { saveFHIRResource } from 'fhir-react/lib/services/fhir';
import { axiosInstance } from 'fhir-react/lib/services/instance';
import { ensure } from 'fhir-react/lib/utils/tests';

import {
    nutritionOrderData,
    patientData,
    props,
    resourceSuccess,
    expectedPreparedSourceQueryData,
} from './resources';

async function setup() {
    const patient = ensure(await saveFHIRResource<Patient>(patientData));
    const nutritionOrder = ensure(await saveFHIRResource<NutritionOrder>(nutritionOrderData));
    ensure(await saveFHIRResource(resourceSuccess));
    return { patient, nutritionOrder };
}

beforeEach(async () => {
    axiosInstance.defaults.auth = {
        username: 'root',
        password: 'secret',
    };
});

test.skip('preparedSourceQueryRD', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useSourceQueryDebugModal(props));

    await waitFor(() => isSuccess(result.current.response));

    const preparedSourceQueryDataResponse = ensure(result.current.response);
    const preparedSourceQueryData = preparedSourceQueryDataResponse.preparedSourceQuery;

    expect(preparedSourceQueryData).toStrictEqual(expectedPreparedSourceQueryData);
});

test.skip('bundleResultRD', async () => {
    const { nutritionOrder } = await setup();
    const { result, waitFor } = renderHook(() => useSourceQueryDebugModal(props));

    await waitFor(() => isSuccess(result.current.response));
    const bundleResponse = ensure(result.current.response);
    const bundleResultData = bundleResponse.bundleResult;

    expect(bundleResultData.entry?.[0].resource.entry?.[0].resource).toStrictEqual(nutritionOrder);
}, 30000);

test.skip('onSave', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useSourceQueryDebugModal(props));
    await waitFor(() => isSuccess(result.current.response));

    await act(() => result.current.onSave(resourceSuccess));
    const responseMustBeSuccess = await saveFHIRResource(resourceSuccess as any);
    expect(isSuccess(responseMustBeSuccess)).toBeTruthy();

    // await act(() => result.current.onSave(resourceFailure));
    // const responseMustBeFailure = await updateQuestionnaire(resourceFailure as any, false);
    // expect(isFailure(responseMustBeFailure)).toBeTruthy();
}, 30000);
