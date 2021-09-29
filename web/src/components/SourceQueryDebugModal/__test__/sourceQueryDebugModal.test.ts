import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { ensure } from 'aidbox-react/src/utils/tests';
import { axiosInstance } from 'aidbox-react/src/services/instance';
import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { setData } from 'src/services/localStorage';
import { useSourceQueryDebugModal } from 'src/components/SourceQueryDebugModal/hooks';
import { expectedData } from './resources/expectedData';
import { props } from './resources/props';

beforeEach(async () => {
    setData('fhirMode', false);
    axiosInstance.defaults.auth = {
        username: 'root',
        password: 'secret',
    };
});

test('source query debug modal hooks', async () => {
    const { result, waitFor } = renderHook(() => useSourceQueryDebugModal(props));
    await waitFor(() => isSuccess(result.current.preparedSourceQueryRD));
    const data = ensure(result.current.preparedSourceQueryRD);
    expect(data).toStrictEqual(expectedData);
    act(() => result.current.onSave());
});
