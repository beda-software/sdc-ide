import { renderHook, act } from '@testing-library/react-hooks';
// import { act } from 'react-dom/test-utils';
import _ from 'lodash';

import { Extension } from 'shared/src/contrib/aidbox';
import { ensure } from 'aidbox-react/src/utils/tests';

import { idExtraction, useMain } from 'src/containers/Main/hooks';

import { EXPECTED_RESOURCES } from 'src/containers/Main/__test__/resources';
import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { axiosInstance } from 'aidbox-react/src/services/instance';
import { setData } from 'src/services/localStorage';

const questionnaireIdInitial = 'demo-1';

beforeEach(async () => {
    setData('fhirMode', false);
    axiosInstance.defaults.auth = {
        username: 'root',
        password: 'secret',
    };
});

test('questionnaire is loaded', async () => {
    const { result, waitFor } = renderHook(useMain, { initialProps: questionnaireIdInitial });

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

    const { result, waitFor } = renderHook(useMain, { initialProps: questionnaireIdInitial });

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
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    let questionnaireResponse;
    await waitFor(() => {
        questionnaireResponse = ensure(result.current.questionnaireResponseRD);
    });
    questionnaireResponse = ensure(result.current.questionnaireResponseRD);
    expect(questionnaireResponse).toEqual(EXPECTED_RESOURCES.questRespPopulated);
});

test('mappingList demo-1', async () => {
    const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

    await waitFor(() => {
        const mappingList = result.current.mappingList;
        expect(mappingList).toEqual(EXPECTED_RESOURCES.mappingListDemo1);
    });
});

test('mappingList demo-3', async () => {
    const { result, waitFor } = renderHook(() => useMain('demo-3'));

    await waitFor(() => {
        const mappingList = result.current.mappingList;
        expect(mappingList).toEqual(EXPECTED_RESOURCES.mappingListDemo3);
    });
});

test('activeMappingId', async () => {
    const { result, waitFor } = renderHook(() => useMain('demo-3'));

    await waitFor(() => {
        const activeMappingId = result.current.activeMappingId;
        expect(activeMappingId).toBe('demo-1');
    });
});

test('setActiveMappingId', async () => {
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
            EXPECTED_RESOURCES.idExtractionResponse,
        ),
    ).toBe('foobar');
    expect(
        idExtraction(
            EXPECTED_RESOURCES.idExtractionIssue,
            EXPECTED_RESOURCES.idExtractionResourceUndefined,
            EXPECTED_RESOURCES.idExtractionResponse,
        ),
    ).toBe(undefined);
    expect(
        idExtraction(
            EXPECTED_RESOURCES.idExtractionIssue,
            EXPECTED_RESOURCES.idExtractionResource,
            EXPECTED_RESOURCES.idExtractionResponseUndefined,
        ),
    ).toBe(undefined);
});
