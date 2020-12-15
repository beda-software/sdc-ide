import { renderHook, act } from '@testing-library/react-hooks';
// import { act } from 'react-dom/test-utils';
import _ from 'lodash';

import { Questionnaire } from 'shared/lib/contrib/aidbox';
import { ensure, withRootAccess } from 'aidbox-react/lib/utils/tests';

import { useMain } from 'src/containers/Main/hooks';

import { EXPECTED_RESOURCES } from 'src/containers/Main/__test__/resources';

const questionnaireIdInitial = 'demo-1';

test('patient is loaded', async () => {
    await withRootAccess(async () => {
        const { result, waitFor } = renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const patient = ensure(result.current.patientRD);
            expect(patient.id).toBe(EXPECTED_RESOURCES.patient.id);
        });
    });
});

test('questionnaire is loaded', async () => {
    await withRootAccess(async () => {
        const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const questionnaire = ensure(result.current.questionnaireRD);
            expect(questionnaire.id).toBe(questionnaireIdInitial);
            expect(questionnaire.mapping![0]).toEqual(EXPECTED_RESOURCES.questionnaire.mapping![0]);
        });
    });
});

test('questionnaire in FHIR format is loaded', async () => {
    const getMappingExtexnsion = (q: Partial<Questionnaire> | any) =>
        _.find(q.extension, {
            url: 'http://beda.software/fhir-extensions/questionnaire-mapper',
        });

    await withRootAccess(async () => {
        const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            // console.log('--- result --- ', JSON.stringify(result, undefined, 2));
            const questionnaireFHIR = ensure(result.current.questionnaireFHIRRD);

            expect(questionnaireFHIR.id).toBe(questionnaireIdInitial);
            const mappingFromQuestionnaire = getMappingExtexnsion(questionnaireFHIR);
            const mappingFromQuestionnaireFHIRExpected = getMappingExtexnsion(EXPECTED_RESOURCES.questionnaireFHIR);
            expect(mappingFromQuestionnaire.valueReference.reference).toBeDefined();
            expect(mappingFromQuestionnaire.valueReference.reference).toEqual(
                mappingFromQuestionnaireFHIRExpected.valueReference.reference,
            );
        });
    });
});

test('questionnaireResponseRD', async () => {
    await withRootAccess(async () => {
        const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const questionnaireResponse = ensure(result.current.questionnaireResponseRD);
            // console.log('-- questionnaireResponse -', JSON.stringify(questionnaireResponse));
            expect(questionnaireResponse).toEqual(EXPECTED_RESOURCES.questRespPopulated);
        });
    });
});

test('mappingList demo-1', async () => {
    await withRootAccess(async () => {
        const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const mappingList = result.current.mappingList;
            expect(mappingList).toEqual(EXPECTED_RESOURCES.mappingListDemo1);
        });
    });
});

test('mappingList demo-3', async () => {
    await withRootAccess(async () => {
        const { result, waitFor } = await renderHook(() => useMain('demo-3'));

        await waitFor(() => {
            const mappingList = result.current.mappingList;
            expect(mappingList).toEqual(EXPECTED_RESOURCES.mappingListDemo3);
        });
    });
});

test('activeMappingId', async () => {
    await withRootAccess(async () => {
        const { result, waitFor } = await renderHook(() => useMain('demo-3'));

        await waitFor(() => {
            const activeMappingId = result.current.activeMappingId;
            // console.log('-- activeMappingId -', JSON.stringify(activeMappingId));
            expect(activeMappingId).toBe('demo-1');
        });
    });
});

test('setActiveMappingId', async () => {
    await withRootAccess(async () => {
        const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            ensure(result.current.questionnaireRD);
            expect(result.current.activeMappingId).toBe('demo-1');
        });

        act(() => {
            result.current.setActiveMappingId('demo-2');
        });

        expect(result.current.activeMappingId).toBe('demo-2');
    });
});

test('mappingRD', async () => {
    await withRootAccess(async () => {
        const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));

        await waitFor(() => {
            const mapping = ensure(result.current.mappingRD);
            expect(_.omit(mapping, 'meta')).toEqual(EXPECTED_RESOURCES.mappingDemo1);
        });
    });
});


// test.only('saveMapping', async () => {
//     await withRootAccess(async () => {
//         const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));
//
//         await waitFor(() => {
//             const mapping = ensure(result.current.mappingRD);
//             console.log('-- mapping -', JSON.stringify(mapping));
//             expect(_.omit(mapping, 'meta')).toEqual(EXPECTED_RESOURCES.mappingDemo1);
//         });
//     });
// });

// test.skip('batchRequestRD', async () => {
//     // TODO: fix problem with debug
//     await withRootAccess(async () => {
//         const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));
//
//         await waitFor(() => {
//             console.log('0909090 activeMappingId', result.current.batchRequestRD);
//             const batchRequest = ensure(result.current.batchRequestRD);
//             expect(batchRequest).toEqual({});
//         });
//     });
// });

// test.skip('applyMappings', async () => {
//     await withRootAccess(async () => {
//         const { result, waitFor } = await renderHook(() => useMain(questionnaireIdInitial));
//
//         await waitFor(() => {
//             const questFHIRUpdated = ensure(result.current.questionnaireFHIRRD);
//             expect({}).toEqual({});
//         });
//     });
// });
