import { renderHook } from '@testing-library/react-hooks';
import _ from 'lodash';
import { act } from 'react-dom/test-utils';
import { EXPECTED_RESOURCES } from 'web/src/containers/Main/__test__/resources';
import { useMain } from 'web/src/containers/Main/useMain';
import { setData } from 'web/src/services/localStorage';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { service } from 'fhir-react/lib/services/service';
import { ensure } from 'fhir-react/lib/utils/tests';

import { Extension, Questionnaire } from 'shared/src/contrib/aidbox';

const questionnaireIdInitial = 'demo-1';

import mappingDemo1 from './resources/Mapping/demo-1.json';
import mappingDemo2 from './resources/Mapping/demo-2.json';
import patientDemo1 from './resources/Patient/demo-1.json';
import questionnaireDemo1 from './resources/Questionnaire/demo-1.json';
import questionnaireDemo3 from './resources/Questionnaire/demo-3.json';

const timeOutMs = 30000;

async function setup() {
    return service({
        method: 'PUT',
        url: '/',
        data: [patientDemo1, mappingDemo1, mappingDemo2, questionnaireDemo1, questionnaireDemo3],
    });
}

test.skip(
    'questionnaire is loaded',
    async () => {
        await setup();
        const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(
            () => {
                return isSuccess(result.current.assembledQuestionnaireRD);
            },
            { timeout: 10000 },
        );
        const questionnaire = ensure(result.current.assembledQuestionnaireRD) as Questionnaire;

        expect(questionnaire.assembledFrom).toBe(questionnaireIdInitial);
        expect(questionnaire.mapping![0]).toEqual(EXPECTED_RESOURCES.questionnaire.mapping![0]);
    },
    timeOutMs,
);

const getExtension = (q: { extension?: Extension[] }, url: string) => _.find(q.extension, { url });

const getMappingExtension = (q: { extension?: Extension[] }) =>
    getExtension(q, 'http://beda.software/fhir-extensions/questionnaire-mapper');

test.skip(
    'questionnaire in FHIR format is loaded',
    async () => {
        setData('fhirMode', true);

        await setup();
        const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            return isSuccess(result.current.questionnaireFHIRRD);
        });
        const questionnaire = ensure(result.current.questionnaireFHIRRD);
        expect(questionnaire.id).toBe(questionnaireIdInitial);
        const mappingFromQuestionnaire = getMappingExtension(questionnaire);
        const mappingFromQuestionnaireFHIRExpected = getMappingExtension(
            EXPECTED_RESOURCES.questionnaireFHIR,
        );
        expect(mappingFromQuestionnaire!.valueReference).toBeDefined();
        expect(mappingFromQuestionnaire!.valueReference).toEqual(
            mappingFromQuestionnaireFHIRExpected!.valueReference,
        );
    },
    timeOutMs,
);

test.skip(
    'questionnaireResponseRD',
    async () => {
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
    },
    timeOutMs,
);

test.skip(
    'mappingList demo-1',
    async () => {
        await setup();
        const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const mappingList = result.current.mappingList;
            expect(mappingList).toEqual(EXPECTED_RESOURCES.mappingListDemo1);
        });
    },
    timeOutMs,
);

test.skip(
    'mappingList demo-3',
    async () => {
        await setup();
        const { result, waitFor } = renderHook(() => useMain('demo-3'));

        await waitFor(() => {
            const mappingList = result.current.mappingList;
            expect(mappingList).toEqual(EXPECTED_RESOURCES.mappingListDemo3);
        });
    },
    timeOutMs,
);

test.skip(
    'activeMappingId',
    async () => {
        await setup();
        const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const activeMappingId = result.current.activeMappingId;
            expect(activeMappingId).toBe('demo-1');
        });
    },
    timeOutMs,
);

test.skip(
    'setActiveMappingId',
    async () => {
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
    },
    timeOutMs,
);

test.skip(
    'mappingRD',
    async () => {
        await setup();
        const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            return isSuccess(result.current.mappingRD);
        });
        const mapping = ensure(result.current.mappingRD);
        expect(_.omit(mapping, 'meta')).toEqual(EXPECTED_RESOURCES.mappingDemo1);
    },
    timeOutMs,
);

test.skip(
    'batchRequestRD',
    async () => {
        // TODO: fix problem with debug
        const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const batchRequest = ensure(result.current.batchRequestRD);
            expect(batchRequest.entry?.[0].resource.birthDate).toEqual('1980-01-01');
        });
    },
    timeOutMs,
);

test.skip(
    'applyMappings',
    async () => {
        const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const batchRequest = ensure(result.current.batchRequestRD);
            expect(batchRequest.entry?.[0].resource.birthDate).toEqual('1980-01-01');
        });
        // TODO: finish this test
    },
    timeOutMs,
);
