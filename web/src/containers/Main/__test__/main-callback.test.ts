import { renderHook, act } from '@testing-library/react-hooks';
import { ensure } from 'aidbox-react/src/utils/tests';

import { service } from 'aidbox-react/src/services/service';

import { useMain } from 'src/containers/Main/hooks';

import { Mapping, Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import patientTest1 from './resources/Patient/test-1.json';
import mappingTest1 from './resources/Mapping/test-1.json';
import mappingTest1New from './resources/Mapping/test-1-new.json';
import mappingTest2 from './resources/Mapping/test-2.json';
import questionnaireTest1 from './resources/Questionnaire/test-1.json';
import questionnaireTest1FHIRNew from './resources/Questionnaire/test-1-fhir-new.json';
import questionnaireResponseNew from './resources/QuestionnaireResponse/demo-1-new.json';
import { setData } from 'src/services/localStorage';
import { EXPECTED_RESOURCES } from './resources';
import { axiosInstance } from 'aidbox-react/src/services/instance';

async function setup() {
    return service({
        method: 'PUT',
        url: '',
        data: [patientTest1, mappingTest1, mappingTest2, questionnaireTest1],
    });
}

beforeEach(async () => {
    setData('fhirMode', false);
    axiosInstance.defaults.auth = {
        username: 'root',
        password: 'secret',
    };
});

test('saveQuestionnaireFHIR', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useMain('test-1'));

    await waitFor(() => {
        ensure(result.current.questionnaireRD);
    });
    await act(async () => {
        await result.current.saveQuestionnaireFHIR(questionnaireTest1FHIRNew as Questionnaire);
    });
    await waitFor(() => {
        const qUpdated = ensure(result.current.questionnaireRD);
        expect(qUpdated.item?.[0].text).toBe('First Name 1');
    });
});

test('saveQuestionnaireResponse', async () => {
    await setup();
    setData('launchContextParameters', {
        LaunchPatient: { name: 'LaunchPatient', resource: EXPECTED_RESOURCES.patient },
    });
    const { result, waitFor } = renderHook(() => useMain('demo-1'));

    await waitFor(() => {
        console.log(result.current.questionnaireResponseRD);
        const questionnaireResponse = ensure(result.current.questionnaireResponseRD);
        expect(questionnaireResponse.item?.[0].item?.[0].answer?.[0].value?.string).toEqual('Jane');
    });
    await act(async () => {
        result.current.saveQuestionnaireResponse(questionnaireResponseNew as QuestionnaireResponse);
    });
    await waitFor(() => {
        const questionnaireResponse = ensure(result.current.questionnaireResponseRD);
        expect(questionnaireResponse.item?.[0].answer?.[0].value?.string).toEqual('Jane2');
    });
});

test('saveMapping', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useMain('test-1'));

    await waitFor(() => {
        const mapping = ensure(result.current.mappingRD);
        expect(mapping.body.entry[0].request.method).toBe('PATCH');
    });
    await act(async () => {
        await result.current.saveMapping(mappingTest1New as Mapping);
    });
    await waitFor(() => {
        const mapping = ensure(result.current.mappingRD);
        expect(mapping.body.entry[0].request.method).toBe('PUT');
    });
});
