import { ensure } from '@beda.software/fhir-react';
import { isFailure, isSuccess } from '@beda.software/remote-data';
import { renderHook, act } from '@testing-library/react-hooks';
import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useMain } from 'web/src/containers/Main/useMain';
import { getFHIRResource, service } from 'web/src/services/fhir';
import { setData } from 'web/src/services/localStorage';

import { Mapping } from 'shared/src/contrib/aidbox';

import { EXPECTED_RESOURCES } from './resources';
import mappingDemo1 from './resources/Mapping/demo-1.json';
import mappingTest1New from './resources/Mapping/test-1-new.json';
import mappingTest1 from './resources/Mapping/test-1.json';
import mappingTest2 from './resources/Mapping/test-2.json';
import patientDemo1 from './resources/Patient/demo-1.json';
import patientTest1 from './resources/Patient/test-1.json';
import questionnaireDemo1 from './resources/Questionnaire/demo-1.json';
import questionnaireTest1FHIRNew from './resources/Questionnaire/test-1-fhir-new.json';
import questionnaireTest1 from './resources/Questionnaire/test-1.json';
import questionnaireResponseNew from './resources/QuestionnaireResponse/demo-1-new.json';

const timeOutMs = 30000;

async function setup() {
    return service({
        method: 'PUT',
        url: '',
        data: [
            patientTest1,
            mappingTest1,
            mappingTest2,
            questionnaireTest1,
            patientDemo1,
            mappingDemo1,
            questionnaireDemo1,
        ],
    });
}

test.skip(
    'saveQuestionnaireFHIR',
    async () => {
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
    },
    timeOutMs,
);

test.skip(
    'saveQuestionnaireResponse',
    async () => {
        setData('launchContextParameters', {
            LaunchPatient: { name: 'LaunchPatient', resource: EXPECTED_RESOURCES.patient },
        });

        await setup();
        const { result, waitFor } = renderHook(() => useMain('demo-1'));

        await waitFor(() => {
            const questionnaireResponse = ensure(result.current.questionnaireResponseRD);
            expect(questionnaireResponse.item?.[0].item?.[0].answer?.[0].value?.string).toEqual(
                'Jane',
            );
        });
        await act(async () => {
            result.current.saveQuestionnaireResponse(
                questionnaireResponseNew as QuestionnaireResponse,
            );
        });
        await waitFor(() => {
            const questionnaireResponse = ensure(result.current.questionnaireResponseRD);
            expect(questionnaireResponse.item?.[0].answer?.[0].value?.string).toEqual('Jane2');
        });
    },
    timeOutMs,
);

test.skip(
    'saveMapping',
    async () => {
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
    },
    timeOutMs,
);

test.skip(
    'saveNewMapping',
    async () => {
        const notFoundMappingId = 'foobar-100';
        const existingMappingId = 'foobar-101';

        await setup();
        const { result } = renderHook(() => useMain('test-1'));

        expect(
            result.current.saveNewMapping(
                EXPECTED_RESOURCES.mappingIdListEmpty,
                EXPECTED_RESOURCES.mappingInfoList,
            ),
        ).toBeUndefined();

        const responseBefore = await getFHIRResource<Mapping>({
            resourceType: 'Mapping',
            id: notFoundMappingId,
        });

        if (isFailure(responseBefore)) {
            expect(responseBefore.error.id).toBe('not-found');
        }

        await act(async () => {
            result.current.saveNewMapping(
                EXPECTED_RESOURCES.mappingIdList,
                EXPECTED_RESOURCES.mappingInfoList,
            );
        });

        const responseAfter = await getFHIRResource<Mapping>({
            resourceType: 'Mapping',
            id: existingMappingId,
        });

        if (isSuccess(responseAfter)) {
            expect(responseAfter.data.id).toBe(existingMappingId);
        } else {
            expect(responseAfter.error.id).toBe('not-found');
        }
    },
    timeOutMs,
);
