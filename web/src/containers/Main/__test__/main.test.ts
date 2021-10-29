import { renderHook, act } from '@testing-library/react-hooks';
// import { act } from 'react-dom/test-utils';
import _ from 'lodash';

import { Extension } from 'shared/src/contrib/aidbox';
import { ensure } from 'aidbox-react/lib/utils/tests';

import { service } from 'aidbox-react/lib/services/service';

import { idExtraction, showToast, useMain } from 'src/containers/Main/hooks';

import { EXPECTED_RESOURCES } from 'src/containers/Main/__test__/resources';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { axiosInstance } from 'aidbox-react/lib/services/instance';
import { setData } from 'src/services/localStorage';

const questionnaireIdInitial = 'demo-1';

import questionnaireDemo1 from './resources/Questionnaire/demo-1.json';
import questionnaireDemo3 from './resources/Questionnaire/demo-3.json';
import mappingDemo1 from './resources/Mapping/demo-1.json';
import mappingDemo2 from './resources/Mapping/demo-2.json';
import patientDemo1 from './resources/Patient/demo-1.json';

async function setup() {
    return service({
        method: 'PUT',
        url: '',
        data: [patientDemo1, mappingDemo1, mappingDemo2, questionnaireDemo1, questionnaireDemo3],
    });
}

beforeEach(async () => {
    setData('fhirMode', false);
    axiosInstance.defaults.auth = {
        username: 'root',
        password: 'secret',
    };
});

test('questionnaire is loaded', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        return isSuccess(result.current.questionnaireRD);
    });
    const questionnaire = ensure(result.current.questionnaireRD);
    expect(questionnaire.assembledFrom).toBe(questionnaireIdInitial);
    expect(questionnaire.mapping![0]).toEqual(EXPECTED_RESOURCES.questionnaire.mapping![0]);
});

const getExtension = (q: { extension?: Extension[] }, url: string) => _.find(q.extension, { url });

const getMappingExtension = (q: { extension?: Extension[] }) =>
    getExtension(q, 'http://beda.software/fhir-extensions/questionnaire-mapper');

test('questionnaire in FHIR format is loaded', async () => {
    setData('fhirMode', true);

    await setup();
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        return isSuccess(result.current.questionnaireFHIRRD);
    });
    const questionnaire = ensure(result.current.questionnaireFHIRRD);
    expect(questionnaire.id).toBe(questionnaireIdInitial);
    const mappingFromQuestionnaire = getMappingExtension(questionnaire);
    const mappingFromQuestionnaireFHIRExpected = getMappingExtension(EXPECTED_RESOURCES.questionnaireFHIR);
    expect(mappingFromQuestionnaire!.valueReference).toBeDefined();
    expect(mappingFromQuestionnaire!.valueReference).toEqual(mappingFromQuestionnaireFHIRExpected!.valueReference);
});

test('questionnaireResponseRD', async () => {
    setData('launchContextParameters', {
        LaunchPatient: { name: 'LaunchPatient', resource: EXPECTED_RESOURCES.patient },
    });

    await setup();
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    let questionnaireResponse;
    await waitFor(() => {
        questionnaireResponse = ensure(result.current.questionnaireResponseRD);
    });
    questionnaireResponse = ensure(result.current.questionnaireResponseRD);
    expect(questionnaireResponse).toEqual(EXPECTED_RESOURCES.questRespPopulated);
});

test('mappingList demo-1', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        const mappingList = result.current.mappingList;
        expect(mappingList).toEqual(EXPECTED_RESOURCES.mappingListDemo1);
    });
});

test('mappingList demo-3', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useMain('demo-3'));

    await waitFor(() => {
        const mappingList = result.current.mappingList;
        console.log('mappingList', mappingList);
        expect(mappingList).toEqual(EXPECTED_RESOURCES.mappingListDemo3);
    });
});

test('activeMappingId', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        const activeMappingId = result.current.activeMappingId;
        expect(activeMappingId).toBe('demo-1');
    });
});

test('setActiveMappingId', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        ensure(result.current.questionnaireRD);
        expect(result.current.activeMappingId).toBe('demo-1');
    });

    act(() => {
        result.current.setActiveMappingId('demo-2');
    });

    expect(result.current.activeMappingId).toBe('demo-2');
});

test('mappingRD', async () => {
    await setup();
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        return isSuccess(result.current.mappingRD);
    });
    const mapping = ensure(result.current.mappingRD);
    expect(_.omit(mapping, 'meta')).toEqual(EXPECTED_RESOURCES.mappingDemo1);
});

test.skip('batchRequestRD', async () => {
    // TODO: fix problem with debug
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        const batchRequest = ensure(result.current.batchRequestRD);
        expect(batchRequest.entry?.[0].resource.birthDate).toEqual('1980-01-01');
    });
});

test.skip('applyMappings', async () => {
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        const batchRequest = ensure(result.current.batchRequestRD);
        expect(batchRequest.entry?.[0].resource.birthDate).toEqual('1980-01-01');
    });
    // TODO: finish this test
});

test('idExtraction', () => {
    expect(
        idExtraction(
            EXPECTED_RESOURCES.idExtractionIssue,
            EXPECTED_RESOURCES.idExtractionResource,
            EXPECTED_RESOURCES.idExtractionError,
        ),
    ).toBe('foobar');
    expect(
        idExtraction(
            EXPECTED_RESOURCES.idExtractionIssue,
            EXPECTED_RESOURCES.idExtractionResourceUndefined,
            EXPECTED_RESOURCES.idExtractionError,
        ),
    ).toBeUndefined();
    expect(
        idExtraction(
            EXPECTED_RESOURCES.idExtractionIssue,
            EXPECTED_RESOURCES.idExtractionResource,
            EXPECTED_RESOURCES.idExtractionErrorUndefined,
        ),
    ).toBeUndefined();
});

test('showToast', async () => {
    expect(
        showToast(
            EXPECTED_RESOURCES.showToastType,
            EXPECTED_RESOURCES.showToastError,
            EXPECTED_RESOURCES.showToastIndex,
        ),
    ).toBeTruthy();
    expect(showToast('success')).toBeTruthy();
});
