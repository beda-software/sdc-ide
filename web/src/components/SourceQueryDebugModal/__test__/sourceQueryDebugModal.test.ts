import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { ensure } from 'aidbox-react/src/utils/tests';
import { axiosInstance } from 'aidbox-react/src/services/instance';
import { saveFHIRResource } from 'aidbox-react/src/services/fhir';
import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { NutritionOrder, Patient } from 'shared/src/contrib/aidbox';
import { setData } from 'src/services/localStorage';
import { useSourceQueryDebugModal } from 'src/components/SourceQueryDebugModal/hooks';
import { expectedPreparedSourceQueryData } from './resources/expectedData';
import { nutritionorderData, patientData, props } from './resources';

async function setup() {
    const patient = ensure(await saveFHIRResource<Patient>(patientData));
    const nutritionorder = ensure(await saveFHIRResource<NutritionOrder>(nutritionorderData));
    return { patient, nutritionorder };
}

beforeEach(async () => {
    setData('fhirMode', false);
    axiosInstance.defaults.auth = {
        username: 'root',
        password: 'secret',
    };
});

test('bundleResultRD', async () => {
    const { nutritionorder } = await setup();
    const { result, waitFor } = renderHook(() => useSourceQueryDebugModal(props));
    await waitFor(() => isSuccess(result.current.bundleResultRD));
    const preparedSourceQueryData = ensure(result.current.preparedSourceQueryRD);
    const bundleResultData = ensure(result.current.bundleResultRD);
    expect(preparedSourceQueryData).toStrictEqual(expectedPreparedSourceQueryData);
    expect(bundleResultData.entry?.[0].resource.entry?.[0].resource).toStrictEqual(nutritionorder);
    act(() => result.current.onSave());
});
