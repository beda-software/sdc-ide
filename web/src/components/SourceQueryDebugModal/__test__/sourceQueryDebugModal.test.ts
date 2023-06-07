import { act, renderHook } from '@testing-library/react-hooks';
import { useSourceQueryDebugModal } from 'web/src/components/SourceQueryDebugModal/hooks';
import { setData } from 'web/src/services/localStorage';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { axiosInstance } from 'aidbox-react/lib/services/instance';
import { ensure } from 'aidbox-react/lib/utils/tests';

import { NutritionOrder, Patient } from 'shared/src/contrib/aidbox';

import { updateQuestionnaire } from 'src/containers/Main/hooks';

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
    setData('fhirMode', false);
    axiosInstance.defaults.auth = {
        username: 'root',
        password: 'secret',
    };
});

test('preparedSourceQueryRD', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useSourceQueryDebugModal(props));

    await waitFor(() => isSuccess(result.current.response));

    const preparedSourceQueryDataResponse = ensure(result.current.response);
    const preparedSourceQueryData = preparedSourceQueryDataResponse.preparedSourceQuery;

    expect(preparedSourceQueryData).toStrictEqual(expectedPreparedSourceQueryData);
});

test('bundleResultRD', async () => {
    const { nutritionOrder } = await setup();
    const { result, waitFor } = renderHook(() => useSourceQueryDebugModal(props));

    await waitFor(() => isSuccess(result.current.response));
    const bundleResponse = ensure(result.current.response);
    const bundleResultData = bundleResponse.bundleResult;

    expect(bundleResultData.entry?.[0].resource.entry?.[0].resource).toStrictEqual(nutritionOrder);
}, 30000);

test('onSave', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useSourceQueryDebugModal(props));
    await waitFor(() => isSuccess(result.current.response));

    await act(() => result.current.onSave(resourceSuccess));
    const responseMustBeSuccess = await updateQuestionnaire(resourceSuccess as any, false);
    expect(isSuccess(responseMustBeSuccess)).toBeTruthy();

    // await act(() => result.current.onSave(resourceFailure));
    // const responseMustBeFailure = await updateQuestionnaire(resourceFailure as any, false);
    // expect(isFailure(responseMustBeFailure)).toBeTruthy();
}, 30000);
